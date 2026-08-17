import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import AccountSeetingsWarapper from "@/app/client-site/[tenant]/(pages)/profile/account-settings/[[...setting]]/AccountSeetingsWarapper";
import { Metadata } from "next";
import { getAdminTenant } from "@/utils/getAdminTenant";

export async function generateMetadata(): Promise<Metadata> {
  const { tenantData } = await getAdminTenant();

  let title;
  const tenantName = tenantData?.name;
  let tenantDescription = tenantData?.about;

  // Fallback to DB query if header data isn't present
  if (tenantName) {
    title = `Map | ${tenantName}: FleetMaster - Premium Car Rental & Fleet Solutions Software`;
    tenantDescription =
      tenantDescription ||
      `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;
  } else {
    title = `Map | FleetMaster - Premium Car Rental & Fleet Solutions Software`;
  }

  return {
    title: title,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName || "FleetMaster"} - Official Admin Website`,
      description: tenantDescription,
    },
  };
}
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
        <p className="mt-2 p-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your account information, preferences, and security settings
        </p>
      </div>

      <AccountSeetingsWarapper currentSetting={settingTitle} />
    </div>
  );
}
