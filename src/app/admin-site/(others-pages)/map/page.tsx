import Map from "@/components/map/Map";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VpnLockOutlinedIcon from "@mui/icons-material/VpnLockOutlined"
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
    title: `Map | ${tenantName}: FleetMaster - Premium Car Rental & Fleet Solutions Software`,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName} - Official Admin Website`,
      description: tenantDescription,
    },
  };
}


export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Map" />
      <div className="mt-10 text-red-400 flex-col gap-4 dark:text-red-600 text-[10px] min-h-[75vh] justify-center flex items-center">
        <VpnLockOutlinedIcon fontSize="large" className="text-2xl" />
        <p className=" font-medium tracking-[0.2em] uppercase text-red-400 dark:text-red-600">
          Error Status: FEATURE COMING SOON
        </p>
        <p className="text-sm text-gray-500 max-w-4xl">Live maps integration is coming soon. With real-time vehicle traccking and telematics ensring you car is safe, secure and running well.</p>
      </div>

      {/* <Map /> */}
    </div>
  );
}
