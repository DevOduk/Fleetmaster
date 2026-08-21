"use server";
import { FeedbackLog } from "@/components/feedback/ViewFeedbacks";
import { createClient } from "@/utils/supabase/server";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

const CACHE_TTL = 600; // 5 minutes cache TTL
const cacheKey = "feedbacks:all";


interface UserProfileParam {
  id: string;
  tenant_id: string;
  role: string;
}

interface SubmitFeedbackPayload {
  category: string;
  rating: number;
  feedback_text: string;
  is_feedback?: boolean;
  booking_id?: number;
}

export async function submitUserFeedback(
  payload: SubmitFeedbackPayload,
  userProfile: UserProfileParam,
) {
  try {
    const supabase = await createClient();

    // Explicitly resolve is_feedback: defaults to true ONLY if it's undefined
    const isFeedbackValue = payload?.is_feedback !== undefined ? Boolean(payload.is_feedback) : true;

    // Securely insert the data into the database
    const { error } = await supabase
      .from("fleetmaster_feedbacks")
      .insert({
        user_id: userProfile.id,
        tenant_id: userProfile.tenant_id,
        user_role: userProfile.role || "User",
        user_type: userProfile.role === 'Client' ? 'client' : 'admin',
        category: payload.category,
        rating: payload.rating,
        feedback_text: payload.feedback_text,
        is_feedback: isFeedbackValue,
        booking_id: payload?.booking_id ?? null,
      });

    if (!error) {
      redis.del(cacheKey);
      redis.del(`bookings:tenant:${userProfile.tenant_id}`);

      // Check against our cleanly resolved boolean value
      if (isFeedbackValue === false && payload.booking_id) {
        const { error: updateError } = await supabase
          .from("fleetmaster_bookings")
          .update({
            reviewed_by: userProfile.id,
            reviewed: true,
          })
          .eq('id', payload.booking_id);


        if (!updateError) {
          redis.del(`booking:id:${payload.booking_id}:tenant:${userProfile.tenant_id}`)
          redis.del("bookings:all");
          redis.del(`booking:id:${payload.booking_id}`);
        }
      }
    }

    return { success: !error, error };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to log feedback." };
  }
}

export async function getAllFeedbacks(): Promise<FeedbackLog[]> {

  try {
    // 1. Check Redis Cache First
    const cachedData = await redis?.get<FeedbackLog[] | string>(cacheKey);
    if (cachedData) {
      // If cached data is a string, parse it; if using Upstash SDK, it might auto-parse JSON.
      const parsedData =
        typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;

      if (Array.isArray(parsedData)) {
        return parsedData as FeedbackLog[];
      }
    }

    const supabase = await createClient();

    // 2. Fetch feedback logs and tenant info only (leaving sender handling to application level)
    const { data, error } = await supabase
      .from("fleetmaster_feedbacks")
      .select(`
        id, 
        user_id, 
        tenant_id, 
        user_role, 
        rating, 
        category, 
        feedback_text, 
        created_at,
        is_feedback,
        tenant:fleetmaster_tenants!tenant_id (
          name,
          slug,
          about,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase feedback retrieval error:", error.message);
      return [];
    }

    if (!data || data.length === 0) return [];

    // 3. Extract unique user IDs to batch-query admins and clients
    const userIds = [...new Set(data.map((item) => item.user_id).filter(Boolean))];

    // Fetch from both tables concurrently
    const [adminsRes, clientsRes] = await Promise.all([
      supabase
        .from("fleetmaster_admins")
        .select("id, first_name, last_name, profile_pic, email")
        .in("id", userIds),
      supabase
        .from("fleetmaster_clients") // Replace with your actual client/user table name
        .select("id, first_name, last_name, profile_pic, email")
        .in("id", userIds),
    ]);

    // Create lookup maps for O(1) time complexity matching
    const adminMap = new Map((adminsRes.data || []).map((admin) => [admin.id, admin]));
    const clientMap = new Map((clientsRes.data || []).map((client) => [client.id, client]));

    // 4. Format feedbacks and attach the correct sender (Admin or Client)
    const formattedFeedbacks: FeedbackLog[] = data.map((item) => {
      const tenantObj = Array.isArray(item.tenant) ? item.tenant[0] : item.tenant;

      // Look up sender in admins map first, then fallback to clients map
      const senderObj = adminMap.get(item.user_id) || clientMap.get(item.user_id) || null;

      return {
        ...item,
        tenant: tenantObj,
        sender: senderObj,
      };
    });

    // 5. Save result to Redis cache
    await redis?.setex(cacheKey, CACHE_TTL, JSON.stringify(formattedFeedbacks));

    return formattedFeedbacks;
  } catch (err) {
    console.error("Failed to fetch feedback logs:", err);
    return [];
  }
}
export async function deleteFeedback(feedbackId: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from('fleetmaster_feedbacks')
      .delete()
      .eq('id', feedbackId)
      .single();

    if (!error) {
      redis.del(cacheKey)
    }

    return { success: !error, error }
  } catch (error) {
    return { success: false, error }

  }
}