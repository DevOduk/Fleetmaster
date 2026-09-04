"use server";

import { createClient } from "@/utils/supabase/server";
import { hash, compare } from "bcrypt-ts";
import { Resend } from "resend";
import crypto from "crypto";
import { retryDuration } from "@/data/globalExports";
import { VerifyEmailNotification } from "@/utils/templates/email-templates";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT || "12");
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to build consistent Redis cache keys matching your GET route
function getUserCacheKey(id: string, role: string = "client") {
  const normalizedType =
    role === "Client" ? "client" : 'admin';
  return `user:profile:${id}:${normalizedType}`;
}

function getTenantClientsCacheKey(tenantId: string) {
  return `tenant:clients:${tenantId}`;
}

export async function createTenantClient(newTenantClient: any) {
  let userEmail = "";

  try {
    const supabase = await createClient();
    const hashedPassword = await hash(newTenantClient.password, SALT_ROUNDS);

    userEmail = newTenantClient.email;

    // 1. Generate a secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpValidityMinutes = retryDuration / 60;
    const otpExpiresAt = new Date(
      Date.now() + otpValidityMinutes * 60 * 1000,
    ).toISOString();

    // 2. Insert user along with their active OTP credentials
    const { error, data } = await supabase
      .from("fleetmaster_clients")
      .insert({
        ...newTenantClient,
        password: hashedPassword,
        otp_code: otp,
        otp_expires_at: otpExpiresAt,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);

      let friendlyMessage =
        "An unexpected error occurred while creating the account. Please try again.";

      if (error.code === "23505") {
        if (
          error.message.includes("email") ||
          error.details?.includes("email")
        ) {
          friendlyMessage =
            "Email Blocked. Sign in or use a different email.";
        } else if (
          error.message.includes("phone") ||
          error.details?.includes("phone")
        ) {
          friendlyMessage = "This phone number is already registered.";
        } else {
          friendlyMessage =
            "A user with these details already exists. Please check your information and try again.";
        }
      }

      return {
        data: null,
        success: false,
        error: { message: friendlyMessage },
      };
    }

    // 3. SET Cache immediately upon creation
    const cacheKey = getUserCacheKey(data.id, data.role);
    await redis
      .set(cacheKey, JSON.stringify(data))
      .catch((e) => console.error("Redis set failure on create:", e));
    redis.del(`tenant:clients:${data.tenant_id}`)

    // 4. Dispatch the verification email via Resend
    const { error: mailError } = await resend.emails.send({
      from: "FleetMaster <onboarding@resend.dev>",
      to: userEmail,
      subject: `${otp} is your verification code`,
      html: VerifyEmailNotification(otp, otpValidityMinutes),
    });

    return {
      data: data,
      success: true,
      error: {
        message: mailError
          ? `Account created successfully, verify your account to proceed:`
          : "Account created successfully",
      },
    };
  } catch (err: any) {
    console.error("New Tenant Admin Creation failure:", err);
    return {
      data: null,
      success: false,
      error: { message: err.message || "A system connection error occurred." },
    };
  }
}

export async function updateProfileDetails(
  id: string,
  profileDetails: any,
) {
  const supabase = await createClient();
  const lastSeen = new Date().toISOString();
  const { data, error } = await supabase
    .from("fleetmaster_clients")
    .update({ ...profileDetails, updated_at: lastSeen, last_seen: lastSeen })
    .eq("id", id)
    .select()
    .single();

  if (!error && data) {
    // UPDATE/SET Cache with fresh data
    const cacheKey = getUserCacheKey(id, "client");
    await redis
      .del(`tenant:clients:${data.tenant_id}`)
      .catch((cacheError) =>
        console.error("Tenant client cache invalidation failed:", cacheError),
      );
    await redis
      .set(cacheKey, JSON.stringify(data))
      .catch((e) => console.error("Redis cache update failure:", e));
  }

  return { data, error, success: !error };
}

export async function updatePassword(
  id: string,
  profileDetails: any,
) {
  try {
    if (profileDetails.role !== "Client") {
      return { success: false, error: { message: "Access denied.", code: 403, status: "ACCESS_DENIED" } };
    }
    if (!id) {
      return { success: false, error: { message: "User ID is required." } };
    }

    const { old_password, confirm_password, ...restDetails } = profileDetails;

    if (!old_password || !confirm_password) {
      return {
        success: false,
        error: { message: "Both current and new passwords are required." },
      };
    }

    const supabase = await createClient();

    // 1. Fetch current stored password hash
    const { data: user, error: fetchError } = await supabase
      .from("fleetmaster_clients")
      .select("password")
      .eq("id", id)
      .single();

    if (fetchError || !user) {
      return {
        success: false,
        error: { message: fetchError ? fetchError.message : "User account not found." },
      };
    }

    // 2. Verify old password against stored hash
    const isPasswordValid = await compare(old_password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        error: { message: "You have entered an Incorrect password." },
      };
    }

    // 3. Hash the new password
    const newPasswordHash = await hash(confirm_password, 10);

    // 4. Update password and profile details safely
    const { data, error: updateError } = await supabase
      .from("fleetmaster_clients")
      .update({
        ...restDetails,
        password: newPasswordHash,
        updated_at: new Date().toISOString(),
        last_seen: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: { message: "Failed to update password. Please try again." },
      };
    }

    // DELETE Cache so the next request forces a fresh fetch with updated state
    const cacheKey = getUserCacheKey(id, profileDetails.role);
    await redis
      .del(cacheKey)
      .catch((e) => console.error("Redis cache deletion failure:", e));

    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: { message: err.message || "An unexpected error occurred." },
    };
  }
}

export async function fetchClientsForTenant(tenantId: string) {
  const cacheKey = getTenantClientsCacheKey(tenantId);

  try {
    const cachedClients = await redis.get(cacheKey);

    if (cachedClients) {
      const parsedClients =
        typeof cachedClients === "string"
          ? JSON.parse(cachedClients)
          : cachedClients;

      return {
        data: parsedClients,
        success: true,
        error: null,
      };
    }
  } catch (error) {
    console.error("Redis cache read failure (fetchClientsForTenant):", error);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_clients")
    .select(
      `id, first_name, last_name, country, created_at, bio, email, phone, role, profile_pic, tenant_id, last_seen`,
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (!error && data) {
    await redis
      .set(cacheKey, JSON.stringify(data))
      .catch((redisError) =>
        console.error("Redis cache write failure (fetchClientsForTenant):", redisError),
      );
  }

  return { data, success: !error, error };
}

export async function getTenantClientDetails(id: string) {
  const cacheKey = `user:profile:${id}:client`;

  try {
    // 1. Read from Redis Cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return { data: cachedData, success: true, error: null };
    }
  } catch (cacheErr) {
    console.error(
      `Redis read error in getTenantClientDetails (${id}):`,
      cacheErr,
    );
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_clients")
    .select(
      `id, first_name, last_name, email, phone, created_at, city, verification_status, country, role, tenant_id, profile_pic, fleetmaster_tenants(*)`,
    )
    .eq("id", id)
    .single();

  if (error) {
    return { data, success: false, error };
  }

  // 3. Store in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(data));
  } catch (cacheErr) {
    console.error(
      `Redis write error in getTenantClientDetails (${id}):`,
      cacheErr,
    );
  }

  return { data, success: true, error: null };
}
