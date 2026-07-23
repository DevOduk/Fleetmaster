"use server";
import { createClient } from "@/utils/supabase/server";

export async function getAllTenants() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('fleetmaster_tenants')
    .select('id, slug, name, phone, about, email, country, county, yards, timezone, tenant_logo, subscription_status, created_at, expiry_date')
    .order('created_at', { ascending: false });

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

export async function fetchTenantSubscriptions(tenantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_payments")
    .select('amount, tenant_id, message, provider, created_at')
    .eq("tenant_id", tenantId) // Ensure this matches your table schema (tenant_id vs id)
    .eq("status", "Success") // Ensure this matches your table schema (tenant_id vs id)
    .ilike("message", "Subscription renewal for package:%")
    .order('created_at', { ascending: false });

  if (error || !data) {
    return { data: [], error, success: false };
  }
  
  const subscriptions = data.map((item) => {
    return {
      label: item.message.split('Subscription renewal for package: ')[1],
      value: item.message,
      date: item.created_at,
      amount: item.amount,
      method: item.provider,
    };
  })
  return { data: subscriptions, error, success: !error };
}

export async function updateTenantDetails(tenantId: string, updatedData: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_tenants")
    .update({ ...updatedData, last_updated: new Date() })
    .eq("id", tenantId);

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