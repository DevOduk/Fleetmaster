// src/app/client-site/[tenant]/(auth)/signin/page.tsx

import { headers } from "next/headers";
import SignInForm from "@/components/auth/SignInForm";
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
    title: `Sign In | ${tenantName} - Premium Car Rental & Fleet Solutions`,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName} - Official Website`,
      description: tenantDescription,
    },
  };
}

export default async function SignIn({ 
  params 
}: { 
  params: Promise<{ tenant: string }> 
}) {
  const resolvedParams = await params;
  let tenant = resolvedParams.tenant;

  if (!tenant) {
    const headersList = await headers(); // headers() is also async now
    const host = headersList.get("host") || "";
    const parts = host.split(".");
    if (parts.length > 2) {
       tenant = parts[0];
    }
  }

  return <SignInForm tenant={tenant} />;
}