import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Feedback from "@/components/feedback/Feedback";

import { Metadata } from "next";
import { getAdminTenant } from "@/utils/getAdminTenant";

export async function generateMetadata(): Promise<Metadata> {
  const { tenantData } = await getAdminTenant();

  let title;
  const tenantName = tenantData?.name;
  let tenantDescription = tenantData?.about;

  // Fallback to DB query if header data isn't present
  if (tenantName) {
    title = `Feedback | ${tenantName}: FleetMaster - Premium Car Rental & Fleet Solutions Software`;
    tenantDescription =
      tenantDescription ||
      `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;
  } else {
    title = `Feedback | FleetMaster - Premium Car Rental & Fleet Solutions Software`;
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

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Feedback" />
      <Feedback />
    </div>
  );
}
