"use server";

import { createClient } from "@/utils/supabase/server";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis Client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CACHE_TTL_SECONDS = 600; // Cache duration: 10 minutes

export async function getAllTenants() {
  const cacheKey = "tenants:all";

  try {
    // 1. Read from Redis Cache
    const cachedData = await redis.get<any[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  } catch (cacheErr) {
    console.error("Redis read error in getAllTenants:", cacheErr);
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_tenants")
    .select(
      "id, slug, name, phone, about, email, country, county, yards, timezone, tenant_logo, subscription_status, created_at, expiry_date"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error:", error.message);
    return [];
  }

  const result = data || [];

  // 3. Store in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTL_SECONDS });
  } catch (cacheErr) {
    console.error("Redis write error in getAllTenants:", cacheErr);
  }

  return result;
}

export async function fetchTenantDetails(tenantId: string) {
  const cacheKey = `tenants:details:${tenantId}`;

  try {
    // 1. Read from Redis Cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return { data: cachedData, error: null, success: true };
    }
  } catch (cacheErr) {
    console.error(`Redis read error in fetchTenantDetails (${tenantId}):`, cacheErr);
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_tenants")
    .select("*")
    .eq("id", tenantId)
    .single();

  if (error) {
    return { data, error, success: false };
  }

  // 3. Store in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL_SECONDS });
  } catch (cacheErr) {
    console.error(`Redis write error in fetchTenantDetails (${tenantId}):`, cacheErr);
  }

  return { data, error: null, success: true };
}

export async function fetchTenantSubscriptions(tenantId: string) {
  const cacheKey = `tenants:subscriptions:${tenantId}`;

  try {
    // 1. Read from Redis Cache
    const cachedData = await redis.get<any[]>(cacheKey);
    if (cachedData) {
      return { data: cachedData, error: null, success: true };
    }
  } catch (cacheErr) {
    console.error(`Redis read error in fetchTenantSubscriptions (${tenantId}):`, cacheErr);
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_payments")
    .select("amount, tenant_id, message, provider, created_at")
    .eq("tenant_id", tenantId)
    .eq("status", "Success")
    .ilike("message", "Subscription renewal for package:%")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { data: [], error, success: false };
  }

  const subscriptions = data.map((item) => {
    return {
      label: item.message.split("Subscription renewal for package: ")[1],
      value: item.message,
      date: item.created_at,
      amount: item.amount,
      method: item.provider,
    };
  });

  // 3. Store in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(subscriptions), { ex: CACHE_TTL_SECONDS });
  } catch (cacheErr) {
    console.error(`Redis write error in fetchTenantSubscriptions (${tenantId}):`, cacheErr);
  }

  return { data: subscriptions, error: null, success: true };
}

export async function updateTenantDetails(tenantId: string, updatedData: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_tenants")
    .update({ ...updatedData, last_updated: new Date() })
    .eq("id", tenantId);

  if (!error) {
    // Invalidate global tenant list & tenant specific details
    await redis.del("tenants:all");
    await redis.del(`tenants:details:${tenantId}`);
  }

  return { data, error, success: !error };
}

export async function createNewTenant(newTenantData: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_tenants")
    .insert(newTenantData)
    .select("id")
    .single();

  if (!error) {
    // Invalidate global tenant list cache
    await redis.del("tenants:all");
  }

  return { data, error, success: !error };
}