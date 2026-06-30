"use client"
import { useFleet } from "@/context/FleetContext";
import VehicleItem from "@/components/client-components/Vehicles/VehicleItem"
import { VehicleSkeleton } from "./VehicleSkeleton";

interface Tenant {
    tenant: string;
}

export default function ViewAllSnapshots({ tenant }: Tenant) {
    const { vehicles } = useFleet();
    const resetFiltersStates = {
    category: '',
    make: '',
    model: '',
    minYear: 0,
    maxYear: 2026,
    minPrice: 0,
    maxPrice: 100000,
    driverType: "All",
    location: "Countrywide",
    start: '',
    end: ''
};

    return (
        <div datatype={tenant} className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 gap-3">
            {vehicles.length > 1 ? vehicles.slice(0, 12).map((VehicleDetails) => (
                <VehicleItem isBooked={false} key={VehicleDetails.id} VehicleDetails={VehicleDetails} filters={resetFiltersStates} />
            )) : (
                Array.from({ length: 8 }).map((_, index) => (
                    <VehicleSkeleton key={`skeleton-${index}`} />
                ))
            )
            }
        </div>
    );
}