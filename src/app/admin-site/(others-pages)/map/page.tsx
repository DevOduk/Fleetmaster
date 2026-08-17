import Map from "@/components/map/Map";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VpnLockOutlinedIcon from "@mui/icons-material/VpnLockOutlined";
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

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Map" />
      <div className="mt-10 flex min-h-[75vh] flex-col items-center justify-center gap-4 text-[10px] text-red-400 dark:text-red-600">
        <VpnLockOutlinedIcon fontSize="large" className="text-2xl" />
        <p className="font-medium tracking-[0.2em] text-red-400 uppercase dark:text-red-600">
          Error Status: FEATURE COMING SOON
        </p>
        <p className="max-w-4xl text-sm text-gray-500">
          Live maps integration is coming soon. With real-time vehicle traccking
          and telematics ensring you car is safe, secure and running well.
        </p>
      </div>

      {/* <Map /> */}
    </div>
  );
}
