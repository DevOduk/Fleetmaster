"use client"
import { useFleet } from "@/context/FleetContext";
import VehicleItem from "@/components/client-components/Vehicles/VehicleItem"
import { VehicleSkeleton } from "./VehicleSkeleton";

interface Tenant {
    tenant: string;
}

export default function ViewAllSnapshots({ tenant }: Tenant) {
    const { vehicles, loading } = useFleet();
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
            {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                    <VehicleSkeleton animate key={`skeleton-${index}`} />
                ))
            ) : vehicles.length > 0 ? vehicles.slice(0, 12).map((VehicleDetails) => (
                <VehicleItem isBooked={false} key={VehicleDetails.id} VehicleDetails={VehicleDetails} filters={resetFiltersStates} />
            )) : (
                <>
                    {

                        Array.from({ length: 4 }).map((_, index) => (
                            <VehicleSkeleton key={`skeleton-${index}`} />
                        ))
                    }
                    <div className="col-span-full">
                        <p className="text-center w-full text-red-500 py-8">We could not find any cars!</p>
                    </div>
                </>
            )
            }
        </div>
    );
}