"use client";

import Vehicles from "@/components/vehicles/Vehicles";
import { useManagerFleet } from "@/context/ManagerFleetContext";

export default function DashboardVehiclesWrapper() {
  const { vehicles, loading } = useManagerFleet();

  return <Vehicles vehicles={vehicles} loading={loading} />;
}
