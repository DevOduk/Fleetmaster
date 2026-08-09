"use server";

import { createClient } from "@/utils/supabase/server";
import { hash } from "bcrypt-ts";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis Client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CACHE_TTL_SECONDS = 900; // Cache duration: 15 minutes
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT || "12");

export async function createTenantAdmin(newTenantAdmin: any) {
  try {
    const supabase = await createClient();

    // Pass the number of rounds, NOT a string salt
    const hashedPassword = await hash(newTenantAdmin.password, SALT_ROUNDS);

    const { error, data } = await supabase
      .from("fleetmaster_admins")
      .insert({
        ...newTenantAdmin,
        password: hashedPassword, // Store the full hash
      })
      .select("*")
      .single();

    if (!error && newTenantAdmin?.tenant_id) {
      // Invalidate the admin list cache for this specific tenant
      await redis.del(`tenant:admins:${newTenantAdmin.tenant_id}`);
    }

    return { data, success: !error, error };
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