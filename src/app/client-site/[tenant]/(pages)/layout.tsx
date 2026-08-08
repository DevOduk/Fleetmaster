import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import ClientFooter from "@/layout/(client-layout)/ClientFooter";
import ClientHeader from "@/layout/(client-layout)/ClientHeader";
import { BookingProvider } from "@/context/BookingContext";
import { FleetProvider } from "@/context/FleetContext";
import { TenantProvider } from "@/context/TenantContext";
import { UserProvider } from "@/context/UserContext";
import { ToastProvider } from "@/context/ToastContext";
import TenantLoadingScreenGuard from "./TenantLoadingScreenGuard";
import { fetchVehiclesForTenant } from '@/app/actions/vehicles';
import { getCachedTenant } from "@/utils/tenant-cache";
import { Redis } from '@upstash/redis';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: rawSlug } = await params;
  const tenantSlug = rawSlug?.toLowerCase().trim();

  // 1. FETCH TENANT FROM REDIS / SUPABASE
  const tenantData = await getCachedTenant(tenantSlug);

  // 2. STRICT 404: IF TENANT DOES NOT EXIST OR HAS NO DB ID -> 404 PAGE
  if (!tenantData || !tenantData.id) {
    notFound();
  }

  // 3. FETCH VEHICLES
  let initialVehicles: any[] = [];
  try {
    const vehicleRes = await fetchVehiclesForTenant(tenantData.id);
    initialVehicles = vehicleRes?.data || [];
  } catch (err) {
    console.error("Failed pre-fetching vehicles in TenantLayout:", err);
  }

  // 4. PRE-RESOLVE USER SESSION
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session");
  let serverUser = null;

  if (sessionCookie && JWT_SECRET && redis) {
    try {
      const decoded = jwt.verify(sessionCookie.value, JWT_SECRET) as any;
      const targetAccountType = decoded.accountType || decoded.role;
      const normalizedType = targetAccountType === "admin" || targetAccountType === "client" ? targetAccountType : "client";

      const cacheKey = `user:profile:${decoded.id}:${normalizedType}`;
      const cachedProfile = await redis.get(cacheKey);

      if (cachedProfile) {
        serverUser = typeof cachedProfile === "string" ? JSON.parse(cachedProfile) : cachedProfile;
      }
    } catch (e) {
      console.warn("Server layout profile pre-fetch skipped:", e);
    }
  }

  return (
    <ToastProvider>
      <TenantProvider initialTenant={tenantData}>
        <FleetProvider initialVehicles={initialVehicles}>
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