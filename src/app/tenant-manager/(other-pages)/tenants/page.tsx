// app/(tenant-manager)/(other-pages)/tenants/page.tsx

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "FleetManager Dashboard | Manage Tenants - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Manage Tenants" />
      This is the manage tenants page
    </div>
  );
}
