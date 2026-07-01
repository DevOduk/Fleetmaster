// src/app/admin-site/(others-pages)/support/page.tsx
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupportTicketsDashboard, { SupportTicket } from "@/components/support/SupportTicketsDashboard";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Support Desk Control Center | FleetManager",
  description: "Monitor, assign, and respond to platform operational disruptions and client help requests.",
};

async function getSupportTickets() {
  try {
    const supabase = await createClient();

    // Pull down tickets ordered by priority weight and submission date
    const { data, error } = await supabase
      .from("fleetmaster_support_tickets")
      .select("id, ticket_number, user_id, tenant_id, user_role, subject, description, category, priority, status, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase support ticket fetch error:", error.message);
      return [];
    }

    const formattedFeedbacks: SupportTicket[] = (data || []).map((item) => ({
      ...item
    }));
    return formattedFeedbacks || [];
  } catch (err) {
    console.error("Critical error fetching support workspace:", err);
    return [];
  }
}

export default async function Page() {
  const tickets = await getSupportTickets();

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Support Desk Management" />
      <SupportTicketsDashboard initialTickets={tickets} />
    </div>
  );
}