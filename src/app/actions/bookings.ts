"use server";
import { createClient } from "@/utils/supabase/server";


export async function fetchAllBookings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_bookings")
    .select(`*, vehicleDetails:fleetmaster_vehicles(*)`)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function fetchBookingDetails(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_bookings")
    .select(`*, vehicleDetails:fleetmaster_vehicles(*)`)
    .eq("id", id)
    .single();

  return { data, error };
}

export async function updateBookingDetails(id: number, bookingDetails) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_bookings")
    .update(bookingDetails)
    .eq("id", id)
    .single();

  return { data, error, success: !error };
}

export async function fetchBookingsForAdmin(tenantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_bookings")
    .select(`*, vehicleDetails:fleetmaster_vehicles(*)`)
    .eq("tenant_id", tenantId)
    .neq("booking_status", 'Reserved')
    .order('created_at', { ascending: false });

  return { data, success: !error, error };
}


export async function fetchBookingsForTenant(tenantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_bookings")
    .select(`*, vehicleDetails:fleetmaster_vehicles(*)`)
    .eq("tenant_id", tenantId)
    .neq("booking_status", 'Reserved')
    .order('created_at', { ascending: false });

  return { data, success: !error, error };
}

export async function fetchBookingsForClient(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('fleetmaster_bookings')
    .select(`*, vehicleDetails:fleetmaster_vehicles!inner(*)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, success: !error, error };
}

export async function createNewBooking(bookingDetails: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('fleetmaster_bookings')
    .insert(bookingDetails);

  return { data, success: !error, error };
}