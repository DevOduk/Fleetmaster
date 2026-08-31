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

const CACHE_TTL = 600;
const cacheKey = "maintenance:all";

interface UserProfileParam {
  id?: string;
  tenant_id?: string;
  role?: string;
}

interface CreateMaintenanceLogPayload {
  vehicle_id: number;
  tenant_id?: string | null;
  date?: string | null;
  title?: string | null;
  description?: string | null;
  milleage?: number | null;
}

interface MaintenanceLog {
  id: number;
  created_at: string;
  vehicle_id: number;
  tenant_id?: string | null;
  date?: string | null;
  title?: string | null;
  description?: string | null;
  milleage?: number | null;
  tenant?: Record<string, any> | null;
  vehicle?: Record<string, any> | null;
}

export async function createMaintenanceLog(
  payload: CreateMaintenanceLogPayload,
  userProfile?: UserProfileParam,
) {
  try {
    const supabase = await createClient();

    const tenantId = payload.tenant_id ?? userProfile?.tenant_id ?? null;

    const { error } = await supabase
    .from("fleetmaster_maintenance")
    .insert({
      vehicle_id: payload.vehicle_id,
      tenant_id: tenantId,
      date: payload.date ?? new Date().toISOString(),
      title: payload.title ?? null,
      description: payload.description ?? null,
      milleage: payload.milleage ?? null,
    });

    if (!error) {
      await redis?.del(cacheKey);
    }

    return { success: !error, error };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to create maintenance log.",
    };
  }
}

export async function getAllMaintenanceLogs(): Promise<MaintenanceLog[]> {
  try {
    const cachedData = await redis?.get<MaintenanceLog[] | string>(cacheKey);

    if (cachedData) {
      const parsedData =
        typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;

      if (Array.isArray(parsedData)) {
        return parsedData as MaintenanceLog[];
      }
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("fleetmaster_maintenance")
      .select(
        `
          id,
          created_at,
          vehicle_id,
          tenant_id,
          date,
          title,
          description,
          milleage,
          tenant:fleetmaster_tenants!tenant_id (
            id,
            name,
            slug,
            about,
            email
          ),
          vehicle:fleetmaster_vehicles!vehicle_id (
            id,
            name,
            make,
            model,
            year,
            license_plate
          )
        `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase maintenance retrieval error:", error.message);
      return [];
    }

    if (!data || data.length === 0) return [];

    const formattedLogs: MaintenanceLog[] = data.map((item) => ({
      ...item,
      tenant: Array.isArray(item.tenant) ? item.tenant[0] : item.tenant ?? null,
      vehicle: Array.isArray(item.vehicle) ? item.vehicle[0] : item.vehicle ?? null,
    }));

    await redis?.setex(cacheKey, CACHE_TTL, JSON.stringify(formattedLogs));

    return formattedLogs;
  } catch (err) {
    console.error("Failed to fetch maintenance logs:", err);
    return [];
  }
}

export async function getMaintenanceLog(logId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("fleetmaster_maintenance")
      .select(
        `
          id,
          created_at,
          vehicle_id,
          tenant_id,
          date,
          title,
          description,
          milleage,
          tenant:fleetmaster_tenants!tenant_id (
            id,
            name,
            slug,
            about,
            email
          ),
          vehicle:fleetmaster_vehicles!vehicle_id (
            id,
            name,
            make,
            model,
            year,
            license_plate
          )
        `,
      )
      .eq("id", logId)
      .single();

    if (!error) {
      await redis?.del(cacheKey);
    }

    return { success: !error, data, error };
  } catch (error) {
    return { success: false, data: null, error };
  }
}

export async function geteMaintenanceLog(logId: string) {
  return getMaintenanceLog(logId);
}

export async function deleteMaintenanceLog(logId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("fleetmaster_maintenance")
      .delete()
      .eq("id", logId);

    if (!error) {
      await redis?.del(cacheKey);
    }

    return { success: !error, error };
  } catch (error) {
    return { success: false, error };
  }
}