"use client";

// app/(admin)/(other-pages)/layout.tsx
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

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      router.push('/signin');
      return;
    }
  }, [profile, router, loading]);

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
    </>
  );
}