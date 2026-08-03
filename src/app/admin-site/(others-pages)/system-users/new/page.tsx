import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewUserCard from "@/components/ProfilePage/new-admin-profile/NewUserCard";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Create New User | FleetMaster - Best tool for Fleet Management",
  // description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default function NewBooking() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        {/* this breadcrumb should show home / bookings / create new booking */}

        <PageBreadcrumb items={[{ label: 'System Users', href: '/system-users' }]} pageTitle="Create New User" />

        <div className="flex gap-3 items-center mb-4">

          <Link href="/system-users" className="mr-2">
            <Button size="sm" variant="danger-outline">
              <ChevronLeftIcon />
              Back to Users
            </Button>
          </Link>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Create New User
          </h3>
        </div>
        <div className="space-y-3">

          <NewUserCard />
        </div>
      </div>
    </div>
  );
}
