import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { AdminProvider } from "@/context/AdminContext";
import { TenantProvider } from "@/context/TenantContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Redis } from '@upstash/redis';
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function AuthSigInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <UserProvider initialUser={serverUser}>
      <AdminProvider>
        <TenantProvider>
          <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <ThemeProvider>
              <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
                {children}
                <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
                  <div className="relative items-center justify-center  flex z-1">
                    {/* <!-- ===== Common Grid Shape Start ===== --> */}
                    <GridShape />
                    <div className="flex flex-col items-center max-w-md">
                      <Link href="/" className="block mb-4">
                        <Image
                          width={231}
                          height={48}
                          src="/images/logo/auth-logo.svg"
                          alt="Logo"
                        />
                      </Link>
                      <p className="text-left text-gray-400 text-sm dark:text-white/60">
                        Get started with our simple but efficient fleet management software. Gives yo an easy way to manage your fleet from 1 to 1000s of vehicles at once.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
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
