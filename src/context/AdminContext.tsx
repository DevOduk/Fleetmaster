"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AdminContextType {
  adminProfile: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setAdminProfile: React.Dispatch<React.SetStateAction<any | null>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [adminProfile, setAdminProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

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
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: "Network connection failure" };
    }
  };

  const logout = async () => {
    await fetch("/api/auth/admin/logout", { method: "POST" });
    setAdminProfile(null);
  };

  return (
    <AdminContext.Provider value={{ adminProfile, loading, login, logout, setAdminProfile }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within a AdminProvider");
  return context;
};