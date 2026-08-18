import { createPublicClient } from "@/utils/supabase/server";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
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
        return typeof cachedTenant === "string"
          ? JSON.parse(cachedTenant)
          : cachedTenant;
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
      .select(`*, admins:fleetmaster_admins(*), yards:fleetmaster_yards(*)`)
      .eq("slug", normalizedSlug)
      .eq("subscription_status", "Active")
      .maybeSingle();

    if (error || !tenant) {
      return null;
    }

    // 3. WRITE BACK TO REDIS & MAP ID -> SLUG POINTER
    if (redis) {
      try {
        const stringifiedTenant = JSON.stringify(tenant);
        await Promise.all([
          redis.set(redisKey, stringifiedTenant, { ex: CACHE_TTL_SECONDS }),
          tenant.id ? redis.set(`tenant_id:${tenant.id}`, stringifiedTenant, { ex: CACHE_TTL_SECONDS }) : Promise.resolve(),
          // 🔑 CRITICAL BRIDGE: Map the ID directly to the slug name
          tenant.id ? redis.set(`map:id_to_slug:${tenant.id}`, normalizedSlug, { ex: CACHE_TTL_SECONDS }) : Promise.resolve(),
        ]);
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

// Update invalidation to handle slug or ID seamlessly
export async function invalidateTenantCache(slug?: string, tenantId?: string) {
  if (!redis) return;
  try {
    const keysToDelete: string[] = [];

    // If we only have an ID from admin side, try to find its corresponding slug via Redis pointer first
    let resolvedSlug = slug;
    if (!resolvedSlug && tenantId) {
      resolvedSlug = await redis.get<string>(`map:id_to_slug:${tenantId}`);
    }

    if (resolvedSlug) {
      keysToDelete.push(`tenant_slug:${resolvedSlug.toLowerCase().trim()}`);
    }
    if (tenantId) {
      keysToDelete.push(`tenant_id:${tenantId}`);
      keysToDelete.push(`map:id_to_slug:${tenantId}`);
      keysToDelete.push(`tenants:details:${tenantId}`);
    }
    keysToDelete.push("tenants:all");

    if (keysToDelete.length > 0) {
      await redis.del(...keysToDelete);
    }
  } catch (err) {
    console.error("Failed to invalidate tenant cache in Redis:", err);
  }
}
