"use server";
import { createClient } from "@/utils/supabase/server";

export async function fetchTenantDetails(tenantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_tenants")
    .select('*')
    .eq("id", tenantId)
    .single();

  return { data, error, success: !error };
}

export async function updateTenantDetails(tenantId: string, updatedData: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_tenants")
    .update(updatedData)
    .eq("id", tenantId)
    .single();

  return { data, error, success: !error };
}


