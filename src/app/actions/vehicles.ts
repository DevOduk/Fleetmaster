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

export async function updateVehicleDetails(id: number, vehicleDetails) {
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
    .eq("tenant_id", tenantId);

  return { data, success: !error, error };
}

export async function fetchVehiclesForTenant(tenantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_vehicles")
    .select("*")
    .eq("tenant_id", tenantId);

  return { data, success: !error, error };
}

export async function addSupportResponse(ticketId: string, sender_id: string, sender_role: string, response: string, is_admin: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("fleetmaster_ticket_responses").insert({
    ticket_id: ticketId,
    sender_id: sender_id,
    message: response,
    sender_role: sender_role,
    is_admin: is_admin,
    created_at: new Date().toISOString()
  });

  return { success: !error, error };
}

export async function updateTicket(ticketId: string, adminId: string, status: string) {
  const supabase = await createClient();
  const { error, data } = await supabase.from("fleetmaster_support_tickets")
  .update({ status, assigned_admin_id: adminId, updated_at: new Date().toISOString() })
  .eq("id", ticketId);

  return { success: !error, error, data };
}