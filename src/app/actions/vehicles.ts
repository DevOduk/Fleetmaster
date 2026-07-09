"use server";
import { createClient } from "@/utils/supabase/server";


export async function fetchAllVehicles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function fetchVehicleDetails(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

export async function updateVehicleDetails(id: number, vehicleDetails: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .update(vehicleDetails)
    .eq("id", id)
    .single();

  return { data, error, success: !error };
}

export async function fetchVehiclesForAdmin(tenantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .select("*")
    .eq("tenant_id", tenantId)
    .order('created_at', { ascending: false });

  return { data, success: !error, error };
}

export async function fetchVehiclesForTenant(tenantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .select("*")
    .eq("tenant_id", tenantId)
    .order('created_at', { ascending: false });

  return { data, success: !error, error };
}

export async function createVehicleForTenant(vehicleDetails: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .insert(vehicleDetails)
    .select('*')
    .single();

  return { data, success: !error, error };
}
