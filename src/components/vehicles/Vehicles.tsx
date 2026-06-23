"use client";
import React, { useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import Pagination from "../tables/Pagination";
import VehiclesTable from "../tables/VehiclesTable";
import { bookings } from "@/data/mockFleetData";
import Link from "next/link";
import { useFleet } from "@/context/FleetContext";

const Vehicles: React.FC = () => {
  const { vehicles } = useFleet();

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="All Vehicles Data">
          <div className="flex justify-between py-3 items-center">
            <div>
              <p className="font-medium text-gray-800 mb-2 text-theme-sm dark:text-white/90">
                View all vehicles and manage them. Click Add New Vehicle to add a new vehicle.
              </p>
              <span className="text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {vehicles?.length || 0} Vehicles | {bookings?.length || 0} Booked | 7 Average per Day
              </span>
            </div>
            <Link href={'/vehicles/new'}>
              <button
                className="flex items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
              >
                Add New Vehicle
              </button>
            </Link>
          </div>
          <VehiclesTable />
        </ComponentCard>
      </div>
    </div>
  );
};

export default Vehicles;