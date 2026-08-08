"use server";

import { createClient } from "@/utils/supabase/server";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

const TICKETS_CACHE_TTL = 60 * 60; // 1 Hour

interface UserProfileParam {
  id: string;
  role: string;
  tenant_id: string;
}

interface SupportTicketPayload {
  ticket_number: string;
  subject: string;
  description: string;
  category: string;
}

export async function submitSupportRequest(
  payload: SupportTicketPayload,
  userProfile: UserProfileParam
) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("fleetmaster_support_tickets").insert({
      ticket_number: payload.ticket_number,
      user_id: userProfile.id,
      tenant_id: userProfile.tenant_id,
      user_role: userProfile.role || "User",
      subject: payload.subject,
      description: payload.description,
      category: payload.category,
      priority: "Medium",
      status: "Open",
    });

    if (error) throw error;

    // Invalidate user's tickets list cache on new ticket submission
    if (redis) {
      await redis.del(`user:tickets:${userProfile.id}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Support ticket insertion failure:", err);
    return { success: false, error: err.message || "Failed to log ticket." };
  }
}

export async function fetchUserTickets(userId: string) {
  const cacheKey = `user:tickets:${userId}`;

  // 1. Check Redis Cache First
  if (redis) {
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return {
          success: true,
          data: typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData,
        };
      }
    } catch (e) {
      console.error("Redis fetch error in fetchUserTickets:", e);
    }
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  // 3. Populate Redis Cache
  if (redis && data) {
    try {
      await redis.set(cacheKey, JSON.stringify(data), { ex: TICKETS_CACHE_TTL });
    } catch (e) {
      console.error("Redis set error in fetchUserTickets:", e);
    }
  }

  return { success: true, data };
}

export async function getTicketDetails(ticketNumber: string) {
  const cacheKey = `ticket:details:${ticketNumber}`;

  // 1. Check Redis Cache First
  if (redis) {
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return {
          data: typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData,
          error: null,
        };
      }
    } catch (e) {
      console.error("Redis fetch error in getTicketDetails:", e);
    }
  }

  // 2. Fetch from Supabase on cache miss
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_support_tickets")
    .select(
      "*, responses:fleetmaster_ticket_responses(*), admin:fleetmaster_main_admins (id, first_name, last_name)"
    )
    .eq("ticket_number", ticketNumber)
    .single();

  if (error) return { data: null, error };

  // 3. Populate Redis Cache
  if (redis && data) {
    try {
      await redis.set(cacheKey, JSON.stringify(data), { ex: TICKETS_CACHE_TTL });
    } catch (e) {
      console.error("Redis set error in getTicketDetails:", e);
    }
  }

  return { data, error: null };
}

export async function addSupportResponse(
  ticketId: string,
  sender_id: string,
  sender_role: string,
  response: string,
  is_admin: boolean,
  ticketNumber?: string,
  userId?: string
) {
  const supabase = await createClient();
  const { error } = await supabase.from("fleetmaster_ticket_responses").insert({
    ticket_id: ticketId,
    sender_id: sender_id,
    message: response,
    sender_role: sender_role,
    is_admin: is_admin,
    created_at: new Date().toISOString(),
  });

  // Invalidate stale caches when a new response is added
  if (!error && redis) {
    try {
      const keysToDel: string[] = [];
      if (ticketNumber) keysToDel.push(`ticket:details:${ticketNumber}`);
      if (userId) keysToDel.push(`user:tickets:${userId}`);

      if (keysToDel.length > 0) {
        await redis.del(...keysToDel);
      }
    } catch (e) {
      console.error("Redis cache invalidation error in addSupportResponse:", e);
    }
  }

  return { success: !error, error };
}

export async function updateTicket(
  ticketId: string,
  adminId: string,
  status: string,
  ticketNumber?: string,
  userId?: string
) {
  const supabase = await createClient();
  const { error, data } = await supabase
    .from("fleetmaster_support_tickets")
    .update({ status, assigned_admin_id: adminId, updated_at: new Date().toISOString() })
    .eq("id", ticketId);

  // Invalidate stale caches when ticket status or admin assignment changes
  if (!error && redis) {
    try {
      const keysToDel: string[] = [];
      if (ticketNumber) keysToDel.push(`ticket:details:${ticketNumber}`);
      if (userId) keysToDel.push(`user:tickets:${userId}`);

      if (keysToDel.length > 0) {
        await redis.del(...keysToDel);
      }
    } catch (e) {
      console.error("Redis cache invalidation error in updateTicket:", e);
    }
  }

  return { success: !error, error, data };
}