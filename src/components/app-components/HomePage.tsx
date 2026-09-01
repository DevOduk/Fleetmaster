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
        {!loadingVehicles && vehicles.length === 0 ? (
          <div className="col-span-12 m-auto flex min-h-[70vh] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/40 p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
              <svg
                className="h-8 w-8"
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
            <p className="mb-8 max-w-md text-sm text-gray-500 dark:text-gray-400">
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
              <MonthlySalesChart bookings={bookings} expenses={expenses} loading={LoadingBookings || loading} />

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
