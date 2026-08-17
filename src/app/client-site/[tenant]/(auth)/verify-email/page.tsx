import { Metadata } from "next";
import { createPublicClient } from "@/utils/supabase/server";
import ValidateEmailForm from "@/components/auth/ValidateEmailForm";

interface PageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tenant: tenantSlug } = await params;

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
    title: `Verify Email | ${tenantName} - Premium Car Rental & Fleet Solutions`,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName} - Official Website`,
      description: tenantDescription,
    },
  };
}

export default async function Verify({ params }: PageProps) {
  const resolvedParams = await params;

  return <ValidateEmailForm params={resolvedParams} />;
}
