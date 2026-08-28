"use client";

import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import BookingsTable from "../tables/BookingsTable";
import Link from "next/link";
import { useAdminBooking } from "@/context/AdminBookingContext";
import { ArrowUpIcon, PlusIcon } from "@/icons";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import Badge from "../ui/badge/Badge";
import CachedIcon from "@mui/icons-material/Cached";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { useAdminFleet } from "@/context/AdminFleetContext";

const Bookings: React.FC = () => {
  const { bookings, reloadBookings, loading } = useAdminBooking();
  const { vehicles, loading: loadingVehicles } = useAdminFleet();
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
  const totalCountToday =
    bookings?.filter((b) => {
      const d = new Date(b.created_at);
      return (
        d.getDate() === today &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    }).length || 0;

  // 2. Weekly Bookings (Current week, assuming Monday start)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(
    now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1),
  );
  startOfWeek.setHours(0, 0, 0, 0);

  const totalCountThisWeek =
    bookings?.filter((b) => {
      const d = new Date(b.created_at);
      return d >= startOfWeek;
    }).length || 0;

  // 3. Monthly Bookings
  const totalCountThisMonth =
    bookings?.filter((b) => {
      const d = new Date(b.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length || 0;

  // 4. Average Daily Bookings (This month)
  // Formula: Total monthly bookings / Days passed so far this month
  const averageDailyThisMonth =
    today > 0 ? (totalCountThisMonth / today).toFixed(1) : 0;
  if (loading || loadingVehicles) {
    return (
      <div className="min-h-[80vh] animate-pulse space-y-6">
        {/* Header Card Skeleton */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between py-3">
            <div className="w-2/3 space-y-3">
              <div className="h-5 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-10 w-35 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        {/* Table / Rows Skeleton */}
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-4">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-full rounded bg-gray-100 dark:bg-gray-800"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (!loadingVehicles && vehicles.length === 0) {
    return (
      <div className="col-span-12 m-auto flex min-h-[70vh] w-full flex-col items-center justify-center rounded-2xl p-8 text-center shadow-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white">
          <svg
            className="text-brand-700 h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Add your first vehicle
        </h2>
        <p className="mb-8 max-w-md text-sm text-gray-500">
          You're all set up! Start tracking your fleet by adding your first
          vehicle to the system. It only takes a minute.
        </p>

        <Link
          href="/vehicles/new"
          className="bg-brand-600 focus:ring-brand-500 inline-flex items-center gap-3 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95"
        >
          <PlusIcon />
          Register New Vehicle
        </Link>
      </div>
    );
  }
  return (
    <div>
      <PageBreadcrumb pageTitle="Bookings" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {[
            {
              title: "Daily Bookings",
              value: totalCountToday,
              description: "Total Bookings today",
              icon: (
                <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />
              ),
              badge: {
                text: "9.05%",
                color: "success" as const,
                icon: <ArrowUpIcon className="text-success-500" />,
              },
            },
            {
              title: "Weekly Bookings",
              value: totalCountThisWeek,
              description: "Total Bookings this week",
              icon: (
                <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />
              ),
              badge: {
                text: "9.05%",
                color: "success" as const,
                icon: <ArrowUpIcon className="text-success-500" />,
              },
            },
            {
              title: "Monthly  Bookings",
              value: totalCountThisMonth,
              description: "Total Bookings this Month",
              icon: (
                <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />
              ),
              badge: {
                text: "9.05%",
                color: "success" as const,
                icon: <ArrowUpIcon className="text-success-500" />,
              },
            },
            {
              title: "Avg. Bookings",
              value: averageDailyThisMonth,
              description: "Average Daily Bookings for This Month",
              icon: (
                <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />
              ),
              badge: {
                text: "9.05%",
                color: "success" as const,
                icon: <ArrowUpIcon className="text-success-500" />,
              },
            },
          ].map((p, i) => (
            <div
              className="space-y-3 rounded-2xl border border-gray-200 bg-white px-5 pt-5 md:p-6 dark:border-gray-800 dark:bg-white/3"
              key={i}
            >
              <span className="text-lg font-bold text-gray-800 dark:text-gray-300">
                {p.title}
              </span>
              <div className="mt-2 flex items-center justify-between">
                <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {p.value} +
                </h4>
                <Badge color={p.badge.color}>
                  {p.badge.icon}
                  {p.badge.text}
                </Badge>
              </div>
              <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                {p.description}
              </div>
            </div>
          ))}
        </div>
      <div className="flex items-start md:items-center gap-7 justify-between py-3 flex-col md:flex-row">
          <div>
            <p className="text-theme-sm mb-2 font-medium text-gray-800 dark:text-white/90">
              View all bookings and manage them. Click Create New Booking to add
              a new booking.
            </p>
            <span className="text-theme-sm text-start text-gray-500 dark:text-gray-400">
              {bookings?.length || 0} Bookings |{" "}
              {bookings?.filter((b: any) => b.booking_status === "Active")
                .length || 0}{" "}
              Active | {averageDailyThisMonth} Average per Day
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => reloadBookings()}
              className="text-theme-sm ms-auto flex items-center justify-center gap-3 rounded-lg p-2 px-3 font-medium text-gray-500 hover:bg-gray-800/70"
            >
              <CachedIcon />
            </button>

            <Link href="/bookings/new">
              <button className="bg-brand-500 text-theme-sm hover:bg-brand-600 flex items-center justify-center rounded-lg p-2 px-3 font-medium text-white">
                New Booking
              </button>
            </Link>
          </div>
        </div>
        <BookingsTable />
      </div>
    </div>
  );
};

export default Bookings;
