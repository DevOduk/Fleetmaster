// src/utils/tenant-cache.ts
import { createPublicClient } from "@/utils/supabase/server"; // <-- MAKE SURE THIS IS createPublicClient
import { unstable_cache } from "next/cache";

export const getCachedTenant = unstable_cache(
  async (slug: string) => {
    // CHANGE THIS LINE from 'createClient()' to 'createPublicClient()'
    const supabase = createPublicClient(); 
    
    const { data: tenant, error } = await supabase
      .from("fleetmaster_tenants")
      .select("*")
      .eq("slug", slug.toLowerCase().trim())
      .eq("subscription_status","Active")
      .maybeSingle();

    if (error || !tenant) return null;

    return tenant;
  },
  ["tenant-resolution-key"],
  { 
    revalidate: 60 * 60 * 2, // 2 hour memory expiration
    tags: ["tenants"] 
  }
);