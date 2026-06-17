"use client";

// app/(admin)/layout.tsx
import React, { use, useEffect } from "react";
import { useRouter } from "next/navigation";

import { FleetProvider } from "@/context/FleetContext";
import { UserProvider, useUser } from "@/context/UserContext";
import { useSidebar } from "@/context/SidebarContext";
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { BookingProvider } from "@/context/BookingContext";

import AppHeader from "@/layout/(admin-layout)/AppHeader";
import AppSidebar from "@/layout/(admin-layout)/AppSidebar";
import Backdrop from "@/layout/(admin-layout)/Backdrop";
import AppFooter from "@/layout/(admin-layout)/AppFooter";
import { Toaster } from 'sonner';
import DashboardSkeleton from "@/components/DashboardSkeleton";

function ToasterWrapper() {
  const { position } = useSettings();
  return <Toaster position={position} />;
}

// 1. INNER COMPONENT: Safe to consume all contexts wrapped by the providers below
function AdminLayoutContent({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  // Unwrap the params promise using React's `use` hook safely
  const { tenant } = use(params);

  // Consume your contexts safely inside the boundary layout now!
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { profile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (tenant) return;
    if (!profile) {
      router.push('/signin');
    }
  }, [tenant, profile, router, loading]);

  if (loading || (!tenant && !profile)) {
    return <DashboardSkeleton />;
  }

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <>
      <ToasterWrapper />
      <div className="min-h-screen xl:flex">
        {/* Sidebar and Backdrop */}
        <AppSidebar />
        <Backdrop />

        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader />

          {/* Page Content */}
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {children}
          </div>

          {/* Footer  */}
          <AppFooter />
        </div>
      </div>
    </>
  );
}

// 2. ROOT LAYOUT EXPORT: Establishes context scope first
export default function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  return (
    <UserProvider>
      <SettingsProvider>
        <FleetProvider>
          <BookingProvider>
            <AdminLayoutContent params={params}>
              {children}
            </AdminLayoutContent>
          </BookingProvider>
        </FleetProvider>
      </SettingsProvider>
    </UserProvider>
  );
}