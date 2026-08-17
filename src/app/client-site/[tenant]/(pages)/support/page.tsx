import Support from "@/components/support/SupportTicketsTable";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import { Metadata } from "next";
import { createPublicClient } from "@/utils/supabase/server";

interface PageProps {
  params: Promise<{
    tenant: string;
  }>;
}

// 1. Dynamic Server-Side Metadata Generation
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tenantSlug = resolvedParams.tenant;

  const supabase = createPublicClient();
  const { data: tenant } = await supabase
    .from("fleetmaster_tenants")
    .select("name, about")
    .eq("slug", tenantSlug)
    .maybeSingle();

  const tenantName = tenant?.name || "FleetMaster";
  const tenantDescription =
    tenant?.about ||
    `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;

  return {
    title: `Support | ${tenantName} - Premium Car Rental & Fleet Solutions`,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName} - Official Website`,
      description: tenantDescription,
    },
  };
}
export default function page() {
  const pages = [
    { label: "Home", href: "/" },
    { label: "Support", href: "/support" },
  ];

  return (
    <div className="space-y-8">
      <SecondaryHero
        pages={pages}
        title="View all your"
        highlightedText="Support Tickets"
        description="Need help? Our support team is here to assist you. Browse through your support tickets, check their status, and get the assistance you need to keep your fleet running smoothly."
      />
      <br />
      <div className="container mx-auto mt-5 min-h-screen max-w-6xl">
        <Support />
      </div>
    </div>
  );
}
