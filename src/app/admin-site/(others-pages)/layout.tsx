"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/(admin-layout)/AppHeader";
import AppSidebar from "@/layout/(admin-layout)/AppSidebar";
import Backdrop from "@/layout/(admin-layout)/Backdrop";
import AppFooter from "@/layout/(admin-layout)/AppFooter";
import { Toaster } from 'sonner';
import { useSettings } from "@/context/SettingsContext";
import { useUser } from "@/context/UserContext";
import DashboardSkeleton from "@/components/DashboardSkeleton";

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

  // State to track if we've explicitly checked for the local storage token
  const [hasCheckedToken, setHasCheckedToken] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // 1. Synchronous Token Check on Mount
    // Adjust "token" to match whatever key you store your JWT under (e.g., "sb-access-token", "jwt")
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (!token) {
      // No token at all? Kick them out instantly before any async API loads
      router.replace('/signin');
    } else {
      setHasToken(true);
      setHasCheckedToken(true);
    }
  }, [router]);

  // 2. Secondary Safety: If the API finishes loading and explicitly finds the token is invalid/expired
  useEffect(() => {
    if (hasCheckedToken && !loading && !profile) {
      router.replace('/signin');
    }
  }, [profile, loading, hasCheckedToken, router]);

  // --- RENDERING STRATEGY ---

  // Phase A: Split-second window where we don't even know if a token exists in storage yet
  if (!hasCheckedToken) {
    return null; // absolute blank slate to prevent any asset flash
  }

  // Phase B: Token exists, but profile state is still pulling the user data from the database
  if (loading && hasToken) {
    return (
      <div className="min-h-screen xl:flex">
        <AppSidebar />
        <Backdrop />
        <div className={`flex-1 transition-all duration-300 ease-in-out ${
          isMobileOpen ? "ml-0" : isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        }`}>
          <AppHeader />
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            <DashboardSkeleton loading={loading} />
          </div>
          <AppFooter />
        </div>
      </div>
    );
  }

  // Phase C: If the token was a dummy/expired and API completely finished returning null
  if (!profile) {
    return null; 
  }

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  // Phase D: Full Authorization Success
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