// src/utils/vehicles-cache.ts
import { createPublicClient } from "@/utils/supabase/server"; // <-- MAKE SURE THIS IS createPublicClient
import { unstable_cache } from "next/cache";

export const getCachedVehicles = unstable_cache(
  async () => {
    // CHANGE THIS LINE from 'createClient()' to 'createPublicClient()'
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("fleetmaster_vehicles")
      .select("*");

    if (error || !data) return null;

    const vehicles = data.map((vehicle) => ({
      ...vehicle,
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      seats: vehicle.seats,
      category: vehicle.category,
      owner: vehicle.owner,
      licensePlate: vehicle.license_plate,
      vin: vehicle.vin,
      nextServiceDue: vehicle.next_service_due,
      status: vehicle.status,
      dailyRate: vehicle.daily_rate,
      minRentalDays: vehicle.min_rental_days,
      imageUrl: vehicle.image_url,
      location: vehicle.location,
      transmission: vehicle.transmission,
      group: vehicle.group,
      description: vehicle.description,
      driverType: vehicle.driver_type,
      fuelType: vehicle.fuel_type,
      tracker: {
        provider: vehicle.tracker_provider,
        trackingApiUrl: vehicle.tracking_api_url,
      },
      tenantId: vehicle.tenant_id,
    }));

    return vehicles;
  },
  ["vehicle-resolution-key"],
  {
    revalidate: 60 * 60 * 2, // 2 hour memory expiration
    tags: ["vehicles"]
  }
);