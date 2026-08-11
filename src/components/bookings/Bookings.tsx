"use client";

import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import Pagination from "../tables/Pagination";
import BookingsTable from "../tables/BookingsTable";
import Link from "next/link";
import { useAdminBooking } from "@/context/AdminBookingContext";
import { ArrowUpIcon, PlusIcon } from "@/icons";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import Badge from "../ui/badge/Badge";
import CachedIcon from "@mui/icons-material/Cached"
import PageBreadcrumb from "../common/PageBreadCrumb";
import { useAdminFleet } from "@/context/AdminFleetContext";


const Bookings: React.FC = () => {
  const { bookings, reloadBookings, loading } = useAdminBooking();
  const { vehicles, loading: loadingVehicles } = useAdminFleet()
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
  if (loading || loadingVehicles) {
    return (

      <div className="space-y-6 animate-pulse min-h-[80vh]">
        {/* Header Card Skeleton */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between py-3 items-center">
            <div className="space-y-3 w-2/3">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-35"></div>
          </div>
        </div>

        {/* Table / Rows Skeleton */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
          <div className="space-y-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (!loadingVehicles && vehicles.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center min-h-[70vh] m-auto p-8 text-center rounded-2xl shadow-sm col-span-12">
        <div className="flex items-center justify-center w-16 h-16 mb-6 bg-white rounded-full">
          <svg className="w-8 h-8 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Add your first vehicle</h2>
        <p className="max-w-md mb-8 text-gray-500 text-sm">
          You're all set up! Start tracking your fleet by adding your first vehicle to the system. It only takes a minute.
        </p>

        <Link href="/vehicles/new"
          className="inline-flex items-center px-6 py-3 text-sm gap-3 font-semibold text-white transition-all bg-brand-600 rounded-lg shadow-lg hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
          <PlusIcon />
          Register New Vehicle
        </Link>
      </div>
    )
  }
  return (
    <div>
      <PageBreadcrumb pageTitle="Bookings" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
          {[
            {
              title: 'Daily Bookings',
              value: totalCountToday,
              description: 'Total Bookings today',
              icon: <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />,
              badge: { text: "9.05%", color: "success" as const, icon: <ArrowUpIcon className="text-success-500" /> },
            },
            {
              title: 'Weekly Bookings',
              value: totalCountThisWeek,
              description: 'Total Bookings this week',
              icon: <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />,
              badge: { text: "9.05%", color: "success" as const, icon: <ArrowUpIcon className="text-success-500" /> },
            },
            {
              title: 'Monthly  Bookings',
              value: totalCountThisMonth,
              description: 'Total Bookings this Month',
              icon: <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />,
              badge: { text: "9.05%", color: "success" as const, icon: <ArrowUpIcon className="text-success-500" /> },
            },
            {
              title: 'Avg. Bookings',
              value: averageDailyThisMonth,
              description: 'Average Daily Bookings for This Month',
              icon: <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />,
              badge: { text: "9.05%", color: "success" as const, icon: <ArrowUpIcon className="text-success-500" /> },
            },
          ].map((p, i) => (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 md:p-6 space-y-3" key={i}>
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
