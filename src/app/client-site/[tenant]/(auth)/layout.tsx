import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { AdminProvider } from "@/context/AdminContext";
import { TenantProvider } from "@/context/TenantContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Redis } from "@upstash/redis";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getCachedTenant } from "@/utils/tenant-cache";
import { notFound } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET;
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session");
  let serverUser = null;
  const { tenant: rawSlug } = await params;
  const tenantSlug = rawSlug?.toLowerCase().trim();

  // 1. FETCH TENANT FROM REDIS / SUPABASE
  const tenantData = await getCachedTenant(tenantSlug);

  // 2. STRICT 404: IF TENANT DOES NOT EXIST OR HAS NO DB ID -> 404 PAGE
  if (!tenantData || !tenantData.id) {
    notFound();
  }

  if (sessionCookie) {
    try {
      const decoded = jwt.verify(sessionCookie.value, JWT_SECRET!) as any;
      const targetAccountType = decoded.accountType || decoded.role;
      const normalizedType =
        targetAccountType === "admin" || targetAccountType === "client"
          ? targetAccountType
          : "client";

      // Instantly hit the exact same Redis profile key used by your /api/auth/me route
      const cacheKey = `user:profile:${decoded.id}:${normalizedType}`;
      const cachedProfile = await redis.get(cacheKey);

      if (cachedProfile) {
        serverUser =
          typeof cachedProfile === "string"
            ? JSON.parse(cachedProfile)
            : cachedProfile;
      }
    } catch (e) {
      console.warn(
        "Server layout profile pre-fetch skip or invalid token signature:",
        e,
      );
    }
  }
  return (
    <UserProvider initialUser={serverUser}>
      <AdminProvider>
        <TenantProvider initialTenant={tenantData}>
          <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
            <ThemeProvider>
              <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
                {children}
                <div className="bg-brand-950 hidden h-full w-full items-center lg:grid lg:w-1/2 dark:bg-white/5">
                  <div className="relative z-1 flex items-center justify-center">
                    {/* <!-- ===== Common Grid Shape Start ===== --> */}
                    <GridShape />
                    <div className="flex max-w-md flex-col items-center">
                      <Link href="/" className="mb-4 block">
                        <Image
                          width={231}
                          height={48}
                          src="./images/logo/auth-logo.svg"
                          alt=""
                          sizes="(max-width: 1024px) 50vw, 33vw"
                        />
                      </Link>
                      <p className="text-left text-sm text-gray-400 dark:text-white/60">
                        Get started with our simple but efficient fleet
                        management software. Gives yo an easy way to manage your
                        fleet from 1 to 1000s of vehicles at once.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
                  <ThemeTogglerTwo />
                </div>
              </div>
            </ThemeProvider>
          </div>
        </TenantProvider>
      </AdminProvider>
    </UserProvider>
  );
}
