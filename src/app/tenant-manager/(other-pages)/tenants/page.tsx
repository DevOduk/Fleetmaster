// app/(admin)/page.tsx
import type { Metadata } from "next";
import { TenantsMetrics } from "@/components/dashboard-components/TenantsMetrics";
import TenantsView from "@/components/dashboard-components/TenantsView";
import { createClient } from "@/utils/supabase/server";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title:
    "FleetManager Admin Dashboard - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};


async function getTenants() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('fleetmaster_tenants')
      .select('id, slug, name, phone, about, email, country, county, yards, timezone, tenant_logo, subscription_status, created_at, expiry_date');

    if (error) {
      console.error("Supabase Error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Failed to fetch tenants:", err);
    return [];
  }
}

export default async function Home() {
  const tenants = await getTenants();

  return (
    <div className="space-y-7">
      <PageBreadcrumb pageTitle="Manage Tenants" />

      <TenantsMetrics tenants={tenants} />

      <TenantsView initialTenants={tenants} />
    </div>
  );
}
