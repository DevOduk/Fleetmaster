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
  role?: string;
}

interface CreateMaintenanceLogPayload {
  id?: number;
  vehicle_id: number;
  tenant_id?: string | null;
  date?: string | null;
  title?: string | null;
  description?: string | null;
  mileage?: number | null;
  next_service_date?: string | null;
  next_service_mileage?: number | null;
  recurring?: boolean | null;
}

interface MaintenanceLog {
  id: number;
  created_at: string;
  vehicle_id: number;
  tenant_id?: string | null;
  date?: string | null;
  title?: string | null;
  description?: string | null;
  mileage?: number | null;
  next_service_date?: string | null;
  next_service_mileage?: number | null;
  recurring?: boolean | null;
  tenant?: Record<string, any> | null;
  vehicle?: Record<string, any> | null;
}

const formatMaintenanceDescription = ({
  description,
  nextServiceDate,
  nextServiceMileage,
  recurring,
}: {
  description?: string | null;
  nextServiceDate?: string | null;
  nextServiceMileage?: number | null;
  recurring?: boolean | null;
}) => {
  const lines = [description?.trim()].filter(Boolean) as string[];

  if (nextServiceDate) {
    lines.push(`Next service date: ${nextServiceDate}`);
  }

  if (
    nextServiceMileage !== null &&
    nextServiceMileage !== undefined &&
    Number(nextServiceMileage) > 0
  ) {
    lines.push(`Next service mileage: ${nextServiceMileage}`);
  }

  if (typeof recurring === "boolean") {
    lines.push(`Recurring schedule: ${recurring ? "Yes" : "No"}`);
  }

  return lines.join("\n");
};

const parseMaintenanceMetadata = (description?: string | null) => {
  const cleanDescription = (description ?? "")
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trim();
      return !
        /^Next service date:/i.test(trimmed) &&
        !/^Next service mileage:/i.test(trimmed) &&
        !/^Recurring schedule:/i.test(trimmed);
    })
    .join("\n")
    .trim();

  const nextServiceDateMatch = (description ?? "").match(
    /Next service date:\s*([^\n]+)/i,
  );
  const nextServiceMileageMatch = (description ?? "").match(
    /Next service mileage:\s*([^\n]+)/i,
  );
  const recurringMatch = (description ?? "").match(
    /Recurring schedule:\s*(Yes|No)/i,
  );

  return {
    description: cleanDescription,
    nextServiceDate: nextServiceDateMatch?.[1]?.trim() ?? null,
    nextServiceMileage: nextServiceMileageMatch?.[1]
      ? Number(nextServiceMileageMatch[1].replace(/[^0-9.]/g, ""))
      : null,
    recurring: recurringMatch ? recurringMatch[1].toLowerCase() === "yes" : null,
  };
};

const normalizeMaintenanceLog = (item: any): MaintenanceLog => {
  const metadata = parseMaintenanceMetadata(item?.description);
  const mileageValue = item?.mileage ?? item?.mileage ?? null;

  return {
    ...item,
    mileage: mileageValue,
    description: metadata.description || item?.description || null,
    next_service_date:
      item?.next_service_date ?? metadata.nextServiceDate ?? null,
    next_service_mileage:
      item?.next_service_mileage ?? metadata.nextServiceMileage ?? null,
    recurring: item?.recurring ?? metadata.recurring ?? null,
    tenant: Array.isArray(item?.tenant) ? item.tenant[0] : item?.tenant ?? null,
    vehicle: Array.isArray(item?.vehicle) ? item.vehicle[0] : item?.vehicle ?? null,
  };
};

export async function createMaintenanceLog(
  payload: CreateMaintenanceLogPayload,
  userProfile?: UserProfileParam,
) {
  try {
    const supabase = await createClient();
    const tenantId = payload.tenant_id;
    const mileage = payload.mileage ?? payload.mileage ?? null;

    const { error } = await supabase.from("fleetmaster_maintenance").insert({
      vehicle_id: payload.vehicle_id,
      tenant_id: tenantId,
      date: payload.date ?? new Date().toISOString().split("T")[0],
      title: payload.title ?? null,
      description: formatMaintenanceDescription({
        description: payload.description,
        nextServiceDate: payload.next_service_date,
        nextServiceMileage: payload.next_service_mileage,
        recurring: payload.recurring,
      }),
      mileage: mileage,
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
export async function updateMaintenanceLog(
  payload: CreateMaintenanceLogPayload,
  userProfile?: UserProfileParam,
) {
  try {
    const supabase = await createClient();
    const tenantId = payload.tenant_id ?? null;
    const mileage = payload.mileage ?? null;
    const logId = payload.id
      ? Number(payload.id)
      : null;

    if (!payload.id) {
      return {
        success: false,
        error: { message: "Maintenance log id is required." },
      };
    }

    const updateQuery = supabase
      .from("fleetmaster_maintenance")
      .update({
        date: payload.date,
        title: payload.title,
        description: formatMaintenanceDescription({
          description: payload.description,
          nextServiceDate: payload.next_service_date,
          nextServiceMileage: payload.next_service_mileage,
          recurring: payload.recurring,
        }),
        mileage,
      })
      .eq("id", logId)
      .eq("tenant_id", tenantId);

    const { data, error } = await updateQuery.select().single();
    console.log('payload vs res: ', payload, data, error)
    if (error) {
      return { success: false, error };
    }

    if (!data) {
      return {
        success: false,
        error: { message: "Maintenance log not found or you do not have access." },
      };
    }

    await redis?.del(cacheKey);
    await redis?.del(`maintenance:id:${logId}`);

    return { success: true, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to update maintenance log.",
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
        return parsedData.map((item) => normalizeMaintenanceLog(item));
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
          mileage,
          tenant:fleetmaster_tenants!tenant_id (
            id,
            name,
            slug,
            about,
            email
          ),
          vehicle:fleetmaster_vehicles (
            id,
            make,
            model,
            year,
            license_plate,
            image_url
          )
        `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase maintenance retrieval error:", error.message);
      return [];
    }

    if (!data || data.length === 0) return [];

    const formattedLogs: MaintenanceLog[] = data.map((item) =>
      normalizeMaintenanceLog(item),
    );

    await redis?.setex(cacheKey, CACHE_TTL, JSON.stringify(formattedLogs));

    return formattedLogs;
  } catch (err) {
    console.error("Failed to fetch maintenance logs:", err);
    return [];
  }
}

export async function getMaintenanceLog(logId: string) {
  const supabase = await createClient();
  const logCacheKey = `maintenance:id:${logId}`;

  try {
    const cachedData = await redis?.get<MaintenanceLog | string>(logCacheKey);

    if (cachedData) {
      const parsedData =
        typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;

      if (parsedData) {
        return {
          success: true,
          data: normalizeMaintenanceLog(parsedData),
          error: null,
        };
      }
    }

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
          mileage,
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

    if (!error && data) {
      const normalizedLog = normalizeMaintenanceLog(data);
      await redis?.setex(logCacheKey, CACHE_TTL, JSON.stringify(normalizedLog));
      await redis?.del(cacheKey);
    }

    return {
      success: !error,
      data: data ? normalizeMaintenanceLog(data) : null,
      error,
    };
  } catch (error) {
    return { success: false, data: null, error };
  }
}


export async function deleteMaintenanceLog(logId: number) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("fleetmaster_maintenance")
      .delete()
      .eq("id", logId);

    if (!error) {
      await redis?.del(cacheKey);
      await redis?.del(`maintenance:id:${logId}`);
    }

    return { success: !error, error };
  } catch (error) {
    return { success: false, error };
  }
}