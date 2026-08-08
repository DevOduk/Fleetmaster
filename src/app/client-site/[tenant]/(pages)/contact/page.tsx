import CallToAction from "@/components/marketing-components/CallToAction";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import ContactFormContainer from "@/components/client-components/ContactForm";

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
    title: `Contact | ${tenantName} - Premium Car Rental & Fleet Solutions`,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName} - Official Website`,
      description: tenantDescription,
    },
  };
}

export default function Page() {
  const pages = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Contact',
      href: '/contact',
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <SecondaryHero
        pages={pages}
        title="Get in touch with"
        highlightedText="Our Team"
        description="Have questions about features, setup, or scaling your enterprise operations? Drop us a message and our fleet experts will handle the rest."
      />
      <ContactFormContainer />

      {/* Dynamic CTA at the bottom */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <CallToAction />
      </div>
    </div>
  );
}