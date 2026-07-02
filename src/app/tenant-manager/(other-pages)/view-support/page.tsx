// src/app/admin-site/(others-pages)/support/page.tsx
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupportTicketsDashboard, { SupportTicket } from "@/components/support/SupportTicketsDashboard";
import { getSupportTickets } from "@/utils/fetchTickets";

export const metadata = {
  title: "Support Desk Control Center | FleetManager",
  description: "Monitor, assign, and respond to platform operational disruptions and client help requests.",
};


export default async function Page() {
  const tickets = await getSupportTickets();


  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Support Desk Management" />
      <SupportTicketsDashboard initialTickets={tickets} />
    </div>
  );
}