"use client";
import React, { useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import VehiclesTable from "../tables/VehiclesTable";
import Link from "next/link";
import { useAdminFleet } from "@/context/AdminFleetContext";
import { useAdminBooking } from "@/context/AdminBookingContext";
import { PlusIcon } from "@/icons";

const Vehicles: React.FC = () => {
  const { vehicles, loading } = useAdminFleet();
  const { bookings } = useAdminBooking();

  return (
    <div>
      <div className="space-y-6">
        {
          loading ?
            <div className="space-y-6 animate-pulse min-h-[80vh]">
              {/* Header Card Skeleton */}
              <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between py-3 items-center">
                  <div className="space-y-3 w-2/3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-35"></div>
                </div>
              </div>

              {/* Table / Rows Skeleton */}
              <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
                <div className="space-y-4">
                  {[...Array(9)].map(l => (
                    <div key={l} className="h-10 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                  ))}
                </div>
              </div>
            </div>
            : vehicles.length < 1 ? (
              <div className="flex w-full flex-col items-center justify-center min-h-[70vh] m-auto p-8 text-center rounded-2xl shadow-sm col-span-12">
                <div className="flex items-center justify-center w-16 h-16 mb-6 bg-white rounded-full">
                  <svg className="w-8 h-8 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>

                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Add your first vehicle</h2>
                <p className="max-w-md mb-8 text-gray-500 text-sm">
                  You're all set up! Start tracking your fleet by adding your first vehicle to the system. It only takes a minute.
                </p>

                <Link href="/vehicles/new"
                  className="inline-flex items-center px-6 py-3 text-sm gap-3 font-semibold text-white transition-all bg-brand-600 rounded-lg shadow-lg hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                  <PlusIcon />
                  Register New Vehicle
                </Link>
              </div>
            ) : (
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
            )}
      </div>
    </div>
  );
};

export default Vehicles;