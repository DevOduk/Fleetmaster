import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import SystemUsers from "@/components/bookings/SystemUsers";

export const metadata: Metadata = {
  title: "System Users | FleetManager Admin Dashboard",
  description: "Manage your system users.",
};

export default async function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="System Users" />
      <SystemUsers />
    </div>
  );
}