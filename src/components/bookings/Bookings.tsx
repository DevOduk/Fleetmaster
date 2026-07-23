"use client";
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import Pagination from "../tables/Pagination";
import BookingsTable from "../tables/BookingsTable";
import Link from "next/link";
import { useAdminBooking } from "@/context/AdminBookingContext";
import { ArrowUpIcon } from "@/icons";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import Badge from "../ui/badge/Badge";
import CachedIcon from "@mui/icons-material/Cached"


const Bookings: React.FC = () => {
  const { bookings, reloadBookings } = useAdminBooking();
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

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.getDate(); // 1-31

  // 1. Daily Bookings (Today)
  const totalCountToday = bookings?.filter(b => {
    const d = new Date(b.created_at);
    return d.getDate() === today && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length || 0;

  // 2. Weekly Bookings (Current week, assuming Monday start)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
  startOfWeek.setHours(0, 0, 0, 0);

  const totalCountThisWeek = bookings?.filter(b => {
    const d = new Date(b.created_at);
    return d >= startOfWeek;
  }).length || 0;

  // 3. Monthly Bookings
  const totalCountThisMonth = bookings?.filter(b => {
    const d = new Date(b.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length || 0;

  // 4. Average Daily Bookings (This month)
  // Formula: Total monthly bookings / Days passed so far this month
  const averageDailyThisMonth = today > 0 ? (totalCountThisMonth / today).toFixed(1) : 0;

  return (
    <div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
          {[
            {
              title: 'Daily Bookings',
              currency: 'Ksh',
              value: totalCountToday,
              description: 'Total Bookings today',
              icon: <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />,
              badge: { text: "9.05%", color: "success" as const, icon: <ArrowUpIcon className="text-success-500" /> },
            },
            {
              title: 'Weekly Bookings',
              currency: 'Ksh',
              value: totalCountThisWeek,
              description: 'Total Bookings this week',
              icon: <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />,
              badge: { text: "9.05%", color: "success" as const, icon: <ArrowUpIcon className="text-success-500" /> },
            },
            {
              title: 'Monthly  Bookings',
              currency: 'Ksh',
              value: totalCountThisMonth,
              description: 'Total Bookings this Month',
              icon: <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />,
              badge: { text: "9.05%", color: "success" as const, icon: <ArrowUpIcon className="text-success-500" /> },
            },
            {
              title: 'Average Bookings (This Month)',
              currency: 'Ksh',
              value: averageDailyThisMonth,
              description: 'Average Daily Bookings for This Month',
              icon: <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />,
              badge: { text: "9.05%", color: "success" as const, icon: <ArrowUpIcon className="text-success-500" /> },
            },
          ].map((p, i) => (
              <div className="rounded-2xl border border-gray-200 bg-brand-500/5 p-5 dark:border-gray-800 md:p-6 space-y-3" key={i}>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-300">
                  {p.title}
                </span>
                <div className="flex mt-2 items-center justify-between">
                  <h4 className="font-bold text-gray-800 text-2xl dark:text-white/90">
                    {p.value} +
                  </h4>
                  <Badge color={p.badge.color}>
                    {p.badge.icon}
                    {p.badge.text}
                  </Badge>
                </div>
                <div className="text-xs truncate text-gray-500 dark:text-gray-400">
                  {p.description}
                </div>
              </div>
          ))}
        </div>
        <div className="flex justify-between py-3 items-center">
          <div>
            <p className="font-medium text-gray-800 mb-2 text-theme-sm dark:text-white/90">View all bookings and manage them. Click Create New Booking to add a new booking.</p>
            <span className="text-gray-500 text-start text-theme-sm dark:text-gray-400">{bookings?.length || 0} Bookings | {bookings?.filter((b: any) => b.booking_status === "Active").length || 0} Active | {averageDailyThisMonth} Average per Day</span>
          </div>
          <div className="flex items-center gap-3">
            
      <button onClick={() => reloadBookings()}
        className="flex ms-auto gap-3 items-center rounded-lg justify-center p-2 px-3 font-medium text-gray-500 bg-gray-800 text-theme-sm hover:bg-gray-800/70"
      >
        <CachedIcon /> Sync now
      </button>
            
            <Link href="/bookings/new">
              <button
                className="flex items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
              >
                Create New Booking
              </button>
            </Link>
          </div>
        </div>
        <BookingsTable />
        <Pagination onPageChange={() => 2} currentPage={1} totalPages={1} />
      </div>
    </div>
  );
};

export default Bookings;
