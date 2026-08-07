import { cookies, headers } from 'next/headers';

import ClientFooter from "@/layout/(client-layout)/ClientFooter";
import ClientHeader from "@/layout/(client-layout)/ClientHeader";
import { BookingProvider } from "@/context/BookingContext";
import { FleetProvider } from "@/context/FleetContext";
import { TenantProvider } from "@/context/TenantContext";
import { notFound } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import { ToastProvider } from "@/context/ToastContext";
import TenantLoadingScreenGuard from "./TenantLoadingScreenGuard";
import { fetchVehiclesForTenant } from '@/app/actions/vehicles';
import { Redis } from '@upstash/redis';
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});



export default async function TenantLayout({
  children,
  // params,
}: {
  children: React.ReactNode;
  // params: Promise<{ tenant: string }>;
}) {
  // const { tenant: tenantSlug } = await params;
  const headerList = await headers();

  // Captures the header data injected by your rewritten proxy
  const tenantId = headerList.get('x-tenant-id');
  const tenantDataRaw = headerList.get('x-tenant-data');

  if (!tenantId || !tenantDataRaw) {
    // Fail-safe: If headers are missing, your proxy didn't find the tenant
    notFound();
  }
  // 1. Resolve tenant details instantly on the server
  const tenantData = JSON.parse(tenantDataRaw);

  if (!tenantData) {
    notFound();
  }

  // 2. Fetch vehicles on the server using the resolved tenant ID
  // This uses your Redis-wrapped cache function to finish in milliseconds
  const { data: initialVehicles } = await fetchVehiclesForTenant(tenantId);

  // 2. NEW: PRE-RESOLVE THE USER SESSION ON THE SERVER
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session");
  let serverUser = null;

  if (sessionCookie) {
    try {
      const decoded = jwt.verify(sessionCookie.value, JWT_SECRET!) as any;
      const targetAccountType = decoded.accountType || decoded.role;
      const normalizedType = targetAccountType === "admin" || targetAccountType === "client" ? targetAccountType : "client";

      // Instantly hit the exact same Redis profile key used by your /api/auth/me route
      const cacheKey = `user:profile:${decoded.id}:${normalizedType}`;
      const cachedProfile = await redis.get(cacheKey);

      if (cachedProfile) {
        serverUser = typeof cachedProfile === "string" ? JSON.parse(cachedProfile) : cachedProfile;
      }
    } catch (e) {
      console.warn("Server layout profile pre-fetch skip or invalid token signature:", e);
    }
  }

  return (
    <ToastProvider>
      <TenantProvider initialTenant={tenantData}>
        <FleetProvider initialVehicles={initialVehicles || []}>
          <UserProvider initialUser={serverUser}>
            <BookingProvider>

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
