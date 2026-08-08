import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import ClientBookingContent from "@/components/marketing-components/ClientBookingContent";
import { Metadata } from "next";
import { createPublicClient } from "@/utils/supabase/server";


interface PageProps {
  params: Promise<{
    tenant: string;
  }>;
}


// 1. Dynamic Server-Side Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
    title: `My Bookings | ${tenantName} - Premium Car Rental & Fleet Solutions`,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName} - Official Website`,
      description: tenantDescription,
    },
  };
}


export default async function Page() {
  const pages = [{ label: 'Home', href: '/' }, { label: 'My Bookings', href: '/bookings' }];
  

  return (
    <div className="min-h-screen py-8">
      <SecondaryHero
        pages={pages}
        title="View all your"
        highlightedText="Bookings"
        description="Monitor your fleet performance and track your active rentals."
      />

      <ClientBookingContent  />
    </div>
  );
}