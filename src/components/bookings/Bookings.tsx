"use client";
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ComponentCard from "../common/ComponentCard";
import Pagination from "../tables/Pagination";
import VehiclesTable from "../tables/VehiclesTable";
import BookingsTable from "../tables/BookingsTable";
import { bookings } from "@/data/mockFleetData";
import Link from "next/link";

const Bookings: React.FC = () => {
  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  // Apply dark mode styles to leaflet
  useEffect(() => {
    const handleModeChange = () => {
      const tiles = document.querySelectorAll(".leaflet-tile");
      tiles.forEach((tile) => {
        const img = tile as HTMLImageElement;
        if (isDarkMode) {
          img.style.filter = "invert(0.93) hue-rotate(180deg) saturate(0.9)";
        } else {
          img.style.filter = "none";
        }
      });
    };

    const observer = new MutationObserver(handleModeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    handleModeChange();
    return () => observer.disconnect();
  }, [isDarkMode]);

  return (
    <div>

      <div className="space-y-6">
        <ComponentCard title="All Bookings">
          <div className="flex justify-between py-3 items-center">
            <div>
              <p className="font-medium text-gray-800 mb-2 text-theme-sm dark:text-white/90">View all bookings and manage them. Click Create New Booking to add a new booking.</p>
              <span className="text-gray-500 text-start text-theme-sm dark:text-gray-400">{bookings?.length || 0} Bookings | {bookings?.filter((b: any) => b.status === "Active").length || 0} Active | 7 Average per Day</span>
            </div>
            <Link href="/bookings/new">
              <button
                className="flex items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
              >
                Create New Booking
              </button>
            </Link>
          </div>
          <BookingsTable />
          <Pagination onPageChange={() => 2} currentPage={1} totalPages={1} />
        </ComponentCard>
      </div>
    </div>
  );
};

export default Bookings;
