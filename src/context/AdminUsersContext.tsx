// src/context/AdminUsersContext.tsx

"use client";

import { User } from "@/data/globalExports";
import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

// export interface AdminUser {
//   id: string;
//   phone: string;
//   email: string;
//   bio: string | null;
//   first_name: string;
//   last_name: string;
//   role: string | null;
//   profile_pic: string | null;
//   created_at: string;
//   last_seen: string | null;
// }



export interface AdminUsersContextType {
  admins: User[];
  setAdmins: Dispatch<SetStateAction<User[]>>;
  clients: User[];
  setClients: Dispatch<SetStateAction<User[]>>;
  expenses: any[];
  setExpenses: Dispatch<SetStateAction<any[]>>;
  bookings: any[];
  setBookings: Dispatch<SetStateAction<any[]>>;
}

const AdminUsersContext = createContext<
  AdminUsersContextType | undefined
>(undefined);

export interface AdminUsersProviderProps {
  children: ReactNode;
  initialAdmins?: User[];
  initialClients?: User[];
  initialExpenses?: any[];
  initialBookings?: any[];
}

export function AdminUsersProvider({
  children,
  initialAdmins = [],
  initialClients = [],
  initialExpenses = [],
  initialBookings = [],
}: AdminUsersProviderProps) {
  const [admins, setAdmins] = useState<User[]>(initialAdmins);
  const [clients, setClients] = useState<User[]>(initialClients);
  const [expenses, setExpenses] = useState<any[]>(initialExpenses);
  const [bookings, setBookings] = useState<any[]>(initialBookings);

  return (
    <AdminUsersContext.Provider value={{ admins, setAdmins, clients, setClients, expenses, setExpenses, bookings, setBookings }}>
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