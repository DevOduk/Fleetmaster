import { Metadata } from "next";
import AdminTicketView from "@/components/support/AdminTicketView";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

// Define the shape of your params
type PageProps = {
  params: Promise<{ ticketNumber: string }>;
};

// 1. Generate dynamic metadata
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { ticketNumber } = await params;
  return {
    title: `Support Ticket #${ticketNumber} | FleetMaster Dashboard - Best tool for Fleet Management`,
    description:
      "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
  };
}

// 2. Server Component
export default async function ManageTicketPage({ params }: PageProps) {
  const { ticketNumber } = await params;

  const displayTicketNumber = `#${ticketNumber}`;

  const pages = [{ label: "Support", href: "/view-support" }];

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={pages}
        pageTitle={`Ticket ${displayTicketNumber}`}
      />
      <br />

      <AdminTicketView />
    </div>
  );
}
