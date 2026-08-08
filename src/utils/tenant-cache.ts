import { createPublicClient } from "@/utils/supabase/server";
import { Redis } from "@upstash/redis";

const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 Hours

export async function getCachedTenant(slug: string) {
  if (!slug) return null;
  const normalizedSlug = slug.toLowerCase().trim();
  const redisKey = `tenant_slug:${normalizedSlug}`;

  // 1. HIT REDIS CACHE FIRST
  if (redis) {
    try {
      const cachedTenant = await redis.get(redisKey);
      if (cachedTenant) {
        return typeof cachedTenant === "string" ? JSON.parse(cachedTenant) : cachedTenant;
      }
    } catch (err) {
      console.error("Redis fetch error in getCachedTenant:", err);
    }
  }

  // 2. FALLBACK TO SUPABASE DB
  try {
    const supabase = createPublicClient();
    const { data: tenant, error } = await supabase
      .from("fleetmaster_tenants")
      .select("*")
      .eq("slug", normalizedSlug)
      .eq("subscription_status", "Active")
      .maybeSingle();

    if (error || !tenant) {
      return null;
    }

    // 3. WRITE BACK TO REDIS SO PROXY / ROUTE CAN FIND IT INSTANTLY
    if (redis) {
      try {
        await redis.set(redisKey, JSON.stringify(tenant), { ex: CACHE_TTL_SECONDS });
        if (tenant.id) {
          await redis.set(`tenant_id:${tenant.id}`, JSON.stringify(tenant), { ex: CACHE_TTL_SECONDS });
        }
      } catch (err) {
        console.error("Redis set error in getCachedTenant:", err);
      }
    }

    return tenant;
  } catch (err) {
    console.error("Supabase fallback error in getCachedTenant:", err);
    return null;
  }
}

/**
 * Call this function whenever a tenant updates their settings/profile to clear stale Redis entries.
 */
export async function invalidateTenantCache(slug: string, tenantId?: string) {
  if (!redis) return;
  try {
    const keysToDelete = [`tenant_slug:${slug.toLowerCase().trim()}`];
    if (tenantId) keysToDelete.push(`tenant_id:${tenantId}`);
    await redis.del(...keysToDelete);
  } catch (err) {
    console.error("Failed to invalidate tenant cache in Redis:", err);
  }
}