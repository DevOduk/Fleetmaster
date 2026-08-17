"use client";

import React, { useState, useEffect } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ScaleIcon from "@mui/icons-material/Scale";
import ShieldIcon from "@mui/icons-material/Shield";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ConstructionIcon from "@mui/icons-material/Construction";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/utils/supabase/client";
import Badge from "../ui/badge/Badge";
import Link from "next/link";
import { fetchBookingsForClient } from "@/app/actions/bookings";
import { CircularProgress } from "@mui/material";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import { getTimeRemaining } from "../bookings/EditBooking";

interface TermSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

function ClientBookingContent() {
  const { profile, loading } = useUser();
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<string>("All");
  const supabase = createClient();

  const getCategoryLength = (activeSection: string) => {
    const items =
      activeSection === "All"
        ? bookings
        : bookings.filter((b) => b.booking_status === activeSection);
    return Number(items.length || 0);
  };

  useEffect(() => {
    const fetchUserBookings = async () => {
      setLoadingBookings(true);
      if (profile?.id) {
        const res = await fetchBookingsForClient(profile?.id);
        if (res.success) {
          setBookings(res.data as any[]);
        }
        setLoadingBookings(false);
      }
    };

    fetchUserBookings();
  }, [profile?.id, supabase]);

  // Derived state: Automatically filters whenever activeSection or bookings change
  const filteredBookings =
    activeSection === "All"
      ? bookings
      : bookings.filter((b) => b.booking_status === activeSection);

  const legalSections: TermSection[] = [
    { id: "All", title: "All Bookings", icon: ScaleIcon },
    { id: "Reserved", title: "Reserved Bookings", icon: ConstructionIcon },
    { id: "Booked", title: "Booked Bookings", icon: ConstructionIcon },
    { id: "Active", title: "Active Bookings", icon: CalendarMonthIcon },
    { id: "Completed", title: "Completed Bookings", icon: ShieldIcon },
    {
      id: "Cancelled",
      title: "Cancelled Bookings",
      icon: AccountBalanceWalletIcon,
    },
  ];

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById("acceptance");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 lg:grid-cols-12">
      <div className="col-span-12 h-fit space-y-2 lg:sticky lg:top-22 lg:col-span-4">
        <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <p className="mb-3 px-3 text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
            Agreement Navigation
          </p>
          <nav className="space-y-1">
            {legalSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleScrollTo(section.id)}
                  className={`flex w-full items-center justify-between rounded-xl p-3 text-left text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-amber-500 text-white shadow-sm shadow-amber-500/20"
                      : "text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4! w-4! ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`}
                    />
                    <span>{section.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    ({getCategoryLength(section.id)})
                    <ChevronRightIcon
                      className={`h-4! w-4! opacity-70 transition-transform ${isActive ? "translate-x-0.5" : ""}`}
                    />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="col-span-12 space-y-10 text-sm leading-7 text-slate-700 lg:col-span-8 dark:text-slate-300">
        <section id="acceptance" className="scroll-mt-12 space-y-4">
          {loading ? (
            <div className="text-brand-400 flex h-[70vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-[11px] tracking-widest uppercase">
              <CircularProgress color="inherit" size={20} />
              Preparing your account profile ...
            </div>
          ) : loadingBookings ? (
            <div className="text-brand-400 flex h-[70vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-[11px] tracking-widest uppercase">
              <CircularProgress color="inherit" size={20} />
              Consolidating bookings. Almost there ...
            </div>
          ) : filteredBookings.length > 0 ? (
            <>
              <div
                className={`flex w-full items-center justify-between rounded-xl py-3 text-left text-sm font-semibold text-slate-800 transition-all dark:text-slate-300`}
              >
                <div className="flex items-center gap-2.5">
                  <span>
                    {legalSections.find((s) => s.id === activeSection).title}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  ({getCategoryLength(activeSection)} results)
                </div>
              </div>

              {filteredBookings.map((b) => (
                <Link
                  href={"/bookings/" + b.id}
                  className="flex items-center gap-6 rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-amber-500/30 hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200 dark:border-slate-800 dark:bg-gray-800/20 dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:active:bg-gray-800"
                  key={b.id}
                >
                  <div className="w-45 shrink-0">
                    <img
                      className="aspect-video w-full rounded-xl object-cover shadow-sm"
                      src={b.vehicleDetails.image_url}
                      alt={`${b.vehicleDetails.make} ${b.vehicleDetails.model}`}
                    />
                  </div>

                  <div className="flex-1 gap-4">
                    <div className="col-span-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {b.vehicleDetails.make} {b.vehicleDetails.model} •{" "}
                        <span className="text-green-500 dark:text-green-600">
                          {b.vehicleDetails.category}
                        </span>
                      </h4>
                      <p className="text-[11px] tracking-wider text-slate-400 uppercase">
                        {b.vehicleDetails.year} •{b.payment_method} •
                        {b.rental_days} days •{b.pickup_location} •
                        <Badge
                          size="sm"
                          color={
                            b.booking_status.toLowerCase() === "reserved"
                              ? "info"
                              : b.booking_status.toLowerCase() === "booked"
                                ? "primary"
                                : b.booking_status.toLowerCase() === "active"
                                  ? "success"
                                  : b.booking_status.toLowerCase() ===
                                      "completed"
                                    ? "warning"
                                    : "error"
                          }
                        >
                          {b.booking_status}
                        </Badge>
                      </p>
                      <p className="p-.5 mb-1 flex w-full max-w-[80%] justify-between px-0">
                        <span className="font-semibold">{b.rental_start}</span>{" "}
                        - <span className="font-semibold">{b.rental_end}</span>
                      </p>
                      {b.booking_status.toLowerCase() === "reserved" ? (
                        new Date().getTime() >
                          new Date(b.created_at).getTime() + 30 * 60 * 1000 && (
                          <p className="text-sm text-red-500">
                            Reservation expired!
                          </p>
                        )
                      ) : (
                        <p className="text-brand-500 text-xs italic">
                          {new Date(b.created_at).toLocaleString()} |{" "}
                          {getTimeRemaining(
                            b.booking_status,
                            b.rental_start,
                            b.rental_end,
                            b.rental_time,
                            b.created_at,
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-l border-slate-100 pl-5 text-right dark:border-slate-800">
                    <p className="mb-1 text-[10px] tracking-widest text-slate-400 uppercase">
                      total
                    </p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-amber-500">
                      kes {Number(b.total).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-red-200 p-8 text-center text-[11px] tracking-widest text-red-400 uppercase">
              <SearchOffOutlinedIcon fontSize={"large"} />
              No bookings found in this category!
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ClientBookingContent;
