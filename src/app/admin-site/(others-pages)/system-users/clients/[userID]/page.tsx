import ProfilePage from "@/components/ProfilePage/admin-profile/ProfilePage";
import { Metadata } from "next";
import { headers } from "next/headers";
import { createPublicClient } from "@/utils/supabase/server";

// Helper function to safely extract and parse tenant data from headers
async function getTenantFromHeaders() {
  const headerList = await headers();
  const tenantId = headerList.get("x-tenant-id");
  const rawTenantData = headerList.get("x-tenant-data");

  let tenantData = null;
  if (rawTenantData) {
    try {
      tenantData = JSON.parse(rawTenantData);
    } catch (e) {
      console.error("Failed to parse x-tenant-data header:", e);
    }
  }

  return { tenantId, tenantData };
}

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getTenantClientDetails } from "@/app/actions/client";

// 1. Dynamic Server-Side Metadata Generation
export async function generateMetadata(): Promise<Metadata> {
  const { tenantData } = await getTenantFromHeaders();

  // If header tenant data exists, use it directly (saves a DB query)
  let tenantName = tenantData?.name;
  let tenantDescription = tenantData?.about;

  // Fallback to DB query if header data isn't present
  if (!tenantName) {
    const supabase = createPublicClient();
    const { data: tenant } = await supabase
      .from("fleetmaster_tenants")
      .select("name, about")
      .limit(1)
      .maybeSingle();

    tenantName = tenant?.name || "FleetMaster";
    tenantDescription =
      tenant?.about ||
      `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;
  } else {
    tenantDescription =
      tenantDescription ||
      `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;
  }

  return {
    title: `System Users | ${tenantName}: FleetMaster - Premium Car Rental & Fleet Solutions Software`,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName} - Official Admin Website`,
      description: tenantDescription,
    },
  };
}

export default async function Profile({
  params,
}: {
  params: Promise<{ userID: string }>;
}) {
  const { userID } = await params;

  // Fetch user profile data based on userID
  const res = await getTenantClientDetails(userID);
  const profile = res.data;

  if (!profile) {
    return (
      <div className="container mx-auto min-h-[80vh] p-5 text-gray-400">
        User profile not found.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
      <PageBreadcrumb
        items={[
          {
            label: "System Users",
            href: "/system-users",
          },
        ]}
        pageTitle="View Profile"
      />

      <div className="space-y-6">
        <ProfilePage userProfile={profile} />
      </div>
    </div>
  );
}
