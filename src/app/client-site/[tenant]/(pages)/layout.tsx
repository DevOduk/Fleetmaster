// src/app/(client)/[tenant]/(pages)/layout.tsx
import ClientFooter from "@/layout/(client-layout)/ClientFooter";
import ClientHeader from "@/layout/(client-layout)/ClientHeader";
import { BookingProvider } from "@/context/BookingContext";
import { FleetProvider } from "@/context/FleetContext";
import { TenantProvider } from "@/context/TenantContext";
import { getCachedTenant } from "@/utils/tenant-cache";
import { notFound } from "next/navigation";
import { UserProvider } from "@/context/UserContext";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: tenantSlug } = await params;

  // Instantly fetches from Next.js server-side memory cache
  const tenantData = await getCachedTenant(tenantSlug);

  if (!tenantData) {
    notFound();
  }

  return (
    <TenantProvider>
      <FleetProvider>
        <UserProvider>
          <BookingProvider>
            <div>
              <ClientHeader />

              <main className="flex-1 w-full">
                {children}
              </main>

              <ClientFooter />
            </div>

          </BookingProvider>
        </UserProvider>
      </FleetProvider>
    </TenantProvider>
  );
}