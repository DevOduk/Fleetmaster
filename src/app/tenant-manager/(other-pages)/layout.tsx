
// /tenant-manager/(other-pages)/layout.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { SettingsProvider } from '@/context/SettingsContext';
import AppHeader from "@/layout/(dashboard-layout)/AppHeader";
import Backdrop from "@/layout/(admin-layout)/Backdrop";
import AppFooter from "@/layout/(admin-layout)/AppFooter";
import AppSidebar from "@/layout/(dashboard-layout)/AppSidebar";
import { AdminProvider, useAdmin } from "@/context/AdminContext";
import { UserProvider } from "@/context/UserContext";
import { ManagerFleetProvider } from "@/context/ManagerFleetContext";
import { Redis } from '@upstash/redis';
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 1. THE INNER COMPONENT: Safe to call hooks because its parent provides context
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { adminProfile, loading } = useAdmin(); // 🌟 Safe to call now!


  useEffect(() => {
    if (loading) return;
    if (!adminProfile) {
      router.push('/signin');
    }
  }, [adminProfile, router, loading]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="loader-custom"></span>
      </div>
    );
  }

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    !loading && 
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>

        {/* Footer */}
        <AppFooter />
      </div>
    </div>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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
    <SettingsProvider>
      <AdminProvider>
          <UserProvider initialUser={serverUser}>
            <ManagerFleetProvider>
              <AdminLayoutContent>{children}</AdminLayoutContent>
            </ManagerFleetProvider>
          </UserProvider>
      </AdminProvider>
    </SettingsProvider>
  );
}