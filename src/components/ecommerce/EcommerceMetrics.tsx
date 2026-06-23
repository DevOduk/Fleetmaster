"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { useBooking } from "@/context/BookingContext";
import { useFleet } from "@/context/FleetContext";
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";

export const EcommerceMetrics = () => {
  const { bookings, loading } = useBooking();
  const { vehicles, loading: loadingVehicles } = useFleet();

  const totalRevenue = bookings.reduce((sum, booking) => {
    return sum + (booking.total || 0);
  }, 0);

  const calculateFleetBookingRate = () => {
    const daysInMonth = 30;
    const totalVehicles = vehicles.length;

    if (totalVehicles === 0) return 0;

    // 1. Calculate Total Capacity (Total days all cars could have been rented)
    const totalAvailableDays = totalVehicles * daysInMonth;

    // 2. Sum up the actual rentalDays from all bookings
    const totalOccupiedDays = bookings.reduce((sum, booking) => {
      return sum + (booking.rentalDays || 0);
    }, 0);

    // 3. Calculate Percentage
    const utilizationRate = (totalOccupiedDays / totalAvailableDays) * 100;

    // Return formatted number
    return utilizationRate;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">

      {/* */}
      {
        (!loadingVehicles && !loading) && totalRevenue ?
          <>
            {/* CARD 1: Total Revenue */}
            <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 bg-brand-500/5 md:p-6">
              <div className="flex gap-3 items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                  <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />
                </div>

                <span className="text-xl font-bold text-gray-200 dark:text-gray-100">
                  Total Revenue
                </span>
              </div>
              <div className="flex items-center justify-between mt-5">
                <div>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    $ {totalRevenue.toLocaleString()}
                  </h4>
                </div>

                <Badge color="success">
                  <ArrowUpIcon className="text-success-500" />
                  9.05%
                </Badge>
              </div>
              <div className="text-sm mt-3 text-gray-500 dark:text-gray-400">
                Your total earned Revenue for this month
              </div>
            </div>

            {/* CARD 2: Vehicles */}
            {
              vehicles ?
                <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 bg-brand-500/5 md:p-6">
                  <div className="flex gap-3 items-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                      <DirectionsCarFilledOutlinedIcon className="text-gray-800 size-6 dark:text-white/90" />
                    </div>

                    <span className="text-xl font-bold text-gray-200 dark:text-gray-100">
                      Vehicles
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-5">
                    <div>
                      <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {vehicles.length} +
                      </h4>
                    </div>
                    <Badge color="success">
                      <ArrowUpIcon />
                      11.01%
                    </Badge>
                  </div>
                  <div className="text-sm mt-3 text-gray-500 dark:text-gray-400">
                    Active operational vehicles in your fleet
                  </div>
                </div> :
                <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-550 rounded-xl dark:bg-gray-700">
                  </div>
                  <div className="flex items-end justify-between mt-5">
                    <div>
                      <div className="h-4 dark:bg-white/7 bg-gray-100 w-23">
                      </div>
                      <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700">
                      </div>
                    </div>
                    <div className="bg-gray-700 w-13 h-5 rounded-xl">
                    </div>
                  </div>
                </div>
            }

            {/* CARD 3: Completed Bookings */}
            {
              bookings ?
                <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 bg-brand-500/5 md:p-6">
                  <div className="flex gap-3 items-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                      <ScheduleOutlinedIcon className="text-gray-800 dark:text-white/90" />
                    </div>

                    <span className="text-xl font-bold text-gray-200 dark:text-gray-100">
                      Completed Bookings
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-5">
                    <div>
                      <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {bookings.length} +
                      </h4>
                    </div>

                    <Badge color="error">
                      <ArrowDownIcon className="text-error-500" />
                      9.05%
                    </Badge>
                  </div>
                  <div className="text-sm mt-3 text-gray-500 dark:text-gray-400">
                    Total finalized deployment runs
                  </div>
                </div> :
                <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-550 rounded-xl dark:bg-gray-700">
                  </div>
                  <div className="flex items-end justify-between mt-5">
                    <div>
                      <div className="h-4 dark:bg-white/7 bg-gray-100 w-23">
                      </div>
                      <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700">
                      </div>
                    </div>
                    <div className="bg-gray-700 w-13 h-5 rounded-xl">
                    </div>
                  </div>
                </div>
            }

            {/* CARD 4: Booking Rate */}
            {
              calculateFleetBookingRate ?
                <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 bg-brand-500/5 md:p-6">
                  <div className="flex gap-3 items-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                      <TrendingUpOutlinedIcon className="text-gray-800 dark:text-white/90" />
                    </div>

                    <span className="text-xl font-bold text-gray-200 dark:text-gray-100">
                      Booking Rate
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-5">
                    <div>
                      <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {(calculateFleetBookingRate().toFixed(2))} %
                      </h4>
                    </div>

                    <Badge color="error">
                      <ArrowDownIcon className="text-error-500" />
                      9.05%
                    </Badge>
                  </div>
                  <div className="text-sm mt-3 text-gray-500 dark:text-gray-400">
                    Average utility utilization metrics
                  </div>
                </div> :
                <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-550 rounded-xl dark:bg-gray-700">
                  </div>
                  <div className="flex items-end justify-between mt-5">
                    <div>
                      <div className="h-4 dark:bg-white/7 bg-gray-100 w-23">
                      </div>
                      <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700">
                      </div>
                    </div>
                    <div className="bg-gray-700 w-13 h-5 rounded-xl">
                    </div>
                  </div>
                </div>
            }
          </> : <>
            <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl dark:bg-gray-700">
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <div className="h-4 dark:bg-white/7 bg-gray-100 w-23">
                  </div>
                  <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700">
                  </div>
                </div>
                <div className="bg-gray-700 w-13 h-5 rounded-xl">
                </div>
              </div>
            </div>
            <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl dark:bg-gray-700">
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <div className="h-4 dark:bg-white/7 bg-gray-100 w-23">
                  </div>
                  <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700">
                  </div>
                </div>
                <div className="bg-gray-700 w-13 h-5 rounded-xl">
                </div>
              </div>
            </div>
            <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl dark:bg-gray-700">
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <div className="h-4 dark:bg-white/7 bg-gray-100 w-23">
                  </div>
                  <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700">
                  </div>
                </div>
                <div className="bg-gray-700 w-13 h-5 rounded-xl">
                </div>
              </div>
            </div>
            <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl dark:bg-gray-700">
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <div className="h-4 dark:bg-white/7 bg-gray-100 w-23">
                  </div>
                  <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700">
                  </div>
                </div>
                <div className="bg-gray-700 w-13 h-5 rounded-xl">
                </div>
              </div>
            </div>
          </>
      }
    </div>
  );
};