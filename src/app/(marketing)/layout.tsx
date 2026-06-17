"use client";

import React, { use, useEffect } from "react";
import { useRouter } from "next/navigation"; // Fixed import path

import { useSidebar } from "@/context/SidebarContext";
import { SettingsProvider } from '@/context/SettingsContext';

import AppHeader from "@/layout/(dashboard-layout)/AppHeader";
import Backdrop from "@/layout/(admin-layout)/Backdrop";
import AppFooter from "@/layout/(admin-layout)/AppFooter";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import AppSidebar from "@/layout/(dashboard-layout)/AppSidebar";
import { useAdmin } from "@/context/AdminContext";
import MainClientFooter from "@/layout/(marketing-layout)/MainClientFooter";
import MainClientHeader from "@/layout/(marketing-layout)/MainClientHeader";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div>
      <div className="min-h-screen dark:bg-[#080a29]">
        <Backdrop />

        {/* Header */}
        <MainClientHeader />
        {/* add for breakpoint max-w-(--breakpoint-2xl) */}

        {/* Page Content */}
        <div className="w-full min-h-screen client-theme mb-5">
          {children}
        </div>

        {/* Footer  */}
        <MainClientFooter />
      </div>
    </div>
  );
}