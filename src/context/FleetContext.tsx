"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useTenant } from "./TenantContext";
import { fetchVehiclesForTenant } from "@/app/actions/vehicles";

// Define the shape of our context
interface FleetContextType {
  vehicles: any[]; // Replace 'any' with your Vehicle interface
  loading: boolean;
  setVehicles: React.Dispatch<React.SetStateAction<any[]>>;
  updateVehicle: (id: number, updatedVehicle: any) => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

interface FleetProviderProps {
  children: ReactNode;
  initialVehicles?: any[]; // <-- NEW: Accept pre-fetched vehicles from Server Component layout
}

export const FleetProvider = ({
  children,
  initialVehicles = [],
}: FleetProviderProps) => {
  // If the server provides vehicles, boot up state with them immediately
  const [vehicles, setVehicles] = useState<any[]>(initialVehicles);

  // Set loading to false instantly if vehicles were provided by the server
  const [loading, setLoading] = useState(initialVehicles.length === 0);
  const { tenant } = useTenant();

  useEffect(() => {
    // If server provided initial data, skip executing the client fetch block
    if (initialVehicles.length > 0) {
      setLoading(false);
      return;
    }

    if (!tenant) return;

    async function fetchAllVehicles() {
      try {
        setLoading(true);
        const response = await fetchVehiclesForTenant(tenant?.id);

        if (response.success) {
          setVehicles(response.data);
        } else {
          console.error("API Error fetching vehicles:", response.error);
        }
      } catch (err) {
        console.error("Network connection failure:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllVehicles();
  }, [tenant, initialVehicles]); // Re-run tracker if initial data arrays adjust

  // Helper function to update a single vehicle by ID
  const updateVehicle = (id: number, updatedVehicle: any) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? updatedVehicle : v)));
  };

  return (
    <FleetContext.Provider
      value={{ vehicles, loading, setVehicles, updateVehicle }}
    >
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
