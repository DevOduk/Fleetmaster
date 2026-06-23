// src/context/TenantContext.tsx
"use client";
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

export function TenantProvider({ children, initialTenant = null }: TenantProviderProps) {
  const [tenant, setTenant] = useState<any | null>(initialTenant);
  const [loading, setLoading] = useState(!initialTenant);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. If tenant is already loaded by server or a previous run, do nothing
    if (tenant) return;

    async function resolveTenantContext() {
      try {
        const hostname = window.location.hostname;
        const parts = hostname.split(".");
        
        let slug = parts.length > 1 ? parts[0] : null;
        if (hostname === "localhost" || parts.includes("fleetmaster")) {
           if (parts.length <= 2) slug = null; 
        }

        // If it's a root domain or global management portal (no tenant slug)
        if (!slug || slug === "app" || slug === "dashboard") {
          setTenant(null);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/tenants/resolve?slug=${slug}`);
        
        // 2. Handle 404 cleanly instead of looping infinitely
        if (!res.ok) {
          console.warn(`Tenant workspace "${slug}" could not be resolved.`);
          setTenant(null); 
          return;
        }
        
        const data = await res.json();
        setTenant(data.tenant);
      } catch (err: any) {
        console.error("Tenant Context resolution error:", err);
        setError(err.message || "An error occurred");
        setTenant(null); // Prevents infinite loop by neutralizing fallback state
      } finally {
        setLoading(false);
      }
    }

    resolveTenantContext();
  }, []); // 🌟 Dropped [tenant] dependency to guarantee execution fires exactly ONCE on mount

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