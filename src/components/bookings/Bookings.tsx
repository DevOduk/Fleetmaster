"use client";
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ComponentCard from "../common/ComponentCard";
import Pagination from "../tables/Pagination";
import BookingsTable from "../tables/BookingsTable";
import Link from "next/link";
import { useBooking } from "@/context/BookingContext";

const Bookings: React.FC = () => {
  const { bookings } = useBooking();
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
          {[
            {
              title: 'Daily Bookings',
              currency: 'Ksh',
              value: 55,
              description: 'Total Bookings today',
            },
            {
              title: 'Weekly Bookings',
              currency: 'Ksh',
              value: 125,
              description: 'Total Bookings this week',
            },
            {
              title: 'Monthly  Bookings',
              currency: 'Ksh',
              value: 700,
              description: 'Total Bookings this Month',
            },
            {
              title: 'Average Bookings (This Month)',
              currency: 'Ksh',
              value: 93,
              description: 'Average Daily Bookings for This Month',
            },
          ].map((p, i) => (
            <div className="rounded-2xl border border-gray-200 bg-brand-500/5 p-5 dark:border-gray-800 md:p-6" key={i}>
              <h4 className="text-md text-black dark:text-white">
                {p?.title}
              </h4>
              <h2 className="text-2xl mt-3 mb-2 dark:text-gray-300 text-gray-600 font-bold">{p?.value ? Number(p.value).toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : "0"}</h2>
              <p className="text-gray-500 text-sm">
                {p?.description}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between py-3 items-center">
          <div>
            <p className="font-medium text-gray-800 mb-2 text-theme-sm dark:text-white/90">View all bookings and manage them. Click Create New Booking to add a new booking.</p>
            <span className="text-gray-500 text-start text-theme-sm dark:text-gray-400">{bookings?.length || 0} Bookings | {bookings?.filter((b: any) => b.status === "Active").length || 0} Active | 93 Average per Day</span>
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
      </div>
    </div>
  );
};

export default Bookings;
