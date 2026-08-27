"use client";

import { CalendarWrapper } from "@/components/calendar/CalendarWrapper";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import VehicleNotFound from "@/components/vehicles/NotFound";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import isBetween from "dayjs/plugin/isBetween";
import dayjs, { Dayjs } from "dayjs";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Box, Chip } from "@mui/material";
dayjs.extend(isBetween);
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { useUser } from "@/context/UserContext";
import { useTenant } from "@/context/TenantContext";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import DeliveryBanner from "@/components/client-components/DeliveryBanner";
import { fetchVehicleDetails } from "@/app/actions/vehicles";
import { fetchBookingsForVehicle } from "@/app/actions/bookings";
import { syncTimeToDateString } from "../hero/searchform";
import { userVerified } from "@/utils/clients/checkverification";

interface VehiclePageProps {
  params: Promise<{ vehicleID: string; tenant: string }>;
}

const breadcrumbItems = [{ label: "Vehicles", href: "/vehicles" }];

export default function ViewVehiclePage({ params }: VehiclePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchString = searchParams.toString();
  // Rebuild the accurate current page URL dynamically to signin link
  const currentPageUrl = encodeURIComponent(
    searchString ? btoa(`${pathname}?${searchString}`) : btoa(pathname),
  );
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [bookings, setBookings] = useState([]);
  const { showToast } = useToast();
  const { profile } = useUser();
  const { tenant } = useTenant();
  const [isRedirecting, setIsRedirecting] = useState(false);


  // Generate tomorrow at a fixed 9:00 AM deterministically
  const fallbackStart = dayjs().add(1, "day").hour(9).minute(0).second(0).millisecond(0).toDate().toString();
  const fallbackEnd = dayjs().add(3, "day").hour(9).minute(0).second(0).millisecond(0).toDate().toString();


  const [start, setStart] = useState(
    searchParams.get("start") ? searchParams.get("start") : fallbackStart,
  );
  const [end, setEnd] = useState(
    searchParams.get("end") ? searchParams.get("end") : fallbackEnd,
  );
  const [expandBreakdown, setExpandBreakdown] = useState(false);

  const vehicleID = resolvedParams.vehicleID;
  const [VehicleDetails, setVehicleDetails] = useState<any | null>(null);

  useEffect(() => {
    if (!vehicleID || isNaN(parseInt(vehicleID))) {
      console.error("Invalid vehicleID:", vehicleID);
      setVehicleDetails(null);
      return;
    }

    setLoading(true);
    fetchVehicleDetails(parseInt(vehicleID))
      .then((response) => {
        if (response.data) {
          setVehicleDetails(response.data);
        } else {
          console.error("Error fetching vehicle details:", response.error);
          setVehicleDetails(null);
        }
      })
      .catch((err) => {
        console.error("Fetch vehicle details failed:", err);
        setVehicleDetails(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [vehicleID]);

  useEffect(() => {
    if (!vehicleID || isNaN(parseInt(vehicleID))) {
      console.error("Invalid vehicleID:", vehicleID);
      setVehicleDetails(null);
      return;
    }

    setLoadingBooking(true);
    fetchBookingsForVehicle(vehicleID)
      .then((response) => {
        if (response.data) {
          setBookings(response.data);
        } else {
          console.error("Error fetching vehicle details:", response.error);
          setBookings([]);
        }
      })
      .catch((err) => {
        console.error("Fetch vehicle details failed:", err);
        setBookings(null);
      })
      .finally(() => {
        setLoadingBooking(false);
      });
  }, [vehicleID]);

  const bookedDates = useMemo(() => {
    if (loading || !bookings) return [];

    const activeBookings = bookings.filter((b) =>
      ["Booked", "In Progress"].includes(b.booking_status),
    );

    return activeBookings.flatMap((booking) => {
      const start = dayjs(booking.rental_start);
      const end = dayjs(booking.rental_end); // Fixed the typo here

      if (!start.isValid() || !end.isValid()) return [];

      const days = [];
      let current = start;

      while (current.isBefore(end) || current.isSame(end, "day")) {
        days.push(current.format("YYYY-MM-DD"));
        current = current.add(1, "day");
      }
      return days;
    });
  }, [vehicleID, bookings, loading]);

  const totalDays = useMemo(() => {
    const startDay = dayjs(start);
    const endDay = dayjs(end);

    const dayGap =
      startDay.isValid() && endDay.isValid() ? endDay.diff(start, "day") : 0;

    return dayGap <= 0 ? 1 : dayGap;
  }, [start, end]);

  if (loading) {
    return (
      <main className="container m-auto animate-pulse space-y-6 p-6">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 h-6 w-1/4 rounded bg-gray-200 dark:bg-gray-800" />

        {/* Banner Alert Promos Skeleton */}
        <div className="col-span-full mb-5 h-24 rounded-xl border border-gray-300 bg-gray-200 dark:border-gray-700 dark:bg-gray-800" />

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel: Calendar Skeleton (col-span-5) */}
          <div className="col-span-12 space-y-6 lg:col-span-4">
            <div className="flex h-80 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mx-auto h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mt-4 grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-8 rounded-lg bg-gray-200 dark:bg-gray-800"
                  />
                ))}
              </div>
            </div>

            {/* Date Inputs Form Fields Skeletons */}
            <div className="space-y-4">
              <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>

          {/* Right Panel: Specifications View Skeleton (col-span-7) */}
          <div className="col-span-12 space-y-6 lg:col-span-8">
            <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {/* Header Title Information */}
              <div className="flex items-start justify-between">
                <div className="w-1/2 space-y-2">
                  <div className="h-7 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>

              {/* Main Vector Image Area */}
              <div className="aspect-video w-full rounded-xl bg-gray-200 dark:bg-gray-800" />

              {/* Description Paragraph Blocks */}
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
              </div>

              {/* Specifications Matrix Metadata Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 border-t border-gray-100 pt-4 dark:border-gray-800">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                ))}
              </div>

              {/* Action Buttons Layer */}
              <div className="space-y-3 pt-4">
                <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
                <div className="flex gap-3">
                  <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
                  <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!VehicleDetails) {
    return <VehicleNotFound />;
  }

  // --- DYNAMIC FINANCIAL CALCULATIONS ---
  const dynamicDays = totalDays <= 0 ? 1 : totalDays;
  const baseRateTotal = dynamicDays * VehicleDetails?.daily_rate;
  const rescuePlanFee = 200;
  const subTotalBeforeVat = baseRateTotal + rescuePlanFee;
  const vatAmount = Math.round(subTotalBeforeVat * 0.16);
  const grandTotalAmount = subTotalBeforeVat + vatAmount;

  return (
    <main className="container m-auto p-6">
      <PageBreadcrumb
        items={breadcrumbItems}
        pageTitle={`${VehicleDetails?.make} ${VehicleDetails?.model}`}
      />
      <DeliveryBanner />

      <div className="grid grid-cols-12 gap-6">
        {/* Calendar Section: col-span-5 */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CalendarWrapper
              bookings={
                bookings.filter((b) => b.vehicle_id === Number(vehicleID)) || []
              }
              loading={loadingBooking}
              isMarkedUnavailable={VehicleDetails?.status === "Not Available"}
              vehicleId={parseInt(vehicleID)}
              dateString={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Price Range Fields */}
          <div className="mb-2">
            <p className="mb-2 text-black dark:text-white">
              Rental Dates (All Times in {tenant?.timezone || "Nairobi (UTC+3)"}
              )
            </p>
            <div className="mt-4 mb-8 grid grid-cols-1 gap-3">
              <div className="col-span-6 lg:col-span-12">
                <Label>Start Date</Label>
                <div className="relative mt-2">
                  <Input
                    type="datetime-local"
                    className="pl-15.5 text-inherit"
                    value={start ? dayjs(start).format("YYYY-MM-DDTHH:mm") : ""}
                    onChange={(e) => {
                      const newStart = e.target.value; // e.g., "2026-06-25T16:00"
                      const updatedEnd = syncTimeToDateString(end, newStart);
                      setStart(newStart);
                      setEnd(updatedEnd);
                    }}
                    name="end_date"
                  />

                  <span className="absolute top-1/2 left-0 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <CalendarMonthOutlinedIcon />
                  </span>
                </div>
              </div>
              <div className="col-span-6 lg:col-span-12">
                <Label>End Date</Label>
                <div className="relative mt-2">
                  <Input
                    type="datetime-local"
                    className="pl-15.5"
                    value={end ? dayjs(end).format("YYYY-MM-DDTHH:mm") : ""}
                    onChange={(e) => {
                      const newEnd = e.target.value; // e.g., "2026-06-25T16:00"
                      const updatedStart = syncTimeToDateString(start, newEnd);
                      setStart(updatedStart);
                      setEnd(newEnd);
                    }}
                    name="end_date"
                  />

                  <span className="absolute top-1/2 left-0 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <CalendarMonthOutlinedIcon />
                  </span>
                </div>
              </div>
              <div className="col-span-12">
                <Label>Days</Label>
                <div className="relative mt-2">
                  <div className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-15.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30">
                    {totalDays} Days
                  </div>

                  <span className="absolute top-1/2 left-0 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <ScheduleIcon />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section: col-span-7 */}
        <div className="col-span-12 space-y-6 lg:col-span-7 relative">

          <div className="mt-3 mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 gap-y-3 rounded border border-gray-300 p-2 text-sm dark:border-gray-700 sticky top-20 dark:bg-gray-800 bg-gray-50 z-10">
            {/* Row 1 */}
            <h4 className="text-theme-l lg:text-l font-semibold text-gray-800 dark:text-white/90">
              Total Amount:
            </h4>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
            <div className="m-0 p-0 text-right font-bold text-green-600 dark:text-green-400">
              KSH. {grandTotalAmount.toLocaleString()}
            </div>
          </div>

          <p
            role="button"
            className="text-brand-400 mt-0 mb-4 text-right text-xs font-medium underline"
            onClick={() => setExpandBreakdown(!expandBreakdown)}
          >
            {expandBreakdown ? "Collapse" : "Expand"} Cost Breakdown?
          </p>

          {expandBreakdown && (
            <div className="top-0 ms-auto mb-5 flex w-full flex-col gap-2 rounded-2xl bg-gray-200 dark:bg-gray-800">
              <h4 className="modal-title text-theme-l lg:text-l mt-4 px-3 text-right font-semibold text-gray-800 dark:text-white/90">
                Booking Summary
              </h4>
              <div className="mt-2 rounded-xl border border-gray-200 bg-white p-2 px-3 dark:border-gray-800 dark:bg-gray-900/30">
                <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Cost Breakdown
                </h3>

                {/* Grid Wrapper */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 gap-y-3 text-sm">
                  {/* Row 1 */}
                  <div className="text-left text-gray-500 dark:text-gray-400">
                    Duration
                  </div>
                  <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                  <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                    {dynamicDays} Days
                  </div>

                  {/* Row 2 */}
                  <div className="text-left text-gray-500 dark:text-gray-400">
                    Daily Rate
                  </div>
                  <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                  <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                    Ksh. {VehicleDetails?.daily_rate.toLocaleString()}
                  </div>

                  {/* Row 3 */}
                  <div className="text-left text-gray-500 dark:text-gray-400">
                    Delivery + Pickup fee
                  </div>
                  <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                  <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                    Ksh. 0
                  </div>

                  {/* Row 4 */}
                  <div className="text-left text-gray-500 dark:text-gray-400">
                    Rescue Plan
                  </div>
                  <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                  <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                    Ksh. {rescuePlanFee}
                  </div>

                  {/* Row 5 */}
                  <div className="text-left text-gray-500 dark:text-gray-400">
                    VAT 16%
                  </div>
                  <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                  <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                    Ksh. {vatAmount.toLocaleString()}
                  </div>

                  {/* Horizontal Divider Span across all 3 columns */}
                  <div className="col-span-3 my-1 border-t border-gray-200 dark:border-gray-800" />

                  {/* Grand Total Row */}
                  <div className="text-left font-bold text-gray-800 dark:text-gray-100">
                    Total
                  </div>
                  <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />
                  <div className="text-right text-base font-bold text-green-600 dark:text-green-500">
                    Ksh. {grandTotalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {VehicleDetails?.year} {VehicleDetails?.make}{" "}
                  {VehicleDetails?.model}
                </h2>
                <p className="text-gray-500">
                  Category: {VehicleDetails?.category} | Body Type:{" "}
                  {VehicleDetails?.group}
                </p>
              </div>
              <div>
                <span
                  className={`font-sm mt-2 mb-1 rounded-full px-3 py-1 text-xs ${VehicleDetails?.status === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                    }`}
                >
                  {VehicleDetails?.status}
                </span>
                <span className="font-sm ms-3 mt-2 mb-1 rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                  Driver: {VehicleDetails?.driver_type}
                </span>
              </div>
            </div>

            <div className="relative">
              <Box
                className="flex gap-2"
                sx={{ position: "absolute", top: 10, right: 10 }}
              >
                <Chip
                  sx={{ px: 1 }}
                  variant="filled"
                  color="primary"
                  icon={<LocalGasStationOutlinedIcon fontSize="small" />}
                  label={VehicleDetails?.fuel_type}
                />
                <Chip
                  sx={{ px: 1 }}
                  variant="filled"
                  color="success"
                  icon={<PeopleAltOutlinedIcon fontSize="small" />}
                  label={VehicleDetails?.seats + " Seats"}
                />
              </Box>
              <img
                src={VehicleDetails?.image_url}
                alt={""}
                className="mb-8 aspect-video w-full rounded-xl object-cover object-center"
              />
            </div>

            <div>
              <p className="font-sm mt-2 mb-1 dark:text-gray-400">
                {VehicleDetails?.description}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-gray-400">Year</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails?.year}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Seats</span>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails?.seats}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Exterrior Color</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails?.color[0]}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Interrior Color</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails?.color[1]}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Transmission</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails?.transmission}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Daily Rate</p>
                <p className="font-sm text-brand-600 mt-2 mb-1">
                  Ksh. {VehicleDetails?.daily_rate.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Location</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails?.location?.title || 'Loading ...'}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Minimum Rental Days</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails?.min_rental_days} days
                </p>
              </div>

              <div>
                <p className="text-gray-400">Luggages/Carry-on</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {2} carry-ons
                </p>
              </div>

              <div>
                <p className="text-gray-400">Baby Seats</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  Available on request
                </p>
              </div>
            </div>
            {profile ? (
              <div
                onClick={() => {
                  const today = dayjs(new Date()).startOf("day");
                  const startDay = dayjs(start).startOf("day");
                  const endDay = dayjs(end).startOf("day");

                  const totalDaysCalculated =
                    startDay.isValid() && endDay.isValid()
                      ? endDay.diff(startDay, "day")
                      : 0;

                  // 1. Basic validation checks
                  if (
                    totalDaysCalculated < 1 ||
                    endDay.isBefore(startDay) ||
                    startDay.isBefore(today)
                  ) {
                    showToast("Please select a valid date!", "warning");
                    return;
                  }

                  if (
                    totalDaysCalculated <
                    Number(VehicleDetails?.min_rental_days)
                  ) {
                    showToast(
                      "Please select a minimum of " +
                      VehicleDetails?.min_rental_days +
                      " days!",
                      "error",
                    );
                    return;
                  }

                  // --- 2. NEW OVERLAP CHECK INTERCEPTION ---
                  let isOverlapping = false;
                  let checkDay = startDay;

                  // Loop through each day of the user's current selection
                  while (
                    checkDay.isBefore(endDay) ||
                    checkDay.isSame(endDay, "day")
                  ) {
                    const formattedCheckDay = checkDay.format("YYYY-MM-DD");

                    // If the current day string matches an array item in your memoized bookedDates...
                    if (bookedDates?.includes(formattedCheckDay)) {
                      isOverlapping = true;
                      break; // Exit loop immediately upon finding a conflict
                    }
                    checkDay = checkDay.add(1, "day");
                  }

                  if (isOverlapping) {
                    showToast(
                      "This vehicle is already booked for some of your selected dates!",
                      "error",
                    );
                    return; // Stop execution: blocks router.push entirely
                  }

                  setIsRedirecting(true);
                  // ----------------------------------------

                  // Compute token-specific metrics to match current selection
                  const tokenDays =
                    totalDaysCalculated <= 0 ? 1 : totalDaysCalculated;
                  const tokenBaseRate = tokenDays * VehicleDetails?.daily_rate;
                  const tokenVat = Math.round((tokenBaseRate + 200) * 0.16);
                  const tokenTotal = tokenBaseRate + 200 + tokenVat;

                  // Gather the state you want to protect
                  const stateToEncode = {
                    vehicleID: vehicleID,
                    VehicleDetails: VehicleDetails,
                    bookingInformation: {
                      start: dayjs(start).format("YYYY-MM-DDTHH:mm"),
                      end: dayjs(end).format("YYYY-MM-DDTHH:mm"),
                      totalDays: tokenDays,
                      vat: tokenVat,
                      rescue: 200,
                      total: tokenTotal,
                    },
                  };

                  try {
                    // Convert to JSON, then encode to Base64
                    const jsonString = JSON.stringify(stateToEncode);
                    const encodedData = btoa(encodeURIComponent(jsonString));

                    // Navigate with the tokenized payload
                    router.push(
                      `/vehicles/${vehicleID}/book?token=${encodedData}`,
                    );
                  } catch (error) {
                    console.error("Failed to encode booking data:", error);
                  }
                }}
              >
                <Button
                  disabled={
                    isRedirecting || // <--- Disable immediately when true
                    !profile ||
                    VehicleDetails?.status === "Not Available" ||
                    !userVerified(profile)
                  }
                  className="mt-5 w-full"
                  size="sm"
                >
                  {isRedirecting
                    ? "Redirecting ..."
                    : !userVerified(profile)
                      ? "Verify your account to book"
                      : "Continue to Book"}
                </Button>
              </div>
            ) : (
              <Link target="_blank" href={`/signin?r=${currentPageUrl}`}>
                <Button className="mt-5 w-full" size="sm">
                  Signin to Book
                </Button>
              </Link>
            )}
            <div className="mx-auto mt-3 flex w-1/2 items-center gap-3 text-sm text-gray-500">
              <div className="h-0.5 w-full bg-gray-600"></div>
              OR
              <div className="h-0.5 w-full bg-gray-600"></div>
            </div>
            <div className="flex items-center gap-3">
              <Link className="w-full" href={"tel:+254768927617"}>
                <Button className="mt-5 w-full" size="sm" variant="danger">
                  Call to Book <PhoneOutlinedIcon fontSize="small" />{" "}
                </Button>
              </Link>
              <Link
                className="w-full"
                href={
                  "https://wa.me/254768927617?text=I%20am%20interested%20in%20booking%20the%20" +
                  VehicleDetails?.make +
                  "%20" +
                  VehicleDetails?.model +
                  "%20" +
                  location.origin +
                  "/vehicles/" +
                  vehicleID
                }
              >
                <Button className="mt-5 w-full" size="sm" variant="success">
                  Book on WhatsApp <SmsOutlinedIcon fontSize="small" />{" "}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
