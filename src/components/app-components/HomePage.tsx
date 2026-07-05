"use client"
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { useUser } from '@/context/UserContext';
import { useMemo } from "react";
import { useAdminFleet } from "@/context/AdminFleetContext";
import { useAdminBooking } from "@/context/AdminBookingContext";
import ExpiryBanner from "../company-profile/ExpiryBanner";


function HomePage() {
  const { profile } = useUser();
  const { bookings, loading } = useAdminBooking();
  const { vehicles, loading: loadingVehicles } = useAdminFleet();

  return (
    <div>
      <ExpiryBanner plan={profile?.fleetmaster_tenants?.subscription_plan} expiryDate={profile?.fleetmaster_tenants?.expiry_date} />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <EcommerceMetrics bookings={bookings} loading={loading} vehicles={vehicles} loadingVehicles={loadingVehicles} />

        </div>
        <div className="col-span-12 xl:col-span-7">
          <MonthlySalesChart />
        </div>


        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders bookings={bookings} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default HomePage
