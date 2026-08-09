"use server";

import { createClient } from "@/utils/supabase/server";
import { hash } from "bcrypt-ts";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis Client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT || "12");
const CACHE_TTL_SECONDS = 600; // Cache duration: 10 minutes

/**
 * Helper to safely scan and delete key patterns (for cache invalidation)
 */
async function invalidateCachePattern(pattern: string) {
  try {
    let cursor = 0;
    do {
      const [nextCursor, keys] = await redis.scan(cursor, { match: pattern, count: 100 });
      cursor = typeof nextCursor === "number" ? nextCursor : parseInt(nextCursor, 10);

      if (keys && keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== 0);
  } catch (err) {
    console.error(`Failed to invalidate cache pattern ${pattern}:`, err);
  }
}

export async function getAllAdmins() {
  const cacheKey = "admins:main:all";

  try {
    // 1. Read from Redis Cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return { data: cachedData, success: true, error: null };
    }
  } catch (cacheErr) {
    console.error("Redis read error in getAllAdmins:", cacheErr);
  }

  // 2. Cache miss: Fetch from Supabase
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_main_admins")
    .select("id, phone, email, bio, first_name, last_name, role, profile_pic, created_at");

  if (error) {
    return { data, success: false, error };
  }

  // 3. Store result in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL_SECONDS });
  } catch (cacheErr) {
    console.error("Redis write error in getAllAdmins:", cacheErr);
  }

  return { data, success: true, error: null };
}

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

    if (!error) {
      // Invalidate relevant tenant admins cache
      if (newTenantAdmin.tenant_id) {
        await redis.del(`admins:tenant:${newTenantAdmin.tenant_id}`);
      }
      await invalidateCachePattern("admins:tenant:*");
    }

    return { data, success: !error, error };
  } catch (err: any) {
    console.error("New Tenant Admin Creation failure:", err);
    return { success: false, error: err.message || "Failed to register admin." };
  }
}

export async function getTenantAdmins(id: string) {
  const cacheKey = `admins:tenant:${id}`;

  try {
    // 1. Read from Redis Cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return { data: cachedData, success: true, error: null };
    }
  } catch (cacheErr) {
    console.error(`Redis read error in getTenantAdmins (${id}):`, cacheErr);
  }

  // 2. Cache miss: Fetch from Supabase
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_admins")
    .select("id, phone, email, bio, first_name, last_name, role, profile_pic, created_at")
    .eq("tenant_id", id);

  if (error) {
    return { data, success: false, error };
  }

  // 3. Store result in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL_SECONDS });
  } catch (cacheErr) {
    console.error(`Redis write error in getTenantAdmins (${id}):`, cacheErr);
  }

  return { data, success: true, error: null };
}

export async function updateProfileDetails({
  id,
  profileDetails,
}: {
  id: string;
  profileDetails: any;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_main_admins")
    .update({ ...profileDetails, updated_at: new Date() })
    .eq("id", id)
    .single();

  if (!error) {
    // Invalidate main admins list cache
    await redis.del("admins:main:all");
  }

  return { data, error, success: !error };
}