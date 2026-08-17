"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useUser } from "./UserContext";
import { fetchVehiclesForTenant } from "@/app/actions/vehicles";

// Define the shape of our context
interface AdminFleetContextType {
  vehicles: any[]; // Replace 'any' with your Vehicle interface
  loading: boolean;
  setVehicles: React.Dispatch<React.SetStateAction<any[]>>;
  updateVehicle: (id: number, updatedVehicle: any) => void;
}

const AdminFleetContext = createContext<AdminFleetContextType | undefined>(
  undefined,
);

interface AdminFleetProviderProps {
  children: ReactNode;
  initialVehicles?: any[]; // Accept pre-fetched vehicles from Server Component layout
}

export const AdminFleetProvider = ({
  children,
  initialVehicles = [],
}: AdminFleetProviderProps) => {
  // If the server provides vehicles, boot up state with them immediately
  const [vehicles, setVehicles] = useState<any[]>(initialVehicles);

  // Set loading to false instantly if vehicles were provided by the server
  const [loading, setLoading] = useState(initialVehicles.length === 0);
  const { profile: adminProfile } = useUser();

  useEffect(() => {
    // If server provided initial data, skip executing the client fetch block
    if (initialVehicles.length > 0) {
      setLoading(false);
      return;
    }

    if (!adminProfile?.tenant_id) return;

    async function fetchAllVehicles() {
      try {
        setLoading(true);
        const response = await fetchVehiclesForTenant(adminProfile.tenant_id);

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
    // Pass primitives (tenant_id string & array length number) to prevent infinite object re-evaluation
  }, [adminProfile?.tenant_id, initialVehicles?.length]);

  // Helper function to update a single vehicle by ID
  const updateVehicle = (id: number, updatedVehicle: any) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? updatedVehicle : v)));
  };

  return (
    <AdminFleetContext.Provider
      value={{ vehicles, loading, setVehicles, updateVehicle }}
    >
      {children}
    </AdminFleetContext.Provider>
  );
};

// Custom hook for easy access
export const useAdminFleet = () => {
  const context = useContext(AdminFleetContext);
  if (!context)
    throw new Error("useAdminFleet must be used within an AdminFleetProvider");
  return context;
};
