import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Feedback from "@/components/feedback/Feedback";

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
    title: `Feedback | ${tenantName} - Premium Car Rental & Fleet Solutions`,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName} - Official Website`,
      description: tenantDescription,
    },
  };
}

export default function page() {
  return (
    <div className="mt-8">
      <Feedback />
    </div>
  );
}
