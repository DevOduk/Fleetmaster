import Button from "@/components/ui/button/Button";
import EditUserAddressCard from "@/components/user-profile/EditUserAddressCard";
import EditUserDocumentsCard from "@/components/user-profile/EditUserDocumentsCard";
import EditUserInfoCard from "@/components/user-profile/EditUserInfoCard";
import UserMetaCard from "@/components/user-profile/ProfilePage/UserMetaCard";
import { ChevronLeftIcon } from "@/icons";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

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

          {/* <Link href="/profile" className="mr-2">
            <Button size="sm" variant="danger-outline">
              <ChevronLeftIcon />
              Back to Profile
            </Button>
          </Link> */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Edit Profile
          </h3>
        </div>
        <div className="space-y-6">
          <UserMetaCard />
          <EditUserInfoCard />
          <EditUserAddressCard />
          <EditUserDocumentsCard />
        </div>
      </div>
    </div>
  );
}
