"use server";

import { createClient } from "@/utils/supabase/server";
import { getCachedVehicles } from "@/utils/vehicles-cache";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis Client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CACHE_TTL_SECONDS = 600; // Cache duration: 10 minutes

/**
 * Helper to safely scan and delete key patterns (for tenant cache invalidation)
 */
async function invalidateCachePattern(pattern: string) {
  try {
    let cursor = 0;
    do {
      const [nextCursor, keys] = await redis.scan(cursor, {
        match: pattern,
        count: 100,
      });
      cursor =
        typeof nextCursor === "number" ? nextCursor : parseInt(nextCursor, 10);

      if (keys && keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== 0);
  } catch (err) {
    console.error(`Failed to invalidate cache pattern ${pattern}:`, err);
  }
}

export async function fetchAllVehicles() {
  const cacheKey = "vehicles:all";

  try {
    // 1. Read from Redis Cache
    const cachedData = await redis.get<any[]>(cacheKey);
    if (cachedData) {
      return { data: cachedData, success: true, error: null };
    }
  } catch (cacheErr) {
    console.error("Redis read error in fetchAllVehicles:", cacheErr);
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .select(`*, tenant:fleetmaster_tenants(name), location:fleetmaster_yards(*)`)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, success: false, error };
  }

  const formattedData = data?.map((vehicle) => ({
    ...vehicle,
    owner: vehicle.tenant?.name || vehicle.owner,
  }));

  // 3. Store in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(formattedData), {
      ex: CACHE_TTL_SECONDS,
    });
  } catch (cacheErr) {
    console.error("Redis write error in fetchAllVehicles:", cacheErr);
  }

  return { data: formattedData, success: true, error: null };
}

export async function fetchVehicleDetails(id: number) {
  const cacheKey = `vehicles:details:${id}`;

  try {
    // 1. Read from Redis Cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return { data: cachedData, error: null };
    }
  } catch (cacheErr) {
    console.error(`Redis read error in fetchVehicleDetails (${id}):`, cacheErr);
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .select(`*, location:fleetmaster_yards(*)`)
    .eq("id", id)
    .single();

  if (error) {
    return { data, error };
  }

  // 3. Store in Redis
  try {
    await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL_SECONDS });
  } catch (cacheErr) {
    console.error(
      `Redis write error in fetchVehicleDetails (${id}):`,
      cacheErr,
    );
  }

  return { data, error: null };
}

export async function updateVehicleDetails(id: number, vehicleDetails: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .update(vehicleDetails)
    .eq("id", id)
    .select("*")
    .single();

  if (!error) {
    // Invalidate main vehicles list & item details
    await redis.del("vehicles:all");
    await redis.del(`vehicles:details:${id}`);

    // Invalidate tenant-specific vehicle caches
    if (data?.tenant_id) {
      await redis.del(`vehicles:tenant:${data.tenant_id}`);
    }
    await invalidateCachePattern("vehicles:tenant:*");
  }

  return { data, error, success: !error };
}

export async function deleteVehicle(id: number, profile: any) {
  const supabase = await createClient();

  if (!profile || !profile.role || profile.role === "Client") {
    return {
      success: false,
      error: {
        message:
          "Unauthorized action detected! Please verify access & try again.",
      },
    };
  }

  // Get current date (YYYY-MM-DD) and time (HH:MM)
  const now = new Date();
  const currentDateStr = now.toISOString().split("T")[0];
  const currentTimeStr = now.toTimeString().split(" ")[0].substring(0, 5);

  // Check the bookings table using rental_start, rental_end, and rental_time
  const { data: conflictingBookings, error: bookingError } = await supabase
    .from("fleetmaster_bookings")
    .select("id, rental_start, rental_end, rental_time")
    .eq("vehicle_id", id)
    .or(
      `rental_end.gt.${currentDateStr},` +
      `and(rental_end.eq.${currentDateStr},rental_time.gte.${currentTimeStr})`,
    );

  if (bookingError) {
    return {
      success: false,
      error: { ...bookingError },
    };
  }

  if (conflictingBookings && conflictingBookings.length > 0) {
    return {
      success: false,
      error: {
        message:
          "Cannot delete this vehicle because it has active or upcoming rental sessions.",
      },
    };
  }

  // Proceed with deletion if no active/future bookings are found
  const { data: deletedVehicle, error: deleteError } = await supabase
    .from("fleetmaster_vehicles")
    .delete()
    .eq("id", id)
    .select("tenant_id")
    .single();

  if (!deleteError) {
    // Invalidate main vehicles list & item details
    await redis.del("vehicles:all");
    await redis.del(`vehicles:details:${id}`);

    // Invalidate tenant-specific vehicle caches
    if (deletedVehicle?.tenant_id) {
      await redis.del(`vehicles:tenant:${deletedVehicle.tenant_id}`);
    }
    await invalidateCachePattern("vehicles:tenant:*");
  }

  return { success: !deleteError, error: deleteError };
}

export async function fetchVehiclesForTenant(tenantId: string) {
  const { data, error, success } = await getCachedVehicles(tenantId);

  return { data, success, error };
}

export async function createVehicleForTenant(vehicleDetails: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .insert(vehicleDetails)
    .select("*")
    .single();

  if (!error) {
    // Invalidate global list & tenant-specific vehicle caches
    await redis.del("vehicles:all");

    if (vehicleDetails?.tenant_id) {
      await redis.del(`vehicles:tenant:${vehicleDetails.tenant_id}`);
    }
    await invalidateCachePattern("vehicles:tenant:*");
  }

  return { data, success: !error, error };
}
