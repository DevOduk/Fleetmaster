// src/app/admin-site/(others-pages)/system-users/page.tsx
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import SystemManagers from "@/components/bookings/SystemManagers";

export const metadata: Metadata = {
  title: "FleetManager Admin Dashboard - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS...",
};



export default async function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="System Users" />
      {/* Pass loading as false because by the time this renders, the server data is already fetched */}
      <SystemManagers
      />
    </div>
  );
}