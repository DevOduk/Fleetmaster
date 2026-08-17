import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CompanyInfoCard from "@/components/company-profile/CompanyInfoCard";
import { Metadata } from "next";
import { getAdminTenant } from "@/utils/getAdminTenant";

export async function generateMetadata(): Promise<Metadata> {
  const { tenantData } = await getAdminTenant();

  let title;
  const tenantName = tenantData?.name;
  let tenantDescription = tenantData?.about;

  // Fallback to DB query if header data isn't present
  if (tenantName) {
    title = `Company Profile | ${tenantName}: FleetMaster - Premium Car Rental & Fleet Solutions Software`;
    tenantDescription =
      tenantDescription ||
      `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;
  } else {
    title = `Company Profile | FleetMaster - Premium Car Rental & Fleet Solutions Software`;
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
      <PageBreadcrumb pageTitle="Company Profile" />
      {/* <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          View Profile
        </h3> */}
      <div className="space-y-6">
        <CompanyInfoCard />
      </div>
    </div>
  );
}
