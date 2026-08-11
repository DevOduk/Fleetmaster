"use client";

import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import { formatedValue } from "./MonthlyTarget";


export const calculateChange = (current: number, previous: number) => {
  if (previous === 0) {
    if (current === 0) return 0;        // no change
    return null;                        // undefined growth
  }
  const change = ((current - previous) / previous) * 100;

  return change;
};

export const formatChange = (change: number | null) => {
  if (change === null) {
    return {
      text: "New",
      color: "success" as const,
      icon: <ArrowUpIcon className="text-success-500" />
    };
  }

  return {
    text: Math.abs(change).toFixed(2) + "%",
    color: change >= 0 ? "success" as const : "error" as const,
    icon: change >= 0
      ? <ArrowUpIcon className="text-success-500" />
      : <ArrowDownIcon className="text-error-500" />
  };
};

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

  const lastMonth = (currentMonth - 1 + 12) % 12;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;


  const totalRevenueLastMonth = bookings?.filter(booking => {
    const bookingDate = new Date(booking.created_at);
    return bookingDate.getMonth() === lastMonth &&
      bookingDate.getFullYear() === lastMonthYear;
  })
    .reduce((sum, booking) => sum + (Number(booking.total) || 0), 0) || 0;

  // 1. Get vehicle counts
  const vehiclesCountThisMonth = vehicles?.length || 0;

  const vehiclesCountLastMonth = vehicles?.filter(v => {
    const date = new Date(v.created_at);
    return date.getMonth() === lastMonth &&
      date.getFullYear() === lastMonthYear;
  }).length || 0;

  // 1. All completed bookings up to now (no date restriction)
  const totalCompletedNow = bookings?.filter((b) => b.booking_status === 'Completed').length || 0;

  // 2. All completed bookings as at the end of last month 
  // (created on or before the last day of lastMonthYear / lastMonth)
  const lastDayOfLastMonth = new Date(lastMonthYear, lastMonth + 1, 0, 23, 59, 59, 999);

  const totalCompletedLastMonth = bookings?.filter((b) => {
    if (b.booking_status !== 'Completed') return false;
    const bookingDate = new Date(b.created_at);
    return bookingDate <= lastDayOfLastMonth;
  }).length || 0;



  // 1. Helper to calculate booking rate for a specific month and year
  const getBookingRateForPeriod = (targetMonth, targetYear, targetDaysInMonth) => {
    const totalVehicles = vehicles?.length || 0;
    if (totalVehicles === 0) return 0;

    // Filter bookings that overlap or were created/active in that specific month
    const occupiedDays = bookings?.reduce((sum, b) => {
      const bookingDate = new Date(b.created_at);
      // Checking if booking belongs to the target month/year
      if (bookingDate.getMonth() === targetMonth && bookingDate.getFullYear() === targetYear) {
        return sum + (b.rental_days || 0);
      }
      return sum;
    }, 0) || 0;

    return (occupiedDays / (totalVehicles * targetDaysInMonth)) * 100;
  };

  // Get days in the current month dynamically
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Get days in last month dynamically
  const daysInLastMonth = new Date(lastMonthYear, lastMonth + 1, 0).getDate();

  // 2. Calculate rates
  const rateThisMonth = getBookingRateForPeriod(currentMonth, currentYear, daysInCurrentMonth);
  const rateLastMonth = getBookingRateForPeriod(lastMonth, lastMonthYear, daysInLastMonth);

  // | ---------------------    CHANGES CALCULATORS --------------------| 
  const totalRevenueChange = calculateChange(totalRevenue, totalRevenueLastMonth);
  const vehiclesChange = calculateChange(vehiclesCountThisMonth, vehiclesCountLastMonth);
  const completedPercentageChange = calculateChange(totalCompletedNow, totalCompletedLastMonth);
  const rateChange = calculateChange(rateThisMonth, rateLastMonth);



  const metrics = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: formatedValue(totalRevenue) + ' /=',
      description: "Your total earned Revenue for this month",
      icon: <AttachMoneyOutlinedIcon className="text-gray-500 dark:text-gray-400" />,
      badge: formatChange(totalRevenueChange),
      isReady: !loading
    },
    {
      id: "vehicles",
      title: "Vehicles",
      value: `${vehicles?.length || 0} +`,
      description: "Active operational vehicles in your fleet",
      icon: <DirectionsCarFilledOutlinedIcon className="text-gray-500 dark:text-gray-400" />,
      badge: formatChange(vehiclesChange),
      isReady: !loadingVehicles
    },
    {
      id: "bookings",
      title: "Completed Bookings",
      value: `${totalCompletedNow} +`,
      description: "Total finalized deployment runs",
      icon: <ScheduleOutlinedIcon className="text-gray-500 dark:text-gray-400" />,
      badge: formatChange(completedPercentageChange),
      isReady: !loading
    },
    {
      id: "rate",
      title: "Booking Rate",
      value: `${formatedValue(rateThisMonth)} %`,
      description: "Average utility utilization metrics",
      icon: <TrendingUpOutlinedIcon className="text-gray-500 dark:text-gray-400" />,
      badge: formatChange(rateChange),
      isReady: !loading && !loadingVehicles
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {metrics.map((card, i) => (
        card.isReady ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 md:p-6 space-y-3" key={i}>
            <div className="flex items-center justify-end ms-auto shadow-xs">
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
          <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 md:p-6 space-y-3" key={i}>
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