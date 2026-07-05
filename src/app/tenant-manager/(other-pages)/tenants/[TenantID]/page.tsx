import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminCompanyInfoCard from "@/components/company-profile/AdminCompanyInfoCard";

// 1. Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Company Profile | FleetMaster Admin Dashboard",
    description: "View and manage your company profile information.",
  };
}
interface TenantPageProps {
  params: Promise<{ TenantID: string }>;
}

export default async function CompanyProfile({ params }: TenantPageProps) {
  const { TenantID } = await params;


  return (
    <div>

      <PageBreadcrumb items={
        [
          {
            label: 'Tenants',
            href: '/tenants',
          }
        ]
      } pageTitle="Company Profile" />

      <div className="space-y-6">
        <AdminCompanyInfoCard TenantID={TenantID} />
      </div>
    </div>
  );
}


