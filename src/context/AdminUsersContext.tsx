// src/context/AdminUsersContext.tsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export interface AdminUser {
  id: string;
  phone: string;
  email: string;
  bio: string | null;
  first_name: string;
  last_name: string;
  role: string | null;
  profile_pic: string | null;
  created_at: string;
  last_seen: string | null;
}

export interface Client {
  id: string;
  phone: string;
  email: string;
  bio: string | null;
  first_name: string;
  last_name: string;
  role: string | null;
  profile_pic: string | null;
  created_at: string;
  last_seen: string | null;
}

interface AdminUsersContextType {
  admins: AdminUser[];
  setAdmins: Dispatch<SetStateAction<AdminUser[]>>;
  clients: Client[];
  setClients: Dispatch<SetStateAction<Client[]>>;
}

const AdminUsersContext = createContext<
  AdminUsersContextType | undefined
>(undefined);

interface AdminUsersProviderProps {
  children: ReactNode;
  initialAdmins?: AdminUser[];
    initialClients?: Client[];
}

export function AdminUsersProvider({
  children,
  initialAdmins = [],
  initialClients = [],
}: AdminUsersProviderProps) {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [clients, setClients] = useState<Client[]>(initialClients);

  return (
    <AdminUsersContext.Provider value={{ admins, setAdmins, clients, setClients }}>
      {children}
    </AdminUsersContext.Provider>
  );
}

export function useAdminUsers() {
  const context = useContext(AdminUsersContext);

  if (!context) {
    throw new Error(
      "useAdminUsers must be used within an AdminUsersProvider",
    );
  }

  return context;
}