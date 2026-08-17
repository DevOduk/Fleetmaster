import { Metadata } from "next";
import { createPublicClient } from "@/utils/supabase/server";
import AccountSeetingsWarapper from "./AccountSeetingsWarapper";

interface PageProps {
  params: Promise<{
    tenant: string;
  }>;
}

// 1. Dynamic Server-Side Metadata Generation
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tenantSlug = resolvedParams.tenant;

  const supabase = createPublicClient();
  const { data: tenant } = await supabase
    .from("fleetmaster_tenants")
    .select("name, about")
    .eq("slug", tenantSlug)
    .maybeSingle();

  const tenantName = tenant?.name || "FleetMaster";
  const tenantDescription =
    tenant?.about ||
    `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;

  return {
    title: `Account Settings | ${tenantName} - Premium Car Rental & Fleet Solutions`,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName} - Official Website`,
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
    <div className="container m-auto min-h-screen">
      <div className="mt-4 mb-4 rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="mb-4 flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Account Settings
          </h3>
        </div>
        <div className="space-y-6">
          <AccountSeetingsWarapper currentSetting={settingTitle} />
        </div>
      </div>
    </div>
  );
}
