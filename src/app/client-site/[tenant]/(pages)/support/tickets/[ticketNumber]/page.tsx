import { Metadata } from "next";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import ClientTicketView from "@/components/support/ClientTicketView";

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
    title: `Support Ticket #${ticketNumber} | FleetMaster Support`,
    description: `Managing support ticket #${ticketNumber}`,
  };
}

// 2. Server Component
export default async function ManageTicketPage({ params }: PageProps) {
  const { ticketNumber } = await params;

  const displayTicketNumber = `#${ticketNumber}`;

  const pages = [
    { label: "Home", href: "/" },
    { label: "Support", href: "/support" },
    {
      label: `Ticket ${displayTicketNumber}`,
      href: `/support/tickets/${ticketNumber}`,
    },
  ];

  return (
    <div className="space-y-6">
      <SecondaryHero
        pages={pages}
        title="View ticket"
        highlightedText={`${displayTicketNumber}`}
      />
      <br />
      <ClientTicketView />
    </div>
  );
}
