import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CompanySubscriptionsCard from "@/components/company-profile/CompanySubscriptionsCard";

import { Metadata } from "next";
import { getAdminTenant } from "@/utils/getAdminTenant";

export async function generateMetadata(): Promise<Metadata> {
  const { tenantData } = await getAdminTenant();

  let title;
  const tenantName = tenantData?.name;
  let tenantDescription = tenantData?.about;

  // Fallback to DB query if header data isn't present
  if (tenantName) {
    title = `Subscriptions | ${tenantName}: FleetMaster - Premium Car Rental & Fleet Solutions Software`;
    tenantDescription =
      tenantDescription ||
      `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;
  } else {
    title = `Subscriptions | FleetMaster - Premium Car Rental & Fleet Solutions Software`;
  }

  return {
    title: title,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName || "FleetMaster"} - Official Admin Website`,
      description: tenantDescription,
    },
  };
}

export default async function CompanyProfile() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Subscriptions" />

      <div className="space-y-6">
        <CompanySubscriptionsCard />
      </div>
    </div>
  );
}
