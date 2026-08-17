"use server";

import { createClient } from "@/utils/supabase/server";
import {
  ClientWelcomeEmail,
  WelcomeEmail,
} from "@/utils/templates/email-templates";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const CACHE_TTL = 300; // 5 minutes cache TTL

export async function getNotifications(userId: string) {
  if (!userId) {
    return { success: false, data: null, error: "User ID is required" };
  }

  const cacheKey = `notifications:${userId}`;

  // 1. Attempt Cache Read
  if (redis) {
    try {
      const cached = await redis.get<{
        success: boolean;
        data: any;
        error: any;
      }>(cacheKey);

      // Upstash Redis automatically parses JSON if stringified, but handling string/object fallback avoids double-serialization bugs
      if (cached) {
        const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
        return parsed;
      }
    } catch (e) {
      console.error("Redis fetch error (getNotifications):", e);
    }
  }

  // 2. Fetch from Database
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error (getNotifications):", error);
    return { success: false, data: null, error };
  }

  const result = { success: true, data, error: null };

  // 3. Cache Only Successful Results (Pass object directly to Upstash)
  if (redis) {
    try {
      await redis.set(cacheKey, result, { ex: CACHE_TTL });
    } catch (e) {
      console.error("Redis set error (getNotifications):", e);
    }
  }

  return result;
}

/**
 * Helper to invalidate notification cache when a user reads/receives a new notification
 */
export async function invalidateNotificationCache(userId: string) {
  if (!redis || !userId) return;
  try {
    await redis.del(`notifications:${userId}`);
  } catch (e) {
    console.error("Failed to invalidate notification cache:", e);
  }
}

export async function sendWelcomeNotification(
  userEmail: string,
  tenant: any,
  userName: string,
) {
  if (!userEmail || !tenant) {
    return {
      success: false,
      error: { message: "Recipient email & headers is required" },
    };
  }

  const displayName = userName || "there";

  const { data, error: mailError } = await resend.emails.send({
    from: `${tenant.name} <onboarding@resend.dev>`,
    to: userEmail,
    subject: `Welcome to ${tenant.name}!`,
    html: ClientWelcomeEmail(displayName, tenant),
  });

  if (mailError) {
    console.error("Resend delivery error:", mailError);
    return {
      success: false,
      error: { message: `Welcome email failed to send: ${mailError.message}` },
    };
  }

  return { success: true, data };
}

export async function markNotificationAsSeen(notificationId: number) {
  if (!notificationId) {
    return { success: false, error: "Missing required ID parameter!" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("fleetmaster_notifications")
    .update({
      seen: true,
    })
    .eq("id", notificationId);

  if (error) {
    console.error("Supabase error (mark notif seen):", error);
    return { success: false, error };
  }

  return { success: true, error: null };
}
