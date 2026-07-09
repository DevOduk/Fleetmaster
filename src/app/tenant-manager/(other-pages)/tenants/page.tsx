// app/(admin)/page.tsx
import type { Metadata } from "next";
import { TenantsMetrics } from "@/components/dashboard-components/TenantsMetrics";
import TenantsView from "@/components/dashboard-components/TenantsView";
import { createClient } from "@/utils/supabase/server";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getAllTenants } from "@/app/actions/tenant";

export const metadata: Metadata = {
  title:
    "FleetManager Admin Dashboard - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};


export default async function Home() {
  const tenants = await getAllTenants();  

  return (
    <div className="space-y-7">
      <PageBreadcrumb pageTitle="Manage Tenants" />

      <TenantsMetrics tenants={tenants} />

      <TenantsView initialTenants={tenants} />
    </div>
  );
}
