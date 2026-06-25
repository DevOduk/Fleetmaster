// ❌ DO NOT ADD "use client" HERE! Keep this as a Server Component.

import ClientFooter from "@/layout/(client-layout)/ClientFooter";
import ClientHeader from "@/layout/(client-layout)/ClientHeader";
import { BookingProvider } from "@/context/BookingContext";
import { FleetProvider } from "@/context/FleetContext";
import { TenantProvider } from "@/context/TenantContext";
import { getCachedTenant } from "@/utils/tenant-cache";
import { notFound } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import { ToastProvider } from "@/context/ToastContext";
import TenantLoadingScreenGuard from "./TenantLoadingScreenGuard"; // We will create this next

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: tenantSlug } = await params;

  // Instantly fetches from Next.js server-side memory cache safely
  const tenantData = await getCachedTenant(tenantSlug);

  if (!tenantData) {
    notFound();
  }

  return (
    <ToastProvider>
      <TenantProvider initialTenant={tenantData}>
        <FleetProvider>
          <UserProvider>
            <BookingProvider>
              
              {/* Wrap the layout elements inside our new isolated client boundary */}
              <TenantLoadingScreenGuard>
                <div>
                  <ClientHeader />

                  <main className="flex-1 w-full">
                    {children}
                  </main>

                  <ClientFooter />
                </div>
              </TenantLoadingScreenGuard>

            </BookingProvider>
          </UserProvider>
        </FleetProvider>
      </TenantProvider>
    </ToastProvider>
  );
}