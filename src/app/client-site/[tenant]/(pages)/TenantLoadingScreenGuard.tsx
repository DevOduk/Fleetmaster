"use client"; // 🌟 Safely isolated client context environment

import React from "react";
import { useTenant } from "@/context/TenantContext";

export default function TenantLoadingScreenGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading: tenantLoading } = useTenant();

  // If the tenant workspace data is still loading, block the entire screen right here
  if (tenantLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="loader-custom"></span>
      </div>
    );
  }

  // Once tenant is fully loaded, let everything else show up
  return <>{children}</>;
}
