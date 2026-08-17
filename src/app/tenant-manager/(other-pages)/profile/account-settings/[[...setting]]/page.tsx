import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import AccountSettings from "@/components/account/AccountSettings";
import { Metadata } from "next";
import AccountSeetingsWarapper from "./AccountSeetingsWarapper";

export const metadata: Metadata = {
  title:
    "Account Settings | FleetMaster Dashboard - Best tool for Fleet Management",
  description:
    "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ setting: string }>;
}) {
  const resolvedParams = await params;
  // Handle optional or missing [setting] segment, replacing underscores with spaces and capitalizing
  const settingParam = resolvedParams?.setting;
  const rawSetting = Array.isArray(settingParam)
    ? settingParam[0]
    : settingParam;

  // Format title: ensure rawSetting is a valid string before calling .replace()
  const settingTitle =
    typeof rawSetting === "string" && rawSetting.length > 0
      ? rawSetting
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "Accessibility";

  return (
    <div>
      <PageBreadCrumb pageTitle="Account Settings" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your administrator account information, preferences, and
          security settings
        </p>
      </div>

      <AccountSeetingsWarapper currentSetting={settingTitle} />
    </div>
  );
}
