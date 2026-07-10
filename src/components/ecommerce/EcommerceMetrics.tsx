"use client";

import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import { formatedValue } from "./MonthlyTarget";

export const EcommerceMetrics = ({ vehicles, loadingVehicles, bookings, loading }: { vehicles: any, loadingVehicles: boolean, bookings: any, loading: boolean }) => {

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalRevenue = bookings?.filter(booking => {
    const bookingDate = new Date(booking.created_at);
    return bookingDate.getMonth() === currentMonth &&
      bookingDate.getFullYear() === currentYear;
  })
    .reduce((sum, booking) => sum + (Number(booking.total) || 0), 0) || 0;

  const completed = bookings?.filter((b) => b.booking_status === 'Completed') || [];

  const calculateFleetBookingRate = () => {
    const daysInMonth = 30;
    const totalVehicles = vehicles?.length || 0;
    if (totalVehicles === 0) return 0;
    const totalOccupiedDays = bookings?.reduce((sum, b) => sum + (b.rental_days || 0), 0) || 0;
    return (totalOccupiedDays / (totalVehicles * daysInMonth)) * 100;
  };

  const metrics = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: formatedValue(totalRevenue) + ' /=',
      description: "Your total earned Revenue for this month",
      icon: <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />,
      badge: { text: "9.05%", color: "success" as const, icon: <ArrowUpIcon className="text-success-500" /> },
      isReady: !loading
    },
    {
      id: "vehicles",
      title: "Vehicles",
      value: `${vehicles?.length || 0} +`,
      description: "Active operational vehicles in your fleet",
      icon: <DirectionsCarFilledOutlinedIcon className="text-gray-800 size-6 dark:text-white/90" />,
      badge: { text: "11.01%", color: "success" as const, icon: <ArrowUpIcon /> },
      isReady: !loadingVehicles
    },
    {
      id: "bookings",
      title: "Completed Bookings",
      value: `${completed.length} +`,
      description: "Total finalized deployment runs",
      icon: <ScheduleOutlinedIcon className="text-gray-800 dark:text-white/90" />,
      badge: { text: "9.05%", color: "error" as const, icon: <ArrowDownIcon className="text-error-500" /> },
      isReady: !loading
    },
    {
      id: "rate",
      title: "Booking Rate",
      value: `${formatedValue(calculateFleetBookingRate())} %`,
      description: "Average utility utilization metrics",
      icon: <TrendingUpOutlinedIcon className="text-gray-800 dark:text-white/90" />,
      badge: { text: "9.05%", color: "error" as const, icon: <ArrowDownIcon className="text-error-500" /> },
      isReady: !loading && !loadingVehicles
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {metrics.map((card, i) => (
        card.isReady ? (
          <div className="rounded-2xl border border-gray-200 bg-brand-500/5 p-5 dark:border-gray-800 md:p-6 space-y-3" key={i}>
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 shadow-xs shadow-brand-600 rounded-xl dark:bg-gray-800">
              {card.icon}
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-300">
              {card.title}
            </span>
            <div className="flex mt-2 items-center justify-between">
              <h4 className="font-bold text-gray-800 text-2xl dark:text-white/90">
                {card.value}
              </h4>
              <Badge color={card.badge.color}>
                {card.badge.icon}
                {card.badge.text}
              </Badge>
            </div>
            <div className="text-xs truncate text-gray-500 dark:text-gray-400">
              {card.description}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-brand-500/5 p-5 dark:border-gray-800 md:p-6 space-y-3" key={i}>
            <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl dark:bg-gray-700" />
            <div className="flex items-end justify-between mt-5">
              <div>
                <div className="h-4 dark:bg-white/7 bg-gray-100 w-23" />
                <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700" />
              </div>
              <div className="bg-gray-700 w-13 h-5 rounded-xl" />
            </div>
          </div>
        )
      ))}
    </div>
  );
};