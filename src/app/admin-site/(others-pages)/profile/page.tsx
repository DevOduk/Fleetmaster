import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserAddressCard from "@/components/ProfilePage/admin-profile/UserAddressCard";
import UserMetaCard from "@/components/ProfilePage/admin-profile/UserMetaCard";
import UserInfoCard from "@/components/ProfilePage/admin-profile/UserInfoCard";

export const metadata: Metadata = {
  title:
    "View Profile | FleetManager Admin Dashboard - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default function Profile() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">

        <PageBreadcrumb pageTitle="View Profile" />

        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </div>
  );
}
