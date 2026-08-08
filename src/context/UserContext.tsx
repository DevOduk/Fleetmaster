"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";
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

export function UserProvider({ children, initialUser = null }: { children: React.ReactNode; initialUser: any }) {
  // Populate the profile state with the full server-side profile object immediately
  const [profile, setProfile] = useState<any | null>(initialUser);
  
  // If the server provided full data, turn loading off right away (false).
  // Otherwise, if a token exists but no profile cache was found, set to true to look it up.
  const [loading, setLoading] = useState<boolean>(!initialUser);

  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    // If the server successfully found and passed the full profile data from Redis,
    // skip the redundant client-side network request entirely!
    if (initialUser) {
      setLoading(false);
      return;
    }

    async function checkSession() {
      try {
        setLoading(true);
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
  }, [initialUser]); // Listen to initial data streams safely
console.log('user:', initialUser, profile);
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
        router.push('/');
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
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
