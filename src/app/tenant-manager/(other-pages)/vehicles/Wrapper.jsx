"use client";

import Vehicles from "@/components/vehicles/Vehicles";
import { useManagerFleet } from "@/context/ManagerFleetContext";

export default function DashboardVehiclesWrapper() {
  const { vehicles, loading } = useManagerFleet();
  const { profile } = useUser()

  return <Vehicles profile={profile} vehicles={vehicles} loading={loading} />;
}
