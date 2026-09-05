"use client";

import Vehicles from "@/components/vehicles/Vehicles";
import { useAdmin } from "@/context/AdminContext";
import { useManagerFleet } from "@/context/ManagerFleetContext";

export default function DashboardVehiclesWrapper() {
  const { vehicles, loading } = useManagerFleet();
  const { adminProfile: profile } = useAdmin()

  return <Vehicles profile={profile} vehicles={vehicles} loading={loading} />;
}
