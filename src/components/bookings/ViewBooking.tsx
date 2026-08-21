"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import {
  CalenderIcon,
  DownloadIcon,
  PencilIcon,
  PlusIcon,
  TimeIcon,
} from "@/icons";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import Badge from "../ui/badge/Badge";
import { useUser } from "@/context/UserContext";
import BookingNotFound from "./NotFound";
import Alert from "../ui/alert/Alert";
import { getTimeRemaining } from "./EditBooking";
import { CalendarComponent } from "../calendar/CalendarComponent";
import dayjs from "dayjs";
import SimpleLoader from "../ui/loading/simpleLoader";
import { fetchBookingDetails } from "@/app/actions/bookings";

const calendarsEvents = {
  "High Priority": "success",
  "Medium Priority": "primary",
  "Low Priority": "warning",
};

/**
 * Helper to convert milliseconds into "X Days Y Hrs Z Mins S Secs"
 */

export default function ViewBooking({ BookingID }: { BookingID: number }) {
  document.title = "View Booking " + BookingID;
  const { loading, profile } = useUser();
  const [eventStartDate, setEventStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [timerString, setTimerString] = useState<string>("");

  useEffect(() => {
    if (loading) return;
    setLoadingBooking(true);

    fetchBookingDetails(BookingID, profile?.tenant_id).then((res) => {
      if (!res.error) {
        setBookingDetails(res.data);
        setLoadingBooking(false);
      } else {
        setLoadingBooking(false);
        setBookingDetails(null);
      }
    });
  }, [loading, BookingID]);
console.log('booking',bookingDetails?.tenant_id,'vs profile: ', profile?.tenant_id)
  useEffect(() => {
    if (!bookingDetails) return;

    // Define the interval function
    const updateTimer = () => {
      setTimerString(
        getTimeRemaining(
          bookingDetails.booking_status,
          bookingDetails.rental_start,
          bookingDetails.rental_end,
          bookingDetails.rental_time,
          bookingDetails.created_at,
        ),
      );
    };

    // Run once immediately to avoid 1-second delay on mount
    updateTimer();

    const int = setInterval(updateTimer, 1000);

    // Return a function to correctly clear the interval
    return () => clearInterval(int);
  }, [bookingDetails]); // Added dependency to re-run if details change

  // Helper to format Date object to YYYY-MM-DD (Local Time)
  const formatDateToLocal = (dateStr: any) => {
    if (!dateStr) return "";

    // Create a date object. If it's all day, we treat it as local midnight.
    // FullCalendar often passes '2026-05-13' which might be parsed as UTC.
    // We force it to be interpreted as local time by appending 'T00:00:00'
    // and then extracting the local parts.
    const date = new Date(dateStr);

    // If the date is invalid, return empty
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const bookedDates = (() => {
    const start = dayjs(bookingDetails?.rental_start);
    const end = dayjs(bookingDetails?.rental_end);
    const days: any[] = [];
    let current = start;

    while (current.isBefore(end) || current.isSame(end, "day")) {
      days.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }
    return days;
  })();

  const isReserved = (() => {
    return bookingDetails?.booking_status === "Reserved" || false; // Changed from isBefore to isAfter
  })();

  // Helper to format Date object to YYYY-MM-DD (Local Time)
  if (loading || loadingBooking) {
    return <SimpleLoader name="booking details" />;
  }

  if (
    !bookingDetails ||
    (profile.role === "Client" && bookingDetails.user_id !== profile.id)
  ) {
    return <BookingNotFound />;
  }

  return (
    <div className="mx-auto max-w-6xl rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
      {bookingDetails ? (
        <div className="relative flex flex-col px-2">
          <Button
            className="sticky top-20 right-0 z-9999"
            variant="primary"
            size="sm"
          >
            {timerString}
          </Button>

          <CalendarComponent
            bookedDates={bookedDates}
            dateString={new Date().toISOString().split("T")[0]}
          />

          {bookingDetails?.booking_status.toLowerCase() === "reserved" &&
            new Date().getTime() >
              new Date(bookingDetails.created_at).getTime() +
                30 * 60 * 1000 && (
              <Alert
                variant="error"
                title="Reservation expired!"
                message="This reservation has expired and can be rented by anther person. Once reservation is made, you have 30 minutes to complete payment or the reservation will be released for someone. If this happens you can check again after a few minutes for availability. Thank you!"
              ></Alert>
            )}
          <div className="mt-5 mb-4 flex items-center gap-3 text-gray-400">
            <Badge
              size="md"
              color={
                bookingDetails.booking_status === "Booked"
                  ? "primary"
                  : bookingDetails.booking_status === "Active"
                    ? "success"
                    : bookingDetails.booking_status === "Completed"
                      ? "info"
                      : "warning"
              }
            >
              BOOKING STATUS: {bookingDetails?.booking_status}
            </Badge>
            {bookingDetails?.booking_status === "Cancelled" && (
              <>
                |{" "}
                <p className="text-red-500">
                  {bookingDetails?.cancellation_reason ||
                    "Reason for cancellation unavailable!"}
                </p>
              </>
            )}
          </div>
          <h4 className="modal-title text-theme-xl mt-3 mb-3 font-semibold text-gray-800 lg:text-xl dark:text-white/90">
            Rental Information
          </h4>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your bookings by adding new ones or editing existing
              bookings. Click on any date to add a new booking or click on an
              existing booking to edit it.
            </p>
          </div>
          <div className="mt-3">
            <div>
              <div className="hidden">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Vehicle ID
                </label>
                <input
                  id="event-id"
                  type="text"
                  value={bookingDetails?.id}
                  disabled
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
              <div className="mt-2 mb-4">
                <img
                  className="h-45 w-full rounded-lg object-cover"
                  src={bookingDetails?.vehicleDetails?.image_url}
                  alt={bookingDetails?.vehicleDetails?.make}
                />
              </div>
              <div className="">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Vehicle Name
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={
                    (profile.role !== "Client" &&
                      bookingDetails?.vehicleDetails?.license_plate + ": ") +
                    bookingDetails?.vehicleDetails?.year +
                    " " +
                    bookingDetails?.vehicleDetails?.make +
                    " " +
                    bookingDetails?.vehicleDetails?.model
                  }
                  disabled
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
            </div>
            {profile.role !== "Client" && (
              <div className="mt-6">
                <label className="mb-4 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Booking Priority
                </label>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  {Object.entries(calendarsEvents).map(([key, value]) => (
                    <div key={key} className="n-chk">
                      <div
                        className={`form-check form-check-${value} form-check-inline`}
                      >
                        <label
                          className="form-check-label flex items-center text-sm text-gray-700 dark:text-gray-400"
                          htmlFor={`modal${key}`}
                        >
                          <span className="relative">
                            <input
                              className="form-check-input sr-only"
                              type="radio"
                              name="event-level"
                              value={key}
                              id={`modal${key}`}
                              readOnly
                              checked={bookingDetails.priority === key}
                            />
                            <span className="box mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 dark:border-gray-700">
                              <span
                                className={`h-2 w-2 rounded-full bg-white ${
                                  bookingDetails.priority === key
                                    ? "block"
                                    : "hidden"
                                }`}
                              ></span>
                            </span>
                          </span>
                          {key}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    id="event-start-date"
                    disabled
                    type="date"
                    value={formatDateToLocal(eventStartDate)}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 col-8 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 pl-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <CalenderIcon />
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <div className="relative">
                  <Input
                    type="time"
                    id="start-time"
                    value={bookingDetails.rental_time}
                    disabled
                    name="start-time"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <TimeIcon />
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  End Date
                </label>
                <div className="relative">
                  <input
                    id="event-end-date"
                    type="date"
                    disabled
                    value={formatDateToLocal(bookingDetails.rental_end)}
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 col-8 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 pl-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <CalenderIcon />
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="end-time">End Time</Label>
                <div className="relative">
                  <Input
                    type="time"
                    id="end-time"
                    value={bookingDetails.rental_time}
                    name="end-time"
                    disabled
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <TimeIcon />
                  </span>
                </div>
              </div>
              {bookingDetails?.id && (
                <div className="text-sm text-green-500">
                  Rental period set at a minimum of{" "}
                  {bookingDetails?.vehicleDetails?.min_rental_days} Days
                </div>
              )}
            </div>

            {/* <div>
            
              <label className="mb-1.5 mt-3 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Extend Booking
              </label>
            <div className="flex items-center gap-2 mt-2">              
               {[1,2,3,4,5].map((day) => (
                <Button size="sm" variant="success-outline" key={day} onClick={()=> {
                  // add days to end date 
                  setEventEndDate(new Date(new Date(eventEndDate).getTime() + day * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                }}>
                  <PlusIcon />
                  {day} Day{day > 1 ? 's' : ''}
                </Button>
              ))}
            </div>
          </div> */}
          </div>
          <div className="rounded-3 mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h4 className="modal-title text-theme-xl mb-2 font-semibold text-gray-800 lg:text-xl dark:text-white/90">
              Renter Details
            </h4>
          </div>
          <div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Renter Name
              </label>
              <input
                id="renter-name"
                type="text"
                value={bookingDetails?.renter_name}
                readOnly
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Renter ID
              </label>
              <input
                id="renter-id"
                type="text"
                value={bookingDetails?.renter_id}
                readOnly
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Renter Phone
              </label>
              <input
                id="renter-phone"
                type="text"
                value={bookingDetails?.renter_phone}
                readOnly
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>
            {bookingDetails?.id && (
              <div
                className={`ms-auto mt-5 flex ${bookingDetails?.booking_status.toLowerCase() === "reserved" && new Date().getTime() > new Date(bookingDetails.created_at).getTime() + 30 * 60 * 1000 ? "bg-red-200 dark:bg-red-800/30" : "bg-green-200 dark:bg-green-800/30"} top-0 col-span-12 mb-5 w-full flex-col gap-2 rounded-2xl lg:col-span-3`}
              >
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
                      {bookingDetails?.rental_days} Days
                    </div>

                    {/* Row 2 */}
                    <div className="text-left text-gray-500 dark:text-gray-400">
                      Daily Rate
                    </div>
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                    <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                      Ksh.{" "}
                      {bookingDetails?.vehicleDetails?.daily_rate?.toLocaleString()}
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
                      Ksh. {200}
                    </div>

                    {/* Row 5 */}
                    <div className="text-left text-gray-500 dark:text-gray-400">
                      VAT 16%
                    </div>
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                    <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                      Ksh.{" "}
                      {(
                        bookingDetails?.vehicleDetails?.daily_rate *
                        bookingDetails?.rental_days *
                        0.16
                      ).toLocaleString()}
                    </div>

                    {/* Horizontal Divider Span across all 3 columns */}
                    <div className="col-span-3 my-1 border-t border-gray-200 dark:border-gray-800" />

                    {/* Grand Total Row */}
                    <div className="text-left font-bold text-gray-800 dark:text-gray-100">
                      Total
                    </div>
                    <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />
                    <div
                      className={`text-right text-base font-bold ${bookingDetails?.booking_status.toLowerCase() === "reserved" && new Date().getTime() > new Date(bookingDetails.created_at).getTime() + 30 * 60 * 1000 ? "text-red-600 dark:text-red-500" : "text-green-600 dark:text-green-500"}`}
                    >
                      Ksh. {bookingDetails?.total?.toLocaleString() || 0}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className={`p-5 text-center tracking-[0.2em] uppercase ${bookingDetails?.booking_status.toLowerCase() === "reserved" && new Date().getTime() > new Date(bookingDetails.created_at).getTime() + 30 * 60 * 1000 ? "text-red-500" : "text-brand-500"}`}
          >
            payment method:{" "}
            {bookingDetails?.booking_status.toLowerCase() === "reserved" &&
            new Date().getTime() >
              new Date(bookingDetails.created_at).getTime() + 30 * 60 * 1000
              ? "NOT PAID"
              : bookingDetails.payment_method}
          </div>

          <div className="modal-footer mt-6 flex items-center gap-3 sm:justify-end">
            <Link href={"#download"}>
              <Button size="sm" variant="success-outline">
                <DownloadIcon /> Print Receipt
              </Button>
            </Link>
            <Link
              className={`${isReserved && "hidden"}`}
              href={"/bookings/" + bookingDetails?.id + "/edit"}
            >
              <Button variant="primary" size="sm">
                Manage Booking <PencilIcon />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-6">
          <CircularProgress color="primary" size={30} />

          <h4 className="modal-title text-theme-xl mt-3 mb-0 font-semibold text-gray-800 lg:text-xl dark:text-white/90">
            Opps! That booking could not be found.
          </h4>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Geting booking's details! Please bear with us for a moment ...
          </p>
        </div>
      )}
    </div>
  );
}
