import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditCompanyInfoCard from "@/components/company-profile/EditCompanyInfoCard";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import { Metadata } from "next";
import { getAdminTenant } from "@/utils/getAdminTenant";

export async function generateMetadata(): Promise<Metadata> {
  const { tenantData } = await getAdminTenant();

  let title;
  const tenantName = tenantData?.name;
  let tenantDescription = tenantData?.about;

  // Fallback to DB query if header data isn't present
  if (tenantName) {
    title = `Update Company Profile | ${tenantName}: FleetMaster - Premium Car Rental & Fleet Solutions Software`;
    tenantDescription =
      tenantDescription ||
      `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;
  } else {
    title = `Update Company Profile | FleetMaster - Premium Car Rental & Fleet Solutions Software`;
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

export default function Profile() {
  return (
    <div>
      <PageBreadcrumb
        items={[
          {
            label: "Company Profile",
            href: "/company-profile",
          },
        ]}
        pageTitle="Edit Company Profile"
      />
      <div className="mb-6 flex items-center gap-3">
        <Link href="/company-profile" className="mr-2">
          <Button size="sm" variant="danger-outline">
            <ChevronLeftIcon />
            Back to Company Profile
          </Button>
        </Link>
      </div>
      <div className="space-y-6">
        <EditCompanyInfoCard />
      </div>
    </div>
  );
}
