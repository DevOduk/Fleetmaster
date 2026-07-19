import EditUserAddressCard from "@/components/ProfilePage/edit-admin-profile/EditUserAddressCard";
import EditUserInfoCard from "@/components/ProfilePage/edit-admin-profile/EditUserInfoCard";
import EditUserMetaCard from "@/components/ProfilePage/edit-admin-profile/EditUserMetaCard";
import EditSystemUserCard from "@/components/ProfilePage/new-admin-profile/EditSystemUserCard";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Edit Profile | FleetManager Admin Dashboard - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default function Profile() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <div className="flex gap-3 items-center mb-4">

          <Link href="/profile" className="mr-2">
            <Button size="sm" variant="danger-outline">
              <ChevronLeftIcon />
              Back to Profile
            </Button>
          </Link>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Edit Profile
          </h3>
        </div>
        <div className="space-y-6">
          <EditSystemUserCard />
        </div>
      </div>
    </div>
  );
}
