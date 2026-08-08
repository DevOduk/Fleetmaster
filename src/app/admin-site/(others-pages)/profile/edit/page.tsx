import EditSystemUserCard from "@/components/ProfilePage/new-admin-profile/EditSystemUserCard";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
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
    title: `Edit Profile | ${tenantName}: FleetMaster - Premium Car Rental & Fleet Solutions Software`,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName} - Official Admin Website`,
      description: tenantDescription,
    },
  };
}

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
