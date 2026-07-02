"use server";
import { createClient } from "@/utils/supabase/server";

interface UserProfileParam {
  id: string;
  role: string;
  tenant_id: string;
}

interface SupportTicketPayload {
  ticket_number: string; // The #STK-... id
  subject: string;       // Mapping to your 'subject' column
  description: string;   // Mapping to your 'description' column
  category: string;   // Mapping to your 'description' column
}

export async function submitSupportRequest(
  payload: SupportTicketPayload,
  userProfile: UserProfileParam
) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("fleetmaster_support_tickets").insert({
      ticket_number: payload.ticket_number,
      user_id: userProfile.id,
      tenant_id: userProfile.tenant_id,
      user_role: userProfile.role || "User",
      subject: payload.subject,
      description: payload.description,
      category: payload.category,
      priority: "Medium",
      status: "Open",
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Support ticket insertion failure:", err);
    return { success: false, error: err.message || "Failed to log ticket." };
  }
}

export async function fetchUserTickets(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function getTicketDetails(ticketNumber: string) {
  const supabase = await createClient();
  // Fetch ticket and joined responses
  const { data, error } = await supabase
    .from("fleetmaster_support_tickets")
    .select("*, responses:fleetmaster_ticket_responses(*), admin:fleetmaster_main_admins (id, first_name, last_name)")
    .eq("ticket_number", ticketNumber)
    .single();

  return { data, error };
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