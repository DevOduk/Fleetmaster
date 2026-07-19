"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/(admin-layout)/AppHeader";
import AppSidebar from "@/layout/(admin-layout)/AppSidebar";
import Backdrop from "@/layout/(admin-layout)/Backdrop";
import AppFooter from "@/layout/(admin-layout)/AppFooter";
import { Toaster } from 'sonner';
import { useSettings } from "@/context/SettingsContext";
import { useUser } from "@/context/UserContext";
import CompanySubscriptionsCard from "@/components/company-profile/CompanySubscriptionsCard";

function ToasterWrapper() {
  const { position } = useSettings();
  return <Toaster position={position || "top-right"} />;
}

export default function OthersPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { profile, loading } = useUser();
  const router = useRouter();

  // Domain-aware multi-tenant routing controller
  const executeAbsoluteAuthRedirect = () => {
    if (typeof window === "undefined") return;

    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : "";

    // A. Localhost Subdomain Path Resolution (e.g., app.localhost:3000)
    if (hostname.includes("localhost") && hostname.startsWith("app.")) {
      window.location.href = `${protocol}//app.localhost${port}/signin`;
      return;
    }

    // B. Vercel Staging/Trial Path Rules (Bypasses relative root routes)
    if (hostname.includes("vercel.app")) {
      window.location.href = `${protocol}//${hostname}${port}/admin-site/signin`;
      return;
    }

    // C. Production Custom Domain Multi-tenant Fallback Layout (e.g., app.fleetmaster.co.ke)
    if (!hostname.startsWith("app.") && !hostname.startsWith("dashboard.") && hostname !== "localhost") {
      window.location.href = `${protocol}//app.${hostname}${port}/signin`;
      return;
    }
    // Standard absolute fallback string execution path
    router.replace('/signin');
  };

  useEffect(() => {
    if (loading) return;
    if (window.location.href.includes('/register')) return;

    if (!profile) {
      executeAbsoluteAuthRedirect();
    }
  }, [profile, router, loading]);

  // 1. Phase A: App is actively pulling session context over the network
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <span className="loader-custom"></span>
      </div>
    );
  }

  // 2. Phase B: Hard Guard. Loading finished, profile is missing, and page is redirecting.
  // Returning null here stops the dashboard shell below from ever leaking onto the viewport.
  if (!profile) {
    return null;
  }
  if (profile?.role === 'Client') {
    // Standard absolute fallback string execution path

    router.replace('/signin');
    return null;
  }

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  // 3. Phase C: Full Authorization Success

  return (
    <>
      <ToasterWrapper />
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
            {
              profile?.fleetmaster_tenants?.subscription_status === 'Expired' ? <CompanySubscriptionsCard /> : (children)
            }
          </div>

          {/* Footer */}
          <AppFooter />
        </div>
      </div>
    </>
  );
}