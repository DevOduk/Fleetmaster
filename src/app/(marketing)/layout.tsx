"use client";

import React, { use, useEffect } from "react";
import Backdrop from "@/layout/(admin-layout)/Backdrop";
import MainClientFooter from "@/layout/(marketing-layout)/MainClientFooter";
import MainClientHeader from "@/layout/(marketing-layout)/MainClientHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="min-h-screen dark:bg-zinc-900">
        <Backdrop />

        {/* Header */}
        <MainClientHeader />
        {/* add for breakpoint max-w-(--breakpoint-2xl) */}

        {/* Page Content */}
        <div className="client-theme mb-5 min-h-screen w-full">{children}</div>

        {/* Footer  */}
        <MainClientFooter />
      </div>
  );
}
