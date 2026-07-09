"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { useUser } from "./UserContext";
import { fetchVehiclesForAdmin } from "@/app/actions/vehicles";
// import { useBooking } from "./BookingContext";
// import dayjs from "dayjs";

// Define the shape of our context
interface AdminFleetContextType {
  vehicles: any[]; // Replace 'any' with your Vehicle interface
  loading: boolean;
  setVehicles: React.Dispatch<React.SetStateAction<any[]>>;
  updateVehicle: (id: number, updatedVehicle: any) => void;
}

const AdminFleetContext = createContext<AdminFleetContextType | undefined>(undefined);

export const AdminFleetProvider = ({ children }: { children: ReactNode }) => {
  const { profile: adminProfile } = useUser();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!adminProfile) return;

    async function fetchAllVehicles() {
      try {
        const response = await fetchVehiclesForAdmin(adminProfile?.tenant_id);

        if (response.success) {
          setVehicles(response.data);
        } else {
          console.error("API Error fetching vehicles:", response.error);
        }
      } catch (err) {
        console.error("Network connection failure:", err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    }

    fetchAllVehicles();
  }, [adminProfile]);

  // Helper function to update a single vehicle by ID
  const updateVehicle = (id: number, updatedVehicle: any) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? updatedVehicle : v))
    );
  };


  return (
    <AdminFleetContext.Provider value={{ vehicles, loading, setVehicles, updateVehicle }}>
      {children}
    </AdminFleetContext.Provider>
  );
};

// Custom hook for easy access
export const useAdminFleet = () => {
  const context = useContext(AdminFleetContext);
  if (!context) throw new Error("useAdminFleet must be used within a AdminFleetProvider");
  return context;
};