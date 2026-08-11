"use server";

import { createClient } from "@/utils/supabase/server";
import { hash } from "bcrypt-ts";
import { Redis } from "@upstash/redis";
import { retryDuration } from "@/data/globalExports";
import crypto from "crypto";
import { Resend } from "resend";
import { VerifyEmailNotification } from "@/utils/templates/email-templates";


// Initialize Upstash Redis Client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CACHE_TTL_SECONDS = 900; // Cache duration: 15 minutes
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT || "12");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function createTenantAdmin(newTenantAdmin: any) {
  try {
    const supabase = await createClient();

    // 1. Generate a secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpValidityMinutes = retryDuration / 60;
    const otpExpiresAt = new Date(Date.now() + otpValidityMinutes * 60 * 1000).toISOString();
    const hashedPassword = await hash(newTenantAdmin.password, SALT_ROUNDS);

    const { error, data } = await supabase
      .from("fleetmaster_admins")
      .insert({
        ...newTenantAdmin,
        password: hashedPassword, // Store the full hash
        otp_code: otp,
        otp_expires_at: otpExpiresAt
      })
      .select(`id, first_name, last_name, email, phone, timezone, language, created_at, city, verification_status, country, role, tenant_id, profile_pic, postal_code, socials, fleetmaster_tenants(*)`)
      .single();

    if (!error && newTenantAdmin?.tenant_id) {
      // Invalidate the admin list cache for this specific tenant
      await redis.del(`tenant:admins:${newTenantAdmin.tenant_id}`);
    }

    if (!error) {
      // 3. Dispatch the verification email via Resend
      const { error: mailError } = await resend.emails.send({
        from: "FleetMaster <onboarding@resend.dev>", // Replace with your domain when verified
        to: newTenantAdmin.email,
        subject: `${otp} is your verification code`,
        html: VerifyEmailNotification(otp, otpValidityMinutes),
      });

      return { data, success: !error, error, mailError };
    }

    if (error) {
      console.error("Supabase insert error:", error);

      let friendlyMessage = "An unexpected error occurred while creating the account. Please try again.";

      if (error.code === '23505') {
        if (error.message.includes("email") || error.details?.includes("email")) {
          friendlyMessage = "An account with this email address already exists. Sign in or use a different email.";
        } else if (error.message.includes("phone") || error.details?.includes("phone")) {
          friendlyMessage = "This phone number is already registered.";
        } else {
          friendlyMessage = "A user with these details already exists. Please check your information and try again.";
        }
      }

      return {
        data: null,
        success: false,
        error: { message: friendlyMessage }
      };
    }

  } catch (err: any) {
    console.error("New Tenant Admin Creation failure:", err);
    return { success: false, error: err.message || "Failed to register admin." };
  }
}

export async function getTenantAdmins(tenantId: string) {
  const cacheKey = `tenant:admins:${tenantId}`;

  try {
    // 1. Read from Redis Cache
    const cachedData = await redis.get<any[]>(cacheKey);
    if (cachedData) {
      return { data: cachedData, success: true, error: null };
    }
  } catch (cacheErr) {
    console.error(`Redis read error in getTenantAdmins (${tenantId}):`, cacheErr);
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_admins")
    .select("id, phone, email, bio, first_name, last_name, role, profile_pic, created_at")
    .eq("tenant_id", tenantId);

  if (error) {
    return { data, success: false, error };
  }

  // 3. Store in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL_SECONDS });
  } catch (cacheErr) {
    console.error(`Redis write error in getTenantAdmins (${tenantId}):`, cacheErr);
  }

  return { data, success: true, error: null };
}

export async function getTenantAdminDetails(id: string) {
  const cacheKey = `user:profile:${id}:admin`;

  try {
    // 1. Read from Redis Cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return { data: cachedData, success: true, error: null };
    }
  } catch (cacheErr) {
    console.error(`Redis read error in getTenantAdminDetails (${id}):`, cacheErr);
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_admins")
    .select(`id, first_name, last_name, email, phone, created_at, city, verification_status, country, role, tenant_id, profile_pic, fleetmaster_tenants(*)`)
    .eq("id", id)
    .single();

  if (error) {
    return { data, success: false, error };
  }

  // 3. Store in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL_SECONDS });
  } catch (cacheErr) {
    console.error(`Redis write error in getTenantAdminDetails (${id}):`, cacheErr);
  }

  return { data, success: true, error: null };
}

export async function updateProfileDetails({ id, profileDetails }: { id: string; profileDetails: any }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_admins")
    .update({ ...profileDetails, updated_at: new Date() })
    .eq("id", id)
    .select("*")
    .single();

  if (!error && data) {
    // Invalidate the individual admin profile cache
    await redis.del(`user:profile:${id}:admin`);

    // Invalidate the tenant's admin list cache if tenant_id is available
    if (data.tenant_id) {
      await redis.del(`tenant:admins:${data.tenant_id}`);
    }
  }

  return { data, error, success: !error };
}