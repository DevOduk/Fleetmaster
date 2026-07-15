import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditCompanyInfoCard from "@/components/company-profile/EditCompanyInfoCard";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Edit Company Profile | FleetMaster Admin Dashboard - Best tool for Fleet Management",
  description: "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default function Profile() {
  return (
    <div>
      <PageBreadcrumb items={
        [
          {
            label: 'Company Profile',
            href: '/company-profile'
          }
        ]
      } pageTitle="Edit Company Profile" />
      <div className="flex gap-3 items-center mb-6 ">
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
