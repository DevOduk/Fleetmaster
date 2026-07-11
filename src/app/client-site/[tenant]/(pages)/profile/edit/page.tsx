import EditUserAddressCard from "@/components/ProfilePage/edit-client-profile/EditUserAddressCard";
import EditUserDocumentsCard from "@/components/ProfilePage/edit-client-profile/EditUserDocumentsCard";
import EditUserInfoCard from "@/components/ProfilePage/edit-client-profile/EditUserInfoCard";
import EditUserMetaCard from "@/components/ProfilePage/edit-client-profile/EditUserMetaCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Edit Profile | FleetManager Admin Dashboard - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default function Profile() {
  return (
    <div className="container m-auto min-h-screen">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <div className="flex gap-3 items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Edit Profile
          </h3>
        </div>
        <div className="space-y-6">
          <EditUserMetaCard />
          <EditUserInfoCard />
          <EditUserAddressCard />
          <EditUserDocumentsCard />
        </div>
      </div>
    </div>
  );
}
