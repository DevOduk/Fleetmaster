"use server";

import { createClient } from "@/utils/supabase/server";
import { Redis } from "@upstash/redis";

const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const CACHE_TTL = 300; // 5 minutes cache TTL

export async function fetchAllExpenses() {
  const cacheKey = "expenses:all";

  if (redis) {
    try {
      const cached = await redis.get<{ success: boolean; data: any }>(cacheKey);
      if (cached) return cached;
    } catch (e) {
      console.error("Redis fetch error (fetchAllExpenses):", e);
    }
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_expenses")
    .select(`*`)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  const result = { success: true, data };

  if (redis) {
    try {
      await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTL });
    } catch (e) {
      console.error("Redis set error (fetchAllExpenses):", e);
    }
  }

  return result;
}

export async function fetchExpenseDetails(id: string) {
  const cacheKey = `expenses:detail:${id}`;

  if (redis) {
    try {
      const cached = await redis.get<{ data: any; error: any; success: boolean }>(cacheKey);
      if (cached) return cached;
    } catch (e) {
      console.error(`Redis fetch error (fetchExpenseDetails - ${id}):`, e);
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_expenses")
    .select(`*`)
    .eq("id", id)
    .single();

  const result = { data, error, success: !error };

  if (redis && !error) {
    try {
      await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTL });
    } catch (e) {
      console.error(`Redis set error (fetchExpenseDetails - ${id}):`, e);
    }
  }

  return result;
}

export async function createExpense(expenseDetails: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_expenses")
    .insert(expenseDetails)
    .select()
    .single();

  const result = { data, error, success: !error };

  // Invalidate cache on creation
  if (redis && !error) {
    try {
      const keysToInvalidate = ["expenses:all"];
      
      if (expenseDetails?.tenant_id) {
        keysToInvalidate.push(`expenses:admin:${expenseDetails.tenant_id}`);
      }

      await redis.del(...keysToInvalidate);
    } catch (e) {
      console.error("Redis cache invalidation error (createExpense):", e);
    }
  }

  return result;
}

export async function fetchExpensesForAdmin(tenantId: string) {
  const cacheKey = `expenses:admin:${tenantId}`;

  if (redis) {
    try {
      const cached = await redis.get<{ data: any; success: boolean; error: any }>(cacheKey);
      if (cached) return cached;
    } catch (e) {
      console.error(`Redis fetch error (fetchExpensesForAdmin - ${tenantId}):`, e);
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_expenses")
    .select(`*`)
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  const result = { data, success: !error, error };

  if (redis && !error) {
    try {
      await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTL });
    } catch (e) {
      console.error(`Redis set error (fetchExpensesForAdmin - ${tenantId}):`, e);
    }
  }

  return result;
}