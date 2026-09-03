"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Booking } from "@/data/mockFleetData";
import { useFleet } from "./FleetContext";
import { fetchBookingsForTenant } from "@/app/actions/bookings";
import { useTenant } from "./TenantContext";


interface BookingContextType {
  bookings: any[];
  loading: boolean;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  updateBooking: (id: number, updatedBooking: Partial<Booking>) => void;
  newBooking: (booking: Omit<Booking, "id" | "date">) => Promise<boolean>; // Returns success flag to forms
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const { vehicles } = useFleet();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { tenant } = useTenant();

  useEffect(() => {
    if (!tenant) return;

    async function fetchAllBookings() {
      try {
        const response = await fetchBookingsForTenant(tenant?.id);

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

    fetchAllBookings();
  }, [tenant]);
  // 2. Update existing fields cleanly by ID
  const updateBooking = (id: number, updatedFields: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b)),
    );
  };

  // 3. Create a clean, async POST implementation that hooks nicely into UI form states
  const newBooking = async (bookingPayload: Omit<Booking, "id" | "date">) => {
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
          vehicleDetails: matchingVehicle || null,
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
    <BookingContext.Provider
      value={{ bookings, loading, setBookings, updateBooking, newBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context)
    throw new Error("useBooking must be used within a BookingProvider");
  return context;
};
