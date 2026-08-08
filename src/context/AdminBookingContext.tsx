"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAdminFleet } from "./AdminFleetContext";
import { useUser } from "./UserContext";
import { fetchBookingsForTenant } from "@/app/actions/bookings";

interface AdminBookingContextType {
  bookings: any[];
  loading: boolean;
  setBookings: React.Dispatch<React.SetStateAction<any[]>>;
  updateBooking: (id: number, updatedBooking: Partial<any>) => void;
  reloadBookings: () => void;
  newBooking: (booking: Omit<any, "id" | "date">) => Promise<boolean>; // Returns success flag to forms
}

const AdminBookingContext = createContext<AdminBookingContextType | undefined>(undefined);

export const AdminBookingProvider = ({ children }: { children: ReactNode }) => {
  const { profile: adminProfile } = useUser();
  const { vehicles } = useAdminFleet();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAllBookings() {
    try {
      const response = await fetchBookingsForTenant(adminProfile?.tenant_id);
      if (response.success) {
        setBookings(response.data);
      } else {
        console.error("API Error fetching bookings:", response.error);
      }
    } catch (err) {
      console.error("Network connection failure:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!adminProfile) return;

    fetchAllBookings();
  }, [adminProfile]);

  const reloadBookings = () => {
    fetchAllBookings();
  }

  // 2. Update existing fields cleanly by ID
  const updateBooking = (id: number, updatedFields: Partial<any>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
  };

  // 3. Create a clean, async POST implementation that hooks nicely into UI form states
  const newBooking = async (bookingPayload: Omit<any, "id" | "date">) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (response.ok) {
        // Enforce mapping context to match the unified array structure down-tree
        const matchingVehicle = vehicles.find((v) => v.id === data.vehicleId);
        const hydratedBooking = {
          ...data,
          vehicleDetails: matchingVehicle || null
        };

        setBookings((prev) => [...prev, hydratedBooking]);
        return true; // Success hook for modal closures/toasts
      } else {
        console.error("Failed to create booking on backend:", data.error);
        return false;
      }
    } catch (err) {
      console.error("Booking creation transmission failure:", err);
      return false;
    }
  };

  return (
    <AdminBookingContext.Provider value={{ bookings, loading, setBookings, reloadBookings, updateBooking, newBooking }}>
      {children}
    </AdminBookingContext.Provider>
  );
};

export const useAdminBooking = () => {
  const context = useContext(AdminBookingContext);
  if (!context) throw new Error("useAdminBooking must be used within an Admin BookingProvider");
  return context;
};