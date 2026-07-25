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

export async function deleteVehicle(id: number, profile: any) {
  const supabase = await createClient();

  if (!profile || !profile.role || profile.role === "Client") {
    return { 
      success: false, 
      error: { message: "Unauthorized action detected! Please verify access & try again." } 
    };
  }

  // Get current date (YYYY-MM-DD) and time (HH:MM)
  const now = new Date();
  const currentDateStr = now.toISOString().split('T')[0];
  const currentTimeStr = now.toTimeString().split(' ')[0].substring(0, 5);

  // Check the bookings table using rental_start, rental_end, and rental_time
  // Preventing deletion if the rental end is in the future or happening today at/after the current time
  const { data: conflictingBookings, error: bookingError } = await supabase
    .from("fleetmaster_bookings")
    .select("id, rental_start, rental_end, rental_time")
    .eq("vehicle_id", id)
    .or(
      `rental_end.gt.${currentDateStr},` +
      `and(rental_end.eq.${currentDateStr},rental_time.gte.${currentTimeStr})`
    );

  if (bookingError) {
    return {
      success: false,
      error: { ...bookingError }
    };
  }

  if (conflictingBookings && conflictingBookings.length > 0) {
    return {
      success: false,
      error: { message: "Cannot delete this vehicle because it has active or upcoming rental sessions." }
    };
  }

  // Proceed with deletion if no active/future bookings are found
  const { error: deleteError } = await supabase
    .from("fleetmaster_vehicles")
    .delete()
    .eq("id", id);

  return { success: !deleteError, error: deleteError };
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
