"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
// import { useBooking } from "./BookingContext";
// import dayjs from "dayjs";

// Define the shape of our context
interface FleetContextType {
  vehicles: any[]; // Replace 'any' with your Vehicle interface
  loading: boolean;
  setVehicles: React.Dispatch<React.SetStateAction<any[]>>;
  updateVehicle: (id: number, updatedVehicle: any) => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export const FleetProvider = ({ children }: { children: ReactNode }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  // const { bookings } = useBooking();


  useEffect(() => {
    async function fetchAllVehicles() {
      try {
        const response = await fetch("/api/vehicles/resolve");
        const data = await response.json();

        if (response.ok) {
          setVehicles(data.vehicles);
        } else {
          console.error("API Error fetching vehicles:", data.error);
        }
      } catch (err) {
        console.error("Network connection failure:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllVehicles();
  }, []);
  // Helper function to update a single vehicle by ID
  const updateVehicle = (id: number, updatedVehicle: any) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? updatedVehicle : v))
    );
  };


  return (
    <FleetContext.Provider value={{ vehicles, loading, setVehicles, updateVehicle }}>
      {children}
    </FleetContext.Provider>
  );
};

// Custom hook for easy access
export const useFleet = () => {
  const context = useContext(FleetContext);
  if (!context) throw new Error("useFleet must be used within a FleetProvider");
  return context;
};