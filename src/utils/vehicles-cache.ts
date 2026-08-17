// src/utils/vehicles-cache.ts
import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/utils/supabase/server";

interface CachedVehiclesResult {
  data: Record<string, unknown>[];
  success: boolean;
  error: string | null;
}

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const CACHE_TTL = 60 * 30; // 30 minutes in seconds

async function fetchAndCacheVehicles(
  tenantId: string,
): Promise<CachedVehiclesResult> {
  const cacheKey = `vehicles:tenant:${tenantId}`;

  // 1. Try to fetch from Redis cache
  if (redis) {
    try {
      const cached = await redis.get<CachedVehiclesResult>(cacheKey);

      if (cached) {
        return cached;
      }
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

  const result: CachedVehiclesResult = {
    data: (data ?? []) as Record<string, unknown>[],
    success: !error,
    error: error?.message ?? null,
  };

  // 3. Cache directly as a JavaScript object
  if (redis && !error) {
    try {
      await redis.set(cacheKey, result, { ex: CACHE_TTL });
    } catch (e) {
      console.error(`Redis set error (${tenantId}):`, e);
    }
  }

  return result;
}

// Wrap in Next.js memory cache layer
export async function getCachedVehicles(
  tenantId: string,
): Promise<CachedVehiclesResult> {
  return unstable_cache(
    async () => fetchAndCacheVehicles(tenantId),
    [`vehicles-cache-${tenantId}`],
    {
      revalidate: 1800,
      tags: [`vehicles-${tenantId}`],
    },
  )();
}

/**
 * Purges both Next.js Data Cache and Upstash Redis.
 */
export async function invalidateVehiclesCache(
  tenantId: string,
): Promise<void> {
  if (redis) {
    try {
      await redis.del(`vehicles:tenant:${tenantId}`);
    } catch (e) {
      console.error(`Redis cache invalidation error (${tenantId}):`, e);
    }
  }
}