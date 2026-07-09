"use server";
import { createClient } from "@/utils/supabase/server";

export async function getAllTenants() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('fleetmaster_tenants')
    .select('id, slug, name, phone, about, email, country, county, yards, timezone, tenant_logo, subscription_status, created_at, expiry_date');

  if (error) {
    console.error("Supabase Error:", error.message);
    return [];
  }
  return data || [];
}

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



export async function createNewTenant(newTenantData: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_tenants")
    .insert(newTenantData)
    .select('id')
    .single();

  return { data, error, success: !error };
}