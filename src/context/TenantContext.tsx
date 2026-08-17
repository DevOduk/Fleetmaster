"use client";

import { applyThemeVariables } from "@/components/ThemeInitializer";
import React, { createContext, useContext, useState, useEffect } from "react";

interface TenantContextType {
  tenant: any | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: React.ReactNode;
  initialTenant?: any | null;
}

export function TenantProvider({
  children,
  initialTenant = null,
}: TenantProviderProps) {
  const [tenant, setTenant] = useState<any | null>(initialTenant);
  const [loading, setLoading] = useState(!initialTenant);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTenant) {
      setTenant(initialTenant);
      setLoading(false);
    }
  }, [initialTenant]);

  useEffect(() => {
    if (tenant?.color) {
      applyThemeVariables(tenant.color);
      localStorage.setItem("brand-color", tenant.color);
    }
  }, [tenant]);

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
