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
  try {
    if (!newTenantData || typeof newTenantData !== "object") {
      return {
        success: false,
        data: null,
        error: { message: "Invalid tenant data provided." },
      };
    }
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("fleetmaster_tenants")
      .insert(newTenantData)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase createNewTenant error:", error);

      let customMessage = "Failed to create company record. Please try again.";

      // Map common PostgreSQL / Supabase error codes to clear messages
      switch (error.code) {
        case "23505": // Unique constraint violation
          const errText = `${error.details || ''} ${error.message || ''}`.toLowerCase();

          if (errText.includes("slug")) {
            customMessage = "A company with this subdomain/slug already exists.";
          } else if (errText.includes("email")) {
            customMessage = "A company with this email address is already registered.";
          } else if (errText.includes("phone")) {
            customMessage = "A company with this phone number is already registered.";
          } else if (errText.includes("name")) {
            customMessage = "A company with this name is already registered.";
          } else {
            customMessage = "A company with these details already exists.";
          }
          break;

        case "23514": // Check constraint violation
          if (error.message?.includes("check_status_values")) {
            customMessage = "Invalid company status value provided.";
          } else {
            customMessage = "One or more provided fields failed database validation rules.";
          }
          break;

        case "23502": // Not-null constraint violation
          const columnMatch = error.message?.match(/column "([^"]+)"/);
          const columnName = columnMatch ? columnMatch[1] : "required field";
          customMessage = `Missing required field: ${columnName.replace(/_/g, " ")}.`;
          break;

        case "22P02": // Invalid text representation (e.g. wrong data type)
          customMessage = "Invalid data format provided for one of the fields.";
          break;

        case "42P01": // Undefined table
          customMessage = "Database table configuration error. Please contact support.";
          break;
      }

      return {
        success: false,
        data: null,
        error: {
          code: error.code,
          message: customMessage,
          details: error.details || error.message,
        },
      };
    }

    // Invalidate global tenant list cache on success
    if (redis) {
      try {
        await redis.del("tenants:all");
      } catch (cacheErr) {
        console.error("Redis cache invalidation error (createNewTenant):", cacheErr);
      }
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (err: any) {
    console.error("Unexpected error in createNewTenant:", err);
    return {
      success: false,
      data: null,
      error: {
        message: err.message || "An unexpected system error occurred while creating the company.",
      },
    };
  }
}