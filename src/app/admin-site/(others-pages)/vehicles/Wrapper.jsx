"use client";

import Vehicles from "@/components/vehicles/Vehicles";
import { useAdminFleet } from "@/context/AdminFleetContext";
import { useUser } from "@/context/UserContext";

export default function VehiclesWrapper() {
  const { vehicles, loading } = useAdminFleet();
  const { profile } = useUser()

  return <Vehicles profile={profile} vehicles={vehicles} loading={loading} />;
}
