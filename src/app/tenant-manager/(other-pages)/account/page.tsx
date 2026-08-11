import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminMetaCard from "@/components/ProfilePage/tenant-manager-profile/UserMetaCard";
import AdminInfoCard from "@/components/ProfilePage/tenant-manager-profile/UserInfoCard";
import AdminAddressCard from "@/components/ProfilePage/tenant-manager-profile/UserAddressCard";

export const metadata: Metadata = {
  title:
    "View Profile | FleetMaster Dashboard - Best tool for Fleet Management",
  description: "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default function Profile() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <PageBreadcrumb pageTitle="Admin Profile" />

        <div className="space-y-6">
          <AdminMetaCard />
          <AdminInfoCard />
          <AdminAddressCard />
        </div>
      </div>
    </div>
  );
}
