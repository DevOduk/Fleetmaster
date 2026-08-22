"use server";

import { createClient } from "@/utils/supabase/server";
import { invalidateTenantCache } from "@/utils/tenant-cache";
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
    const cachedData = await redis.get<any[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  } catch (cacheErr) {
    console.error("Redis read error in getAllTenants:", cacheErr);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_tenants")
    .select(
      `id, slug, name, phone, about, email, country, county, timezone, tenant_logo, subscription_status,subscription_plan, created_at, expiry_date, admins:fleetmaster_admins(*), yards:fleetmaster_yards(*)`,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error:", error.message);
    return [];
  }

  const result = data || [];

  try {
    await redis.set(cacheKey, JSON.stringify(result), {
      ex: CACHE_TTL_SECONDS,
    });
  } catch (cacheErr) {
    console.error("Redis write error in getAllTenants:", cacheErr);
  }

  return result;
}

export async function fetchTenantDetails(tenantId: string) {
  const cacheKey = `tenants:details:${tenantId}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return { data: cachedData, error: null, success: true };
    }
  } catch (cacheErr) {
    console.error(`Redis read error in fetchTenantDetails (${tenantId}):`, cacheErr);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_tenants")
    .select(`*, admins:fleetmaster_admins(*), yards:fleetmaster_yards(*)`)
    .eq("id", tenantId)
    .single();

  if (error || !data) {
    return { data, error, success: false };
  }

  try {
    // 🔑 Store both details AND refresh the ID-to-slug bridge pointer for client caching
    await Promise.all([
      redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL_SECONDS }),
      data.slug && data.id
        ? redis.set(`map:id_to_slug:${data.id}`, data.slug.toLowerCase().trim(), { ex: CACHE_TTL_SECONDS })
        : Promise.resolve(),
    ]);
  } catch (cacheErr) {
    console.error(`Redis write error in fetchTenantDetails (${tenantId}):`, cacheErr);
  }

  return { data, error: null, success: true };
}

export async function fetchTenantSubscriptions(tenantId: string) {
  const cacheKey = `subscriptions:tenant:${tenantId}`;

  try {
    const cachedData = await redis.get<any[]>(cacheKey);
    if (cachedData) {
      return { data: cachedData, error: null, success: true };
    }
  } catch (cacheErr) {
    console.error(`Redis read error in fetchTenantSubscriptions (${tenantId}):`, cacheErr);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_expenses")
    .select("amount, tenant_id, description, method, currency, category, created_at")
    .eq("tenant_id", tenantId)
    .ilike("category", "subscription")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { data: [], error, success: false };
  }

  const subscriptions = data.map((item) => {
    return {
      label: item.description.split("Subscription renewal for package: ")[1],
      value: item.description,
      date: item.created_at,
      amount: item.amount,
      method: item.method,
    };
  });

  try {
    await redis.set(cacheKey, JSON.stringify(subscriptions), {
      ex: CACHE_TTL_SECONDS,
    });
  } catch (cacheErr) {
    console.error(`Redis write error in fetchTenantSubscriptions (${tenantId}):`, cacheErr);
  }

  return { data: subscriptions, error: null, success: true };
}

export async function updateTenantDetails(tenantId: string, updatedData: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_tenants")
    .update({ ...updatedData, last_updated: new Date().toISOString() }) // use .toISOString() for dates
    .eq("id", tenantId)
    .select()
    .single(); 

  if (!error) {
    await invalidateTenantCache(undefined, tenantId);
  }

  return { data, error, success: !error };
}

export async function updateTenantYardDetails(
  yardId: string,
  tenantId: string,
  yardData: any,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_yards")
    .update({
      title: yardData.title,
      description: yardData.description,
      image_url: yardData.image_url,
      location: yardData.location,
      last_updated: new Date(),
    })
    .eq("id", yardId)
    .select()
    .single();

  if (!error) {
    await invalidateTenantCache(undefined, tenantId);
  }

  return { data, error, success: !error };
}

export async function createTenantYard(tenantId: string, yardData: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_yards")
    .insert({
      tenant_id: tenantId,
      title: yardData.title,
      description: yardData.description,
      image_url: yardData.image_url,
      location: yardData.location,
      created_at: new Date(),
      last_updated: new Date(),
    })
    .select()
    .single();

  if (!error) {
    await invalidateTenantCache(undefined, tenantId);
  }

  return { data, error, success: !error };
}

export async function deleteTenantYard(tenantId: string, yardId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_yards")
    .delete()
    .eq("id", yardId);

  if (!error) {
    await invalidateTenantCache(undefined, tenantId);
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
      .select("id, slug") // 🔑 Return slug too so we can wire the bridge pointer
      .single();

    if (error) {
      console.error("Supabase createNewTenant error:", error);
      let customMessage = "Failed to create company record. Please try again.";

      switch (error.code) {
        case "23505":
          const errText = `${error.details || ""} ${error.message || ""}`.toLowerCase();
          if (errText.includes("slug")) {
            customMessage = "A company with this subdomain/slug already exists.";
          } else if (errText.includes("email")) {
            customMessage = "A company with this email address is already registered.";
          } else if (errText.includes("phone")) {
            customMessage = "A company with this phone number is already registered.";
          } else {
            customMessage = "A company with these details already exists.";
          }
          break;
        default:
          customMessage = "A database error occurred during creation.";
          break;
      }

      return {
        success: false,
        data: null,
        error: { code: error.code, message: customMessage, details: error.details || error.message },
      };
    }

    // 🔑 Initialize bridge map pointer and invalidate global list cache
    if (redis && data) {
      try {
        await Promise.all([
          redis.del("tenants:all"),
          data.slug && data.id
            ? redis.set(`map:id_to_slug:${data.id}`, data.slug.toLowerCase().trim(), { ex: CACHE_TTL_SECONDS })
            : Promise.resolve(),
        ]);
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
      error: { message: err.message || "An unexpected system error occurred." },
    };
  }
}