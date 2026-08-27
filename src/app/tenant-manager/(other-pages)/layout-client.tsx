"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { SettingsProvider } from "@/context/SettingsContext";
import AppHeader from "@/layout/(dashboard-layout)/AppHeader";
import Backdrop from "@/layout/(admin-layout)/Backdrop";
import AppFooter from "@/layout/(admin-layout)/AppFooter";
import AppSidebar from "@/layout/(dashboard-layout)/AppSidebar";
import { AdminProvider, useAdmin } from "@/context/AdminContext";
import { UserProvider } from "@/context/UserContext";
import { ManagerFleetProvider } from "@/context/ManagerFleetContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { adminProfile, loading } = useAdmin();

  useEffect(() => {
    if (loading) return;
    if (!adminProfile) {
      const searchString = searchParams.toString();
      // Rebuild the accurate current page URL dynamically
      const currentPageUrl = encodeURIComponent(
        searchString ? btoa(`${pathname}?${searchString}`) : btoa(pathname),
      );

      router.push(`/signin?r=${currentPageUrl}`);
    }
  }, [adminProfile, pathname, router, searchParams, loading]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
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
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">{children}</div>

        {/* Footer */}
        <AppFooter />
      </div>
    </div>
  );
}

export default function TenantManagerClientLayout({
  children,
  serverUser,
}: {
  children: React.ReactNode;
  serverUser: any;
}) {
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
