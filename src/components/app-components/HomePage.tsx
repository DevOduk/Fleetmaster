"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import { useUser } from "@/context/UserContext";
import { useEffect, useMemo, useState } from "react";
import { useAdminFleet } from "@/context/AdminFleetContext";
import { useAdminBooking } from "@/context/AdminBookingContext";
import ExpiryBanner from "../company-profile/ExpiryBanner";
import { fetchExpensesForAdmin } from "@/app/actions/expenses";
import Link from "next/link";
import { PlusIcon } from "@/icons";
import { fetchClientsForTenant } from "@/app/actions/client";
import DemographicCard from "./DemographicCard";
import UpcomingMaintenance from "../ecommerce/UpcomingMaintenance";
import TopUsers from "../ecommerce/TopUsers";

function HomePage() {
  const { profile } = useUser();
  const { bookings, loading: LoadingBookings } = useAdminBooking();
  const { vehicles, loading: loadingVehicles } = useAdminFleet();
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clients, setClients] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const targetMonthly = useMemo(() => {
    if (profile) {
      return profile.fleetmaster_tenants?.monthly_target;
    }
  }, [profile]);

  useEffect(() => {
    if (!profile) return;

    async function fetchAllBookings() {
      try {
        const response = await fetchExpensesForAdmin(profile?.tenant_id);

        if (response.success) {
          setExpenses(response.data);
        } else {
          console.error("API Error fetching expenses:", response.error);
        }
      } catch (err) {
        console.error("Network connection failure:", err);
      } finally {
        setLoading(false);
      }
    }
    async function fetchAllClients() {
      try {
        const res = await fetchClientsForTenant(profile?.tenant_id);

        if (res.success) {
          setClients(res.data);
        } else {
          console.error("API Error fetching clients:", res.error);
        }
      } catch (err) {
        console.error("Network connection failure:", err);
      } finally {
        setLoadingClients(false);
      }
    }

    fetchAllClients();
    fetchAllBookings();
  }, [profile]);

  return (
    <div>
      <ExpiryBanner
        plan={profile?.fleetmaster_tenants?.subscription_plan}
        expiryDate={profile?.fleetmaster_tenants?.expiry_date}
      />

      <div className="grid grid-cols-12 gap-4 text-gray-400 md:gap-6">
        {loadingVehicles ? (
          <>
            <div className="col-span-12">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    className="bg-brand-500/5 space-y-3 rounded-2xl border border-gray-200 p-5 md:p-6 dark:border-gray-800"
                    key={i}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700" />
                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <div className="h-4 w-23 bg-gray-100 dark:bg-white/7" />
                        <div className="mt-4 flex h-8 w-32 items-center justify-center bg-gray-50 dark:bg-gray-700" />
                      </div>
                      <div className="h-5 w-13 rounded-xl bg-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 xl:col-span-7">
              <div className="h-125 space-y-6 rounded-xl border border-gray-900/60 bg-transparent p-5 xl:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-36 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                  <div className="h-5 w-3 animate-pulse rounded bg-gray-400 dark:bg-gray-500" />
                </div>
                {/* Fake Bar Chart Bars */}
                <div className="flex h-100 items-end justify-between gap-3 px-2 pt-4">
                  {[
                    55, 80, 45, 70, 50, 65, 85, 30, 60, 90, 75, 40, 90, 100,
                    110, 50, 90, 75, 40, 90, 100,
                  ].map((height, i) => (
                    <div
                      key={i}
                      style={{ height: `${height}%` }}
                      className="w-full animate-pulse rounded-t bg-gray-300 dark:bg-gray-800"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-5">
              <div className="relative h-128 space-y-6 rounded-xl border border-gray-900/60 bg-transparent p-5">
                <div className="mb-4 space-y-3">
                  <div className="h-8 w-28 animate-pulse rounded bg-gray-800" />
                  <div className="h-4 w-44 animate-pulse rounded bg-gray-800/50" />
                </div>

                {/* Circular Gauge Centerpiece Approximation */}
                <div className="relative mx-auto flex h-64 w-64 animate-pulse items-center justify-center rounded-full border-4 border-dashed border-gray-800">
                  <div className="space-y-2 text-center">
                    <div className="mx-auto h-6 w-12 rounded bg-gray-800" />
                    <div className="mx-auto h-3 w-16 rounded bg-gray-800/60" />
                  </div>
                </div>

                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-800/60" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-800/60" />
              </div>
            </div>

            <div className="col-span-12">
              <div className="relative h-128 space-y-6 rounded-xl border border-gray-900/60 bg-transparent p-5">
                <div className="flex items-center justify-between">
                  <div className="mb-4 space-y-3">
                    <div className="h-8 w-28 animate-pulse rounded bg-gray-800" />
                    <div className="h-4 w-44 animate-pulse rounded bg-gray-800/50" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-30 animate-pulse rounded bg-gray-800" />
                    <div className="h-8 w-30 animate-pulse rounded bg-gray-800" />
                    <div className="h-8 w-30 animate-pulse rounded bg-gray-800" />
                    <div className="ms-2 h-8 w-30 animate-pulse rounded bg-gray-800" />
                  </div>
                </div>

                {/* Circular Gauge Centerpiece Approximation */}
                <div className="relative mx-auto flex h-64 w-full animate-pulse items-center justify-center border-4 border-dashed border-gray-800">
                  <div className="space-y-2 text-center">
                    <div className="mx-auto h-6 w-32 rounded bg-gray-800" />
                    <div className="mx-auto h-3 w-20 rounded bg-gray-800/60" />
                  </div>
                </div>

                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-800/60" />
              </div>
            </div>

            <div className="col-span-12 xl:col-span-5">
              <div className="space-y-3">
                <div className="mb-4 space-y-3">
                  <div className="h-7 w-28 animate-pulse rounded bg-gray-800" />
                  <div className="h-4 w-44 animate-pulse rounded bg-gray-800/50" />
                </div>
                <div className="h-70 animate-pulse rounded-lg bg-gray-800"></div>
                <div className="flex items-center justify-between">
                  <div className="mb-4 space-y-3">
                    <div className="h-7 w-28 animate-pulse rounded bg-gray-800" />
                    <div className="h-4 w-44 animate-pulse rounded bg-gray-800/50" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-30 animate-pulse rounded bg-gray-800" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-7">
              <div className="space-y-3">
                <div className="mb-4 space-y-3">
                  <div className="h-7 w-28 animate-pulse rounded bg-gray-800" />
                  <div className="h-4 w-44 animate-pulse rounded bg-gray-800/50" />
                </div>
                <div className="h-90 animate-pulse rounded-lg bg-gray-800"></div>
              </div>
            </div>
          </>
        ) : vehicles.length < 1 ? (
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
          <>
            <div className="col-span-12">
              <EcommerceMetrics
                bookings={bookings}
                loading={LoadingBookings || loading}
                vehicles={vehicles}
                loadingVehicles={loadingVehicles}
              />
            </div>

            <div className="col-span-12 xl:col-span-7">
              <MonthlySalesChart bookings={bookings} expenses={expenses} />

              <TopUsers
                clients={clients}
                loading={loadingClients}
              />
            </div>

            <div className="col-span-12 xl:col-span-5">
              <UpcomingMaintenance />

              <MonthlyTarget
                bookings={bookings}
                loadingBookings={LoadingBookings || loading}
                target={targetMonthly}
              />
            </div>

            <div className="col-span-12">
              <StatisticsChart
                bookings={bookings}
                loadingBookings={LoadingBookings || loading}
                target={targetMonthly}
                expenses={expenses}
              />
            </div>

            <div className="col-span-12 xl:col-span-5">
              <DemographicCard clients={clients} />
            </div>

            <div className="col-span-12 xl:col-span-7">
              <RecentOrders
                bookings={bookings}
                loading={LoadingBookings || loading}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
