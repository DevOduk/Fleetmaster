"use server";
import { createClient } from "@/utils/supabase/server";
import { getCachedVehicles } from "@/utils/vehicles-cache";


export async function fetchAllVehicles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .select(`*, tenant:fleetmaster_tenants(name)`)
    .order('created_at', { ascending: false });

  const formattedData = data?.map((vehicle) => ({
    ...vehicle,
    owner: vehicle.tenant?.name || vehicle.owner
  }));

  return { data: formattedData, success: !error, error };
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
    .select(`*, tenant:fleetmaster_tenants(name)`)
    .eq("tenant_id", tenantId)
    .order('created_at', { ascending: false });

  const formattedData = data?.map((vehicle) => ({
    ...vehicle,
    owner: vehicle.tenant?.name || vehicle.owner
  }));

  return { data: formattedData, success: !error, error };
}

export async function fetchVehiclesForTenant(tenantId: string) {
  const { data, error, success } = await getCachedVehicles(tenantId);

  return { data, success, error };
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
