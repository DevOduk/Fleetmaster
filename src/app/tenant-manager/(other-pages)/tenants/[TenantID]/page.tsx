import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminCompanyInfoCard from "@/components/company-profile/AdminCompanyInfoCard";

// 1. Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title:
      "View Tenant | FleetMaster Dashboard - Best tool for Fleet Management",
    description: "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
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


