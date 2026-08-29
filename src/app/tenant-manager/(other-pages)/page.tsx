// app/(admin)/page.tsx

import type { Metadata } from "next";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { EcommerceMetrics } from "@/components/dashboard-components/EcommerceMetrics";
import RecentVehiscles from "@/components/dashboard-components/RecentVehicles";
import { getAllTenants } from "@/app/actions/tenant";
import DemographicCard from "@/components/dashboard-components/ecommerce/DemographicCard";
import { fetchAllSubscriptionPayments } from "@/app/actions/payments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home | FleetMaster Dashboard - Best tool for Fleet Management",
  description:
    "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default async function Home() {
  const tenants = await getAllTenants();
  const payments = await fetchAllSubscriptionPayments();

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <EcommerceMetrics tenants={tenants} payments={payments} />
      </div>

      <div className="col-span-12">
        <StatisticsChart loadingBookings={false} expenses={[]} bookings={[]} target={700000} />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard tenants={tenants} />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentVehiscles />
      </div>
    </div>
  );
}
