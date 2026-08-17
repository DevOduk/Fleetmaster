"use client";
import { fetchAllVehicles, updateVehicleDetails } from "@/app/actions/vehicles";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";

// Define the shape of our context
interface ManagerFleetContextType {
  vehicles: any[]; // Replace 'any' with your Vehicle interface
  loading: boolean;
  setVehicles: React.Dispatch<React.SetStateAction<any[]>>;
  updateVehicle: (id: number, updatedVehicle: any) => void;
}

const ManagerFleetContext = createContext<ManagerFleetContextType | undefined>(
  undefined,
);

export const ManagerFleetProvider = ({ children }: { children: ReactNode }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAll() {
      try {
        const response = await fetchAllVehicles();
        if (response.success) {
          setVehicles(response.data as any[]);
        } else {
          console.error("API Error fetching vehicles:", response.error);
        }
      } catch (err) {
        console.error("Network connection failure:", err);
      } finally {
        setLoading(false);
      }
    }

    getAll();
  }, []);

  // Helper function to update a single vehicle by ID
  const updateVehicle = async (id: number, updatedVehicle: any) => {
    const response = await updateVehicleDetails(id, updatedVehicle);
    if (response.success) {
      setVehicles(response.data as any[]);
    } else {
      console.error("API Error fetching vehicles:", response.error);
    }
    setVehicles((prev) => prev.map((v) => (v.id === id ? updatedVehicle : v)));
  };

  return (
    <ManagerFleetContext.Provider
      value={{ vehicles, loading, setVehicles, updateVehicle }}
    >
      {children}
    </ManagerFleetContext.Provider>
  );
};

// Custom hook for easy access
export const useManagerFleet = () => {
  const context = useContext(ManagerFleetContext);
  if (!context)
    throw new Error(
      "useManagerFleet must be used within a ManagerFleetProvider",
    );
  return context;
};
