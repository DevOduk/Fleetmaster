"use client";

import { applyThemeVariables } from "@/components/ThemeInitializer";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AdminContextType {
  adminProfile: any | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    error?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    id?: string;
    is_otp: boolean;
  }>;
  logout: () => void;
  setAdminProfile: React.Dispatch<React.SetStateAction<any | null>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [adminProfile, setAdminProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apply when profile is loaded
    if (adminProfile?.fleetmaster_tenants?.color) {
      applyThemeVariables(adminProfile?.fleetmaster_tenants?.color);
      localStorage.setItem(
        "brand-color",
        adminProfile?.fleetmaster_tenants?.color,
      );
    }
  }, [adminProfile]);

  // On initial load, verify if the user has an active session cookie
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/admin/me");
        if (response.ok) {
          const data = await response.json();
          setAdminProfile(data.user);
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAdminProfile(data.user);
        return {
          success: true,
          emailVerified: data.user?.verification_status?.email ?? false,
          phoneVerified: data.user?.phone_verified ?? false,
          id: data.user?.id,
          is_otp: data.user?.is_otp ?? false,
        };
      } else {
        return {
          success: false,
          error: data.error,
          emailVerified: false,
          phoneVerified: false,
          id: undefined,
          is_otp: false,
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err,
        emailVerified: false,
        phoneVerified: false,
        id: undefined,
        is_otp: false,
      };
    }
  };

  const logout = async () => {
    await fetch("/api/auth/admin/logout", { method: "POST" });
    setAdminProfile(null);
  };

  return (
    <AdminContext.Provider
      value={{ adminProfile, loading, login, logout, setAdminProfile }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within a AdminProvider");
  return context;
};
