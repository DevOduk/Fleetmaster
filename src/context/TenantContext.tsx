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
  initialTenant?: any | null; // Optional prop to inject pre-cached server data
}

export function TenantProvider({ children, initialTenant = null }: TenantProviderProps) {
  // 1. Initialize state instantly if the Server Layout supplied the cached data
  const [tenant, setTenant] = useState<any | null>(initialTenant);
  const [loading, setLoading] = useState(!initialTenant); // false if initialized, true if it needs fetching
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 2. Short-circuit if the data was already populated by the server layout
    if (tenant) return;

    async function resolveTenantContext() {
      try {
        const hostname = window.location.hostname;
        const parts = hostname.split(".");
        
        // Handle local testing environments safely
        let slug = parts.length > 1 ? parts[0] : null;
        if (hostname === "localhost" || parts.includes("fleetmaster")) {
           if (parts.length <= 2) slug = null; 
        }

        if (!slug) {
          setLoading(false);
          return;
        }

        // Fetch fallback metadata from the edge-cached endpoint
        const res = await fetch(`/api/tenants/resolve?slug=${slug}`);
        if (!res.ok) throw new Error("Failed to resolve tenant workspace configuration");
        
        const data = await res.json();
        setTenant(data.tenant);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    resolveTenantContext();
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