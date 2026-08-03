import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import AccountSettings from "@/components/account/AccountSettings";
import { Metadata } from "next";


export const metadata: Metadata = {
  title:
    "Account Settings  | FleetMaster - Best tool for Fleet Management",
  //  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};
export default function SettingsPage() {
  return (
    <div>
      <PageBreadCrumb pageTitle="Account Settings" />

      <div className="mb-8">
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm p-2">
          Manage your account information, preferences, and security settings
        </p>
      </div>

      <AccountSettings />
    </div>
  );
}
