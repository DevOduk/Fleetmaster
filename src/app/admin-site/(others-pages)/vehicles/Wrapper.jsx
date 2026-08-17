"use client";

import Vehicles from "@/components/vehicles/Vehicles";
import { useAdminFleet } from "@/context/AdminFleetContext";

export default function VehiclesWrapper() {
  const { vehicles, loading } = useAdminFleet();

  return <Vehicles vehicles={vehicles} loading={loading} />;
}
