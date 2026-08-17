// src/app/admin-site/(others-pages)/system-users/page.tsx
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import SystemManagers from "@/components/bookings/SystemManagers";

export const metadata: Metadata = {
  title:
    "System Users | FleetMaster Dashboard - Best tool for Fleet Management",
  description:
    "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default async function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="System Users" />
      {/* Pass loading as false because by the time this renders, the server data is already fetched */}
      <SystemManagers />
    </div>
  );
}
