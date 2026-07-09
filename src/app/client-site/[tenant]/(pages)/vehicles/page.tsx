// src/app/(client)/[tenant]/(pages)/vehicles/page.tsx
import ClientVehiclesPage from "@/components/client-components/Vehicles/ClientVehiclesPage";
import { getCachedTenant } from "@/utils/tenant-cache";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ tenant: string }>;
}

// 1. Dynamic Server-Side Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenant: tenantSlug } = await params;
  const tenantData = await getCachedTenant(tenantSlug);
  
  // Format the name nicely (e.g., "Oduk")
  const tenantName = tenantData?.name 
    ? tenantData.name.charAt(0).toUpperCase() + tenantData.name.slice(1)
    : "FleetMaster";

  return {
    title: `Find Rental Vehicles in Nairobi | ${tenantName}`,
    description: `Explore our absolute best vehicle rental fleet at ${tenantName} across Nairobi. Real-time booking tracking and premium operations optimization powered by FleetMaster.`,
  };
}

// 2. Clear, Zero-Error Server Component Root Page
export default function Page() {
  return <ClientVehiclesPage />;
}