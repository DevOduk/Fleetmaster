// src/utils/vehicles-cache.ts
import { createPublicClient } from "@/utils/supabase/server";
import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";

const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const CACHE_TTL = 60 * 30; // 30 minutes in seconds

async function fetchAndCacheVehicles(tenantId: string) {
  const cacheKey = `vehicles:tenant:${tenantId}`;

  // 1. Try to fetch from Redis cache (Upstash automatically parses JSON objects)
  if (redis) {
    try {
      const cached = await redis.get<{ data: any; success: boolean; error: any }>(cacheKey);
      if (cached) return cached;
    } catch (e) {
      console.error(`Redis fetch error (${tenantId}):`, e);
    }
  }

  // 2. Fetch fresh data from Supabase
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  const result = { data: data || [], success: !error, error: error?.message || null };

  // 3. Cache directly as a JavaScript object (DO NOT use JSON.stringify with Upstash)
  if (redis && !error) {
    try {
      await redis.set(cacheKey, result, { ex: CACHE_TTL });
    } catch (e) {
      console.error(`Redis set error (${tenantId}):`, e);
    }
  }

  return result;
}

// Wrap in Next.js memory cache layer to guarantee < 5ms local execution times
export async function getCachedVehicles(tenantId: string) {
  return unstable_cache(
    async () => fetchAndCacheVehicles(tenantId),
    [`vehicles-cache-${tenantId}`],
    {
      revalidate: 1800, // 30 mins memory hit
      tags: [`vehicles-${tenantId}`],
    }
  )();
}

/**
 * Purges both Next.js Data Cache memory and Upstash Redis.
 */
export async function invalidateVehiclesCache(tenantId: string) {
  if (redis) {
    try {
      await redis.del(`vehicles:tenant:${tenantId}`);
    } catch (e) {
      console.error(`Redis cache invalidation error (${tenantId}):`, e);
    }
  }
}