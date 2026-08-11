import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import AccountSettings from "@/components/account/AccountSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Account Settings | FleetMaster Dashboard - Best tool for Fleet Management",
  description: "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default function SettingsPage() {
  return (
    <div>
      <PageBreadCrumb pageTitle="Account Settings" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your administrator account information, preferences, and security settings
        </p>
      </div>

      <AccountSettings />
    </div>
  );
}
