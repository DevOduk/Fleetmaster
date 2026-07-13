"use client"
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { useUser } from '@/context/UserContext';
import { useEffect, useMemo, useState } from "react";
import { useAdminFleet } from "@/context/AdminFleetContext";
import { useAdminBooking } from "@/context/AdminBookingContext";
import ExpiryBanner from "../company-profile/ExpiryBanner";
import { fetchExpensesForAdmin } from "@/app/actions/expenses";
import Link from "next/link";
import { PlusIcon } from "@/icons";


function HomePage() {
  const { profile } = useUser();
  const { bookings, loading: LoadingBookings } = useAdminBooking();
  const { vehicles, loading: loadingVehicles } = useAdminFleet();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([])

  const targetMonthly = useMemo(() => {
    if (profile) {
      return profile.fleetmaster_tenants?.monthly_target;
    }
  }, [profile])

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

    fetchAllBookings();
  }, [profile]);


  return (
    <div>
      <ExpiryBanner plan={profile?.fleetmaster_tenants?.subscription_plan} expiryDate={profile?.fleetmaster_tenants?.expiry_date} />

      <div className="grid grid-cols-12 gap-4 md:gap-6 text-gray-400">
        {
          loadingVehicles ? <>
            <div className="col-span-12">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
                {
                  [...Array(4)].map((_, i) => (
                    <div className="rounded-2xl border border-gray-200 bg-brand-500/5 p-5 dark:border-gray-800 md:p-6 space-y-3" key={i}>
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl dark:bg-gray-700" />
                      <div className="flex items-end justify-between mt-5">
                        <div>
                          <div className="h-4 dark:bg-white/7 bg-gray-100 w-23" />
                          <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700" />
                        </div>
                        <div className="bg-gray-700 w-13 h-5 rounded-xl" />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="col-span-12 xl:col-span-7">

              <div className="xl:col-span-2 bg-transparent border border-gray-900/60 p-5 rounded-xl space-y-6 h-125">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-36 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                  <div className="h-5 w-3 bg-gray-400 dark:bg-gray-500 rounded animate-pulse" />
                </div>
                {/* Fake Bar Chart Bars */}
                <div className="h-100 flex items-end justify-between gap-3 pt-4 px-2">
                  {[55, 80, 45, 70, 50, 65, 85, 30, 60, 90, 75, 40, 90, 100, 110, 50, 90, 75, 40, 90, 100].map((height, i) => (
                    <div
                      key={i}
                      style={{ height: `${height}%` }}
                      className="w-full bg-gray-300 dark:bg-gray-800 rounded-t animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-5">

              <div className="bg-transparent relative border border-gray-900/60 p-5 rounded-xl space-y-6 h-128">
                <div className="space-y-3 mb-4">
                  <div className="h-8 w-28 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-44 bg-gray-800/50 rounded animate-pulse" />
                </div>

                {/* Circular Gauge Centerpiece Approximation */}
                <div className="relative h-64 w-64 mx-auto flex items-center justify-center border-4 border-dashed border-gray-800 rounded-full animate-pulse">
                  <div className="text-center space-y-2">
                    <div className="h-6 w-12 bg-gray-800 rounded mx-auto" />
                    <div className="h-3 w-16 bg-gray-800/60 rounded mx-auto" />
                  </div>
                </div>

                <div className="h-10 w-full bg-gray-800/60 rounded-lg animate-pulse" />
                <div className="h-10 w-full bg-gray-800/60 rounded-lg animate-pulse" />
              </div>
            </div>

            <div className="col-span-12">
              <div className="bg-transparent relative border border-gray-900/60 p-5 rounded-xl space-y-6 h-128">
                <div className="flex justify-between items-center">
                  <div className="space-y-3 mb-4">
                    <div className="h-8 w-28 bg-gray-800 rounded animate-pulse" />
                    <div className="h-4 w-44 bg-gray-800/50 rounded animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-30 bg-gray-800 rounded animate-pulse" />
                    <div className="h-8 w-30 bg-gray-800 rounded animate-pulse" />
                    <div className="h-8 w-30 bg-gray-800 rounded animate-pulse" />
                    <div className="h-8 w-30 ms-2 bg-gray-800 rounded animate-pulse" />
                  </div>
                </div>

                {/* Circular Gauge Centerpiece Approximation */}
                <div className="relative h-64 w-full mx-auto flex items-center justify-center border-4 border-dashed border-gray-800 animate-pulse">
                  <div className="text-center space-y-2">
                    <div className="h-6 w-32 bg-gray-800 rounded mx-auto" />
                    <div className="h-3 w-20 bg-gray-800/60 rounded mx-auto" />
                  </div>
                </div>

                <div className="h-10 w-full bg-gray-800/60 rounded-lg animate-pulse" />
              </div>
            </div>

            <div className="col-span-12 xl:col-span-5">
              <div className="space-y-3">
                <div className="space-y-3 mb-4">
                  <div className="h-7 w-28 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-44 bg-gray-800/50 rounded animate-pulse" />
                </div>
                <div className="bg-gray-800 h-70 rounded-lg animate-pulse">

                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-3 mb-4">
                    <div className="h-7 w-28 bg-gray-800 rounded animate-pulse" />
                    <div className="h-4 w-44 bg-gray-800/50 rounded animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-30 bg-gray-800 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-7">

              <div className="space-y-3">
                <div className="space-y-3 mb-4">
                  <div className="h-7 w-28 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-44 bg-gray-800/50 rounded animate-pulse" />
                </div>
                <div className="bg-gray-800 h-90 rounded-lg animate-pulse">

                </div>
              </div>
            </div>
          </> : vehicles.length < 1 ? (
            <div className="flex w-full flex-col items-center justify-center min-h-[70vh] m-auto p-8 text-center rounded-2xl shadow-sm col-span-12">
              <div className="flex items-center justify-center w-16 h-16 mb-6 bg-white rounded-full">
                <svg className="w-8 h-8 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
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
            <>
              <div className="col-span-12">
                <EcommerceMetrics bookings={bookings} loading={LoadingBookings || loading} vehicles={vehicles} loadingVehicles={loadingVehicles} />
              </div>

              <div className="col-span-12 xl:col-span-7">
                <MonthlySalesChart bookings={bookings} expenses={expenses} />
              </div>

              <div className="col-span-12 xl:col-span-5">
                <MonthlyTarget bookings={bookings} loadingBookings={LoadingBookings || loading} target={targetMonthly} />
              </div>

              <div className="col-span-12">
                <StatisticsChart />
              </div>

              <div className="col-span-12 xl:col-span-5">
                <DemographicCard />
              </div>

              <div className="col-span-12 xl:col-span-7">
                <RecentOrders bookings={bookings} loading={LoadingBookings || loading} />
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}

export default HomePage
