// app/(admin)/layout.tsx
import { SettingsProvider } from "@/context/SettingsContext";
import { UserProvider } from "@/context/UserContext";
import { SidebarProvider } from "@/context/SidebarContext";
import React from "react";
import { AdminFleetProvider } from "@/context/AdminFleetContext";
import { AdminBookingProvider } from "@/context/AdminBookingContext";
import { cookies } from "next/headers";
import { Redis } from '@upstash/redis';
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function RootAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {  const cookieStore = await cookies();
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
            <SettingsProvider>
                <AdminFleetProvider>
                    <AdminBookingProvider>
                        <SidebarProvider>
                            {/* No UI elements here, just raw children */}
                            {children}
                        </SidebarProvider>
                    </AdminBookingProvider>
                </AdminFleetProvider>
            </SettingsProvider>
        </UserProvider>
    );
}