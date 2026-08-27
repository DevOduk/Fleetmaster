"use client";

import ComponentCard from "../common/ComponentCard";
import VehiclesTable from "../tables/VehiclesTable";
import Link from "next/link";
import { PlusIcon } from "@/icons";
import { getVehiclesByPlan } from "../bookings/SystemUsers";

function Vehicles({
  profile,
  vehicles,
  loading,
}: {
  profile: any;
  vehicles: any[];
  loading: boolean;
}) {
  const isDashboard = window?.location.href.includes("dashboard");
  const plan = profile?.fleetmaster_tenants?.subscription_plan || "Trial";


  return (
    <div>
      <div className="space-y-6">
        {loading ? (
          <div className="min-h-[80vh] animate-pulse space-y-6">
            {/* Header Card Skeleton */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between py-3">
                <div className="w-2/3 space-y-3">
                  <div className="h-5 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="h-10 w-35 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>

            {/* Table / Rows Skeleton */}
            <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-6 h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-4">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-full rounded bg-gray-100 dark:bg-gray-800"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ) : vehicles?.length < 1 ? (
          <div className="col-span-12 m-auto flex min-h-[70vh] w-full flex-col items-center justify-center rounded-2xl p-8 text-center shadow-sm">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white">
              <svg
                className="text-brand-700 h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </div>

            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Add your first vehicle
            </h2>
            <p className="mb-8 max-w-md text-sm text-gray-500">
              You're all set up! Start tracking your fleet by adding your first
              vehicle to the system. It only takes a minute.
            </p>

            <Link
              href="/vehicles/new"
              className="bg-brand-600 focus:ring-brand-500 inline-flex items-center gap-3 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95"
            >
              <PlusIcon />
              Register New Vehicle
            </Link>
          </div>
        ) : (
          <div title="All Vehicles Data">
            <div className="flex items-start md:items-center gap-7 justify-between py-3 flex-col md:flex-row">
              <div>
                <p className="text-theme-sm mb-2 font-medium text-gray-800 dark:text-white/90">
                  {isDashboard
                    ? "View all system vehicles across multiple tenants."
                    : "View all vehicles and manage them. Click Add New Vehicle to add a new vehicle."}
                </p>
                <span className="text-theme-sm text-start text-gray-500 dark:text-gray-400">
                  <strong>{vehicles?.length || 0} Vehicles</strong> of <strong>{getVehiclesByPlan(plan)}</strong> listings |{" "}
                  {vehicles?.filter((v) => v.status === "Available").length ||
                    0}{" "}
                  Available
                </span>
              </div>
              {!isDashboard && (
                <Link href={"/vehicles/new"}>
                  <button className="bg-brand-500 text-theme-sm hover:bg-brand-600 flex items-center justify-center rounded-lg p-2 px-3 font-medium text-white">
                    Add New Vehicle
                  </button>
                </Link>
              )}
            </div>
            <VehiclesTable vehicles={vehicles || []} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Vehicles;
