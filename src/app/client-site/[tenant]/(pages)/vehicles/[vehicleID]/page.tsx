import type { Metadata } from "next";
import { createPublicClient } from "@/utils/supabase/server";
import ViewVehiclePage from "@/components/client-components/Vehicles/ViewVehiclePage";
import { fetchVehicleDetails } from "@/app/actions/vehicles";

interface VehiclePageProps {
  params: Promise<{ vehicleID: string; tenant: string }>;
}

// 1. Dynamic Server-Side Metadata Generation
export async function generateMetadata({
  params,
}: VehiclePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tenantSlug = resolvedParams.tenant;
  const vehicleID = resolvedParams.vehicleID;

  const supabase = createPublicClient();
  const { data: tenant } = await supabase
    .from("fleetmaster_tenants")
    .select("name, about")
    .eq("slug", tenantSlug)
    .maybeSingle();

  const vehicle = await fetchVehicleDetails(parseInt(vehicleID));
  const vehicleMake = vehicle?.data?.make || "Vehicle";
  const vehicleModel = vehicle?.data?.model || "Model";
  const vehicleYear = vehicle?.data?.year || "Year";
  const vehicleLocation = vehicle?.data?.location || "Location";
  const vehicleDescription = vehicle?.data?.description || "Description";

  const tenantName = tenant?.name || "FleetMaster";
  const tenantDescription =
    tenant?.about ||
    `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;

  return {
    title: `${vehicleMake} ${vehicleModel} ${vehicleYear} in ${vehicleLocation} - #${vehicleID} | ${tenantName} - Premium Car Rental & Fleet Solutions`,
    description: vehicleDescription,
    openGraph: {
      title: `${tenantName} - Official Website`,
      description: tenantDescription,
    },
  };
}

const VehiclePage = ({ params }: VehiclePageProps) => {
  return <ViewVehiclePage params={params} />;
};

export default VehiclePage;
