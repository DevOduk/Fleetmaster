"use server";

import { createClient } from "@/utils/supabase/server";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis Client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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

export async function createPayment(newPayment: any) {
  try {
    const supabase = await createClient();

    const { error, data } = await supabase
      .from("fleetmaster_payments")
      .insert(newPayment)
      .select("*")
      .single();

    if (!error) {
      // Invalidate global list cache
      await redis.del("payments:all");

      // Invalidate specific tenant payments cache if tenant_id exists
      if (newPayment?.tenant_id) {
        await redis.del(`payments:tenant:${newPayment.tenant_id}`);
      }

      await invalidateCachePattern("payments:tenant:*");
    }

    return { data, success: !error, error };
  } catch (err: any) {
    console.error("Payment Creation failure:", err);
    return { success: false, error: err.message || "Failed to record payment." };
  }
}

export async function fetchAllPayments() {
  const cacheKey = "payments:all";

  try {
    // 1. Read from Redis
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return { success: true, data: cachedData };
    }
  } catch (cacheErr) {
    console.error("Redis read error in fetchAllPayments:", cacheErr);
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_payments")
    .select(`*`)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  // 3. Store in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL_SECONDS });
  } catch (cacheErr) {
    console.error("Redis write error in fetchAllPayments:", cacheErr);
  }

  return { success: true, data };
}

export async function fetchPaymentDetails(id: string) {
  const cacheKey = `payments:details:${id}`;

  try {
    // 1. Read from Redis
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return { data: cachedData, error: null, success: true };
    }
  } catch (cacheErr) {
    console.error(`Redis read error in fetchPaymentDetails (${id}):`, cacheErr);
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_payments")
    .select(`*`)
    .eq("id", id)
    .single();

  if (error) {
    return { data, error, success: false };
  }

  // 3. Store in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL_SECONDS });
  } catch (cacheErr) {
    console.error(`Redis write error in fetchPaymentDetails (${id}):`, cacheErr);
  }

  return { data, error: null, success: true };
}

export async function fetchPaymentsForAdmin(tenantId: string) {
  const cacheKey = `payments:tenant:${tenantId}`;

  try {
    // 1. Read from Redis
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return { data: cachedData, success: true, error: null };
    }
  } catch (cacheErr) {
    console.error(`Redis read error in fetchPaymentsForAdmin (${tenantId}):`, cacheErr);
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_payments")
    .select(`*`)
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data, success: false, error };
  }

  // 3. Store in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL_SECONDS });
  } catch (cacheErr) {
    console.error(`Redis write error in fetchPaymentsForAdmin (${tenantId}):`, cacheErr);
  }

  return { data, success: true, error: null };
}

export async function fetchAllSubscriptionPayments() {
  const cacheKey = "payments:subscriptions:all";

  try {
    // 1. Read from Redis
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  } catch (cacheErr) {
    console.error("Redis read error in fetchAllPayments:", cacheErr);
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_payments")
    .select(`*`)
    .ilike('message', `Subscription renewal for package:%`)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }
  // 3. Store in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL_SECONDS });
  } catch (cacheErr) {
    console.error("Redis write error in fetchAllPayments:", cacheErr);
  }

  return data || [];
}