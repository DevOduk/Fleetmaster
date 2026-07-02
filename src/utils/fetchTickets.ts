import { SupportTicket } from "@/components/support/SupportTicketsDashboard";
import { createClient } from "@/utils/supabase/server";

export async function getSupportTickets() {
  try {
    const supabase = await createClient();

    // Pull down tickets ordered by priority weight and submission date
    const { data, error } = await supabase
      .from("fleetmaster_support_tickets")
      .select(`
        id, ticket_number, user_id, tenant_id, user_role, subject, description, category, priority, status, created_at, updated_at, 
        admin:fleetmaster_main_admins (id, first_name, last_name)`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase support ticket fetch error:", error.message);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Critical error fetching support workspace:", err);
    return [];
  }
}