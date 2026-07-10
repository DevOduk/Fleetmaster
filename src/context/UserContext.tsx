"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "./ToastContext";
import { applyThemeVariables } from "@/components/ThemeInitializer";

interface UserContextType {
  profile: any | null;
  loading: boolean;
  login: (role: 'client' | 'admin', email: string, password: string, tenant: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setProfile: React.Dispatch<React.SetStateAction<any | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  // On initial load, verify if the user has an active session cookie
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setProfile(data.user);
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (role: 'client' | 'admin', email: string, password: string, tenant: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password, tenant }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        applyThemeVariables(data.user?.fleetmaster_tenants?.color);
        
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: "Network connection failure" };
    }
  };

  const logout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      setProfile(null);

      showToast('You have been logged out successfully!', 'info');
      setTimeout(() => {
        router.push('/')
      }, 3000);
      return { success: true };
    } else {
      return { success: false };
    }
  };

  return (
    <UserContext.Provider value={{ profile, loading, login, logout, setProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};