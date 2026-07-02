import { Metadata } from "next";
import AdminTicketView from "@/components/support/AdminTicketView";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

// Define the shape of your params
type PageProps = {
  params: Promise<{ ticketNumber: string }>;
};

// 1. Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ticketNumber } = await params;
  return {
    title: `Support Ticket #${ticketNumber} | FleetMaster Admin Support`,
    description: `Managing support ticket #${ticketNumber}`,
  };
}

// 2. Server Component
export default async function ManageTicketPage({ params }: PageProps) {
  // Await the params (required in Next.js 15+)
  const { ticketNumber } = await params;
  
  const displayTicketNumber = `#${ticketNumber}`;
  
  const pages = [
    { label: 'Support', href: '/view-support' }
  ];

  return (
    <div className="space-y-6">
      <PageBreadcrumb items={pages} pageTitle={`Ticket ${displayTicketNumber}`} />
      <br />
      
      <AdminTicketView />
    </div>
  );
}