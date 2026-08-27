import Map from "@/components/map/Map";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VpnLockOutlinedIcon from "@mui/icons-material/VpnLockOutlined";
import { Metadata } from "next";
import { getAdminTenant } from "@/utils/getAdminTenant";
import FeatureError from "@/components/loading/FeatureError";

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

      <FeatureError icon={<VpnLockOutlinedIcon fontSize="large" className="text-3xl" />} description="Live maps integration is coming soon. With real-time vehicle traccking and telematics ensring you car is safe, secure and running well. Keep on the watch!" />
      {/* <Map /> */}
    </div>
  );
}
