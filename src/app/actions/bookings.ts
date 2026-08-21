"use server";
import { createClient } from "@/utils/supabase/server";
import { Redis } from "@upstash/redis";
import { sendBookingNotification } from "./notifications";

// 1. Initialize Upstash Redis Client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache Expiration Time Constants (5 minutes for active lists, 1 hour for specific IDs)
const CACHE_TTL_LISTS = 300;
const CACHE_TTL_SINGLE = 3600;

// Helper to safely parse strings or objects from Redis
function parseCachedData(cached: any) {
  if (!cached) return null;
  return typeof cached === "string" ? JSON.parse(cached) : cached;
}

// ========================================================================
// CACHE INVALIDATION UTILITY
// ========================================================================
async function clearBookingCache({
  bookingId,
  tenantId,
  userId,
}: {
  bookingId?: number;
  tenantId?: string;
  userId?: string;
}) {
  try {
    const pipeline = redis.pipeline();

    // Clear global list
    pipeline.del("bookings:all");

    // Clear tenant maps if provided
    if (tenantId) {
      pipeline.del(`booking:id:${bookingId}`);
      pipeline.del(`booking:id:${bookingId}:tenant:${tenantId}`);
      pipeline.del(`bookings:tenant:${tenantId}`);
      pipeline.del(`bookings:admin:${tenantId}`);
    }

    // Clear user maps if provided
    if (userId) pipeline.del(`bookings:client:${userId}`);

    await pipeline.exec();
  } catch (err) {
    console.error("Failed to invalidate booking caches:", err);
  }
}

// ========================================================================
// READ OPERATIONS (HIGH SPEED CACHED LAYER)
// ========================================================================

export async function fetchAllBookings() {
  const cacheKey = "bookings:all";

  try {
    const cached = await redis.get(cacheKey);
    if (cached)
      return { success: true, data: parseCachedData(cached), source: "cache" };
  } catch (e) {
    console.error("Redis read error on fetchAllBookings:", e);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_bookings")
    .select(`*, vehicleDetails:fleetmaster_vehicles(*)`)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  try {
    await redis.set(cacheKey, data, { ex: CACHE_TTL_LISTS });
  } catch (e) {
    console.error("Redis write error on fetchAllBookings:", e);
  }

  return { success: true, data, source: "db" };
}

export async function fetchBookingDetails(id: number, tenantID: string) {
  // Strict guard: Prevent the network/database query entirely if tenantID is missing, invalid, or falsy
  if (
    !tenantID ||
    typeof tenantID !== "string" ||
    !tenantID.trim() ||
    isNaN(Number(id))
  ) {
    return {
      data: null,
      error: {
        message: "Unauthorized: Invalid or missing tenant credentials.",
      },
    };
  }

  const cacheKey = `booking:id:${id}:tenant:${tenantID}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached)
      return { data: parseCachedData(cached), error: null, source: "cache" };
  } catch (e) {
    console.error("Redis read error on fetchBookingDetails:", e);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_bookings")
    .select(`*, vehicleDetails:fleetmaster_vehicles(*)`)
    .eq("id", id)
    .eq("tenant_id", tenantID)
    .single();

  if (!error && data) {
    try {
      await redis.set(cacheKey, data, { ex: CACHE_TTL_SINGLE });
    } catch (e) {
      console.error("Redis write error on fetchBookingDetails:", e);
    }
  }

  return { data, error, source: "db" };
}

export async function fetchBookingsForTenant(tenantId: string) {
  const cacheKey = `bookings:tenant:${tenantId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached)
      return {
        data: parseCachedData(cached),
        success: true,
        error: null,
        source: "cache",
      };
  } catch (e) {
    console.error("Redis read error on fetchBookingsForTenant:", e);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_bookings")
    .select(`*, vehicleDetails:fleetmaster_vehicles(*)`)
    .eq("tenant_id", tenantId)
    .neq("booking_status", "Reserved")
    .order("created_at", { ascending: false });

  if (!error && data) {
    try {
      await redis.set(cacheKey, data, { ex: CACHE_TTL_LISTS });
    } catch (e) {
      console.error("Redis write error on fetchBookingsForTenant:", e);
    }
  }

  return { data, success: !error, error, source: "db" };
}

export async function fetchBookingsForVehicle(vehicleId: string) {
  const cacheKey = `bookings:vehicle:${vehicleId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached)
      return {
        data: parseCachedData(cached),
        success: true,
        error: null,
        source: "cache",
      };
  } catch (e) {
    console.error("Redis read error on fetchBookingsForTenant:", e);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_bookings")
    .select(`*, vehicleDetails:fleetmaster_vehicles(*)`)
    .eq("vehicle_id", vehicleId)
    .neq("booking_status", "Reserved")
    .order("created_at", { ascending: false });

  if (!error && data) {
    try {
      await redis.set(cacheKey, data, { ex: CACHE_TTL_LISTS });
    } catch (e) {
      console.error("Redis write error on fetchBookingsForTenant:", e);
    }
  }

  return { data, success: !error, error, source: "db" };
}

export async function fetchBookingsForClient(userId: string) {
  const cacheKey = `bookings:client:${userId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached)
      return {
        data: parseCachedData(cached),
        success: true,
        error: null,
        source: "cache",
      };
  } catch (e) {
    console.error("Redis read error on fetchBookingsForClient:", e);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_bookings")
    .select(`*, vehicleDetails:fleetmaster_vehicles!inner(*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!error && data) {
    try {
      await redis.set(cacheKey, data, { ex: CACHE_TTL_LISTS });
    } catch (e) {
      console.error("Redis write error on fetchBookingsForClient:", e);
    }
  }

  return { data, success: !error, error, source: "db" };
}

// ========================================================================
// WRITE OPERATIONS (AUTO CACHE INVALIDATION REWRITE ENGINE)
// ========================================================================

export async function updateBookingDetails(id: number, bookingDetails: any) {
  const supabase = await createClient();

  // Fetch current booking data before mutating to figure out which tenant/client maps to clean up
  const { data: currentBooking } = await supabase
    .from("fleetmaster_bookings")
    .select("tenant_id, user_id")
    .eq("id", id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("fleetmaster_bookings")
    .update({ ...bookingDetails, updated_at: new Date() })
    .eq("id", id)
    .select() // Use select() instead of legacy single() to catch payloads reliably
    .maybeSingle();

  if (!error) {
    // Clear out memory trails across related pools instantly
    await clearBookingCache({
      bookingId: id,
      tenantId: currentBooking?.tenant_id || bookingDetails?.tenant_id,
      userId: currentBooking?.user_id || bookingDetails?.user_id,
    });
  }

  return { data, error, success: !error };
}

export async function createNewBooking(bookingDetails: any, userEmail: string, tenant: any, userName: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_bookings")
    .insert(bookingDetails)
    .select()
    .maybeSingle();

  if (!error && data) {
    // Purge cached vectors for this specific client and company workflow
    await clearBookingCache({
      tenantId: bookingDetails?.tenant_id,
      userId: bookingDetails?.user_id,
    });
  }
  const { error: emailNotifError } = await sendBookingNotification(userEmail, tenant, bookingDetails, userName, bookingDetails?.user_id);

  return { data, success: !error, error: { ...error, emailNotifError } };
}
