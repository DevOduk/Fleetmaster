// src/app/admin-site/(others-pages)/support/page.tsx
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupportTicketsDashboard, {
  SupportTicket,
} from "@/components/support/SupportTicketsDashboard";
import { getSupportTickets } from "@/utils/fetchTickets";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Support Center | FleetMaster Dashboard - Best tool for Fleet Management",
  description:
    "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
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
