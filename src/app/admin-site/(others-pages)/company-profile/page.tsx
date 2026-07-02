import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CompanyInfoCard from "@/components/company-profile/CompanyInfoCard";

// 1. Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Company Profile | FleetMaster Admin Dashboard",
    description: "View and manage your company profile information.",
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


