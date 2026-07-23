// src/utils/vehicles-cache.ts
import { createPublicClient } from "@/utils/supabase/server"; // <-- MAKE SURE THIS IS createPublicClient
import { unstable_cache } from "next/cache";

export const getCachedVehicles = unstable_cache(
  async (tenantId: string) => {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("fleetmaster_vehicles")
      .select("*")
      .eq("tenant_id", tenantId)
      .order('created_at', { ascending: false });


    return { data, success: !error, error };
  },
  ["vehicle-resolution-key"],
  {
    revalidate: 60 * 30, // 30 min memory expiration
    tags: ["vehicles"]
  }
);