"use client";
import React, { useEffect, useRef, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { EventInput } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import { CalenderIcon, ChevronDownIcon, CloseLineIcon, ErrorIcon, PlusIcon, TimeIcon } from "@/icons";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { CalendarWrapper } from "../calendar/CalendarWrapper";
import { toast } from "sonner";
import { useBooking } from "@/context/BookingContext";
import { useFleet } from "@/context/FleetContext";



interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    registration?: string;
    renter?: string;
    renterID?: string;
  };
}
const calendarsEvents = {
  'High Priority': "success",
  'Medium Priority': "primary",
  'Low Priority': "warning",
};

const getNumberOfDays = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));


  return days;
};

// Extract only booking properties (remove merged vehicle data)
const extractBookingOnly = (booking: any) => ({
  id: booking.id,
  vehicleId: booking.vehicleId,
  renterName: booking.renterName,
  renterPhone: booking.renterPhone,
  renterID: booking.renterID,
  pickupLocation: booking.pickupLocation,
  dropoffLocation: booking.dropoffLocation,
  rentalStart: booking.rentalStart,
  rentalEnd: booking.rentalEnd,
  rentalDays: booking.rentalDays,
  discount: booking.discount,
  total: booking.total,
  status: booking.status,
  priority: booking.priority,
});


export default function EditBookingForm({ id: bookingID }: { id: number }) {
  const { bookings } = useBooking();
  const { vehicles: VehicleData } = useFleet();
  const [allBookings, setAllBookings] = useState<any[]>([...bookings]);
  const [bookingName, setBookingName] = useState("");
  const [eventStartDate, setEventStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [eventStartTime, setEventStartTime] = useState("10:00");
  const [eventEndDate, setEventEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]);
  const [eventEndTime, setEventEndTime] = useState("10:00");
  const [eventDays, setEventDays] = useState(0);
  const [minDays, setMinDays] = useState(1);
  const [eventLevel, setEventLevel] = useState("");
  const calendarRef = useRef<FullCalendar>(null);
  const [renterName, setRenterName] = useState('');
  const [renterID, setRenterID] = useState('');
  const [renterPhone, setRenterPhone] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [updatingBooking, setUpdatingBooking] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);



  const getTotalAmount = (vehicleId: number, endDate: string, startDate: string) => {
    const days = getNumberOfDays(startDate, endDate);
    const vehicle = VehicleData.find((v) => v.id === vehicleId);
    const Total = (days * (vehicle ? vehicle.dailyRate : 0));

    return Number(Total);
  };

  const getBookingDetails = (id: number) => {
    // Search by 'id', not 'vehicleId'
    const booking = allBookings.find((b) => b.id === id);

    // Use the vehicleId found inside that booking to get vehicle rates
    const vehicle = VehicleData.find((v) => v.id === booking?.vehicleId);

    return {
      days: Number(booking?.rentalDays) || 0,
      dailyRate: vehicle?.dailyRate || 0,
      totalAmount: Number(booking?.total || 0),
      vehicleID: booking?.vehicleId,
      rentalEnd: booking?.rentalEnd,
      rentalStart: booking?.rentalStart,
    };
  };

  // 1. HYDRATION EFFECT: Runs ONLY when the active booking ID changes
  useEffect(() => {
    if (!bookingID) return;

    const vehicleID = getBookingDetails(bookingID).vehicleID;
    const bookingDetailsDraft = allBookings.find(b => b.id === bookingID);
    const vehicle = VehicleData.find(v => v.id === vehicleID);
    const minimum = VehicleData.find((vehicle) => vehicle.id === bookingID)?.minRentalDays || 1;

    if (!bookingDetailsDraft) return;

    const hydratedBooking = { ...vehicle, ...bookingDetailsDraft };

    setMinDays(minimum);
    setBookingName(
      hydratedBooking.licensePlate + ': ' + hydratedBooking.year + ' ' + hydratedBooking.make + ' ' + hydratedBooking.model
    );

    setEventLevel(hydratedBooking.priority);
    setEventStartDate(hydratedBooking.rentalStart);
    setEventEndDate(hydratedBooking.rentalEnd);
    setEventStartTime(hydratedBooking.rentalTime);
    setEventEndTime(hydratedBooking.rentalTime);
    setRenterID(hydratedBooking.renterID);
    setRenterName(hydratedBooking.renterName);
    setRenterPhone(hydratedBooking.renterPhone);

  }, [bookingID]); // 🚀 FIXED: Removed eventStartDate and eventEndDate from here


  // 2. CALCULATION EFFECT: Keeps eventDays automatically synced with user selections
  useEffect(() => {
    if (eventStartDate && eventEndDate) {
      setEventDays(getNumberOfDays(eventStartDate, eventEndDate));
    }
  }, [eventStartDate, eventEndDate]); // 🚀 FIXED: Listens to both changes now


  const getVehicleDetails = (id: number) => {
    // Search by 'id'
    const vehicle = VehicleData.find((b) => b.id === id);

    return {
      dailyRate: vehicle?.dailyRate || 0,
      vehicleID: vehicle?.id,
      status: vehicle?.status,
      minDays: vehicle?.minRentalDays || 1,
    };
  };






  const handleAddOrUpdateEvent = () => {

    if (getVehicleDetails(getBookingDetails(bookingID)?.vehicleID).status === "Not Available") {
      toast.error("This vehicle is currently not available for renting YET. Go to vehicles and set is as available or inform renter of when it will be available again!")
      return;
    }
    if (bookingID) {
      setUpdatingBooking(true);


      if ((getTotalAmount(getBookingDetails(bookingID)?.vehicleID, eventEndDate, eventStartDate)) > (getBookingDetails(bookingID)?.totalAmount)) {
        setProcessingPayment(true);
        // simulate a payment of the extra amount
        setTimeout(() => {
          setProcessingPayment(false);
          setPaymentSuccess(true)
          // update bookings data with new end date and total amount 
          setAllBookings((prevData) => prevData.map((booking) => {
            if (booking.id === bookingID) {
              return {
                ...booking,
                rentalEnd: eventEndDate,
                rentalDays: getNumberOfDays(eventStartDate, eventEndDate),
                total: getTotalAmount(getBookingDetails(bookingID)?.vehicleID, eventEndDate, eventStartDate)
              };
            }
            return booking;
          }));



          setTimeout(() => {
            setPaymentSuccess(false);
            setUpdatingBooking(false);
            toast.success("Booking updated successfully! New booking ends on " + eventEndDate + " at " + eventEndTime)
          }, 3000);
        }, 5000);
      } else {
        setTimeout(() => {
          toast.success("Booking updated successfully! Booking ends on " + eventEndDate + " at " + eventEndTime)
          setUpdatingBooking(false);
        }, 1000);
      }
    };
  }


  // Helper to format Date object to YYYY-MM-DD (Local Time)
  const formatDateToLocal = (dateStr: any) => {
    if (!dateStr) return '';

    // Create a date object. If it's all day, we treat it as local midnight.
    // FullCalendar often passes '2026-05-13' which might be parsed as UTC.
    // We force it to be interpreted as local time by appending 'T00:00:00' 
    // and then extracting the local parts.
    const date = new Date(dateStr);

    // If the date is invalid, return empty
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  // Helper to format Date object to YYYY-MM-DD (Local Time)


  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      {bookingName ?
        <div className="flex flex-col px-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your bookings by adding new ones or editing existing bookings. Click on any date to add a new booking or click on an existing booking to edit it.
            </p>
          </div>


          <h4 className="mb-0 mt-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-xl">
            Rental Information
          </h4>

          <div className="mt-3">
            <div>
              <div className="hidden">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Vehicle ID
                </label>
                <input
                  id="event-id"
                  type="text"
                  value={bookingID}
                  disabled
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div className="">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Vehicle Name
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={bookingName}
                  disabled
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                Booking Priority
              </label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {Object.entries(calendarsEvents).map(([key, value]) => (
                  <div key={key} className="n-chk">
                    <div
                      className={`form-check form-check-${value} form-check-inline`}
                    >
                      <label
                        className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                        htmlFor={`modal${key}`}
                      >
                        <span className="relative">
                          <input
                            className="sr-only form-check-input"
                            type="radio"
                            name="event-level"
                            value={key}
                            id={`modal${key}`}
                            checked={eventLevel === key}
                            onChange={() => setEventLevel(key)}
                          />
                          <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                            <span
                              className={`h-2 w-2 rounded-full bg-white ${eventLevel === key ? "block" : "hidden"
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


            {/* Calendar Section: col-span-5 */}
            <div className="mt-7 bg-white dark:bg-gray-900 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white">Service Schedule</h3>
              <CalendarWrapper isMarkedUnavailable={getVehicleDetails(getBookingDetails(bookingID)?.vehicleID)?.status === "Not Available"} dateString={new Date().toISOString().split('T')[0]} vehicleId={(getBookingDetails(bookingID)?.vehicleID)} />
            </div>

            {
              getVehicleDetails(getBookingDetails(bookingID)?.vehicleID).status === "Not Available" && (

                <div className="text-sm flex mt-8 gap-2 items-center dark:bg-red-500/12 rounded text-red-500 p-3 border-gray-500 dark:border-red-500">
                  <ErrorIcon className="w-auto" /> <div className="w-full">
                    This vehicle is currently not available for renting YET. Go to vehicles and set is as available or inform renter of when it will be available again!
                  </div>
                </div>
              )
            }
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter Start Date
                </label>
                <div className="relative">
                  <input
                    id="event-start-date"
                    disabled
                    type="date"
                    value={formatDateToLocal(eventStartDate)}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="dark:bg-dark-900 col-8 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
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
                    value={eventStartTime}
                    disabled
                    onChange={(e) => {
                      setEventStartTime(e.target.value);
                      setEventEndTime(e.target.value);
                    }}
                    name="start-time"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <TimeIcon />
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter End Date
                </label>
                <div className="relative">
                  <input
                    id="event-end-date"
                    type="date"
                    value={(eventEndDate)}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="dark:bg-dark-900 col-8 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
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
                    value={eventEndTime}
                    name="end-time"
                    disabled
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <TimeIcon />
                  </span>
                </div>
              </div>
            </div>

            <div>

              <label className="mb-1.5 mt-3 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Extend Booking
              </label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((day) => (
                  <Button size="sm" variant="success-outline" key={day} onClick={() => {
                    // add days to end date 
                    setEventEndDate(new Date(new Date(eventEndDate).getTime() + day * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                  }}>
                    <PlusIcon />
                    {day} Day{day > 1 ? 's' : ''}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 border-t rounded-3 border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-xl">
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
                value={renterName}
                readOnly
                onChange={(e) => setRenterName(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Renter ID
              </label>
              <input
                id="renter-id"
                type="text"
                value={renterID}
                readOnly
                onChange={(e) => setRenterID(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Renter Phone
              </label>
              <input
                id="renter-phone"
                type="text"
                value={renterPhone}
                onChange={(e) => setRenterPhone(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
            {
              bookingID && (
                <div className="flex gap-2 flex-col items-end border-t mt-6">
                  <h4 className="mt-4 font-semibold text-gray-800 modal-title text-theme-l dark:text-white/90 lg:text-l">
                    Booking Summary:</h4>
                  <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/30">
                    <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Extension Cost Breakdown</h3>

                    {/* Grid Wrapper */}
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-3 text-sm items-center">

                      {/* Row 1: Booked Days */}
                      <div className="text-left text-gray-500 dark:text-gray-400">Booked Days</div>
                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                      <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                        {getNumberOfDays(getBookingDetails(bookingID)?.rentalStart, getBookingDetails(bookingID)?.rentalEnd)} Days
                      </div>

                      {/* Row 2: Extension Days */}
                      <div className="text-left text-gray-500 dark:text-gray-400">Extension Period</div>
                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                      <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                        {eventDays - Number(getBookingDetails(bookingID)?.days || 0)} Days
                      </div>

                      {/* Row 3: Daily Rate */}
                      <div className="text-left text-gray-500 dark:text-gray-400">Daily Rate</div>
                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                      <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                        Ksh. {getBookingDetails(bookingID)?.dailyRate?.toLocaleString() || "0"}
                      </div>

                      {/* Row 4: Base Paid Amount */}
                      <div className="text-left text-gray-500 dark:text-gray-400">Original Amount Paid</div>
                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                      <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                        Ksh. {getBookingDetails(bookingID)?.totalAmount?.toLocaleString() || "0"}
                      </div>

                      {/* Horizontal Divider Span across all 3 columns */}
                      <div className="col-span-3 border-t border-gray-200 my-1 dark:border-gray-800" />

                      {/* Grand Total Row: Net Payable Difference */}
                      <div className="text-left font-bold text-gray-800 dark:text-gray-100">Total Payable</div>
                      <div className="w-px h-5 bg-gray-300 dark:bg-gray-700" />
                      <div className="text-right text-base font-bold text-green-600 dark:text-green-500">
                        Ksh. {
                          ((getTotalAmount(getBookingDetails(bookingID)?.vehicleID, eventEndDate, eventStartDate) || 0) -
                            (getBookingDetails(bookingID)?.totalAmount || 0)).toLocaleString()
                        }
                      </div>

                    </div>
                  </div>
                </div>

              )
            }
          </div>

          <div style={{ minHeight: '8.5rem', position: 'relative' }}>
            {processingPayment && (<div className="animate-pulse flex items-center gap-3 p-2 py-3 mt-6 border rounded-md border-blue-400 bg-blue-500/10">
              <div className="p-2">
                <AccessTimeIcon fontSize="large" color="primary" />
              </div>
              <div>

                <h5 className="text-blue-500"><strong>Processing Payment!</strong></h5>

                {/* This is where the payment processing component will go. For now, it's just a placeholder. */}
                <div className="text-sm mt-1 text-blue-300 dark:text-blue-200">
                  <p> A payment request will be sent to the renter's phone number ({renterPhone}) upon booking confirmation. The booking will be finalized once the payment is successfully processed.
                  </p></div>
              </div>

            </div>)}


            {paymentSuccess && (
              <div className="flex items-center gap-3 p-2 py-3 mt-6 border rounded-md border-green-400 bg-green-500/10">
                <div className="p-2 text-green-500">
                  <TaskAltIcon fontSize="large" />
                </div>
                <div>

                  <h5 className="text-green-500"><strong>Payment Success!</strong></h5>

                  {/* This is where the payment processing component will go. For now, it's just a placeholder. */}
                  <div className="text-sm mt-1 text-green-300 dark:text-green-200">
                    <p>
                      Payment has been successfully processed. The booking is now confirmed and will appear on the calendar. An SMS confirmation will be sent to the renter's phone number ({renterPhone}) with the booking details and receipt.
                    </p></div>
                </div>

              </div>)}


          </div>



          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <Link href={'/bookings/' + bookingID}> <button
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 sm:w-auto"
            >
              Back to Booking
            </button></Link>
            <Link href={'#cancel'}><Button size="sm" variant="danger-outline"><CloseLineIcon /> Cancel Booking</Button></Link>


            <button
              onClick={handleAddOrUpdateEvent}
              disabled={!bookingName || !eventStartDate || !eventEndDate || !eventLevel || !renterName || !renterID || !renterPhone || (eventDays < minDays || processingPayment || updatingBooking || disableButton)}
              type="button"
              style={{ cursor: !bookingName || !eventStartDate || !eventEndDate || !eventLevel || !renterName || !renterID || !renterPhone || (eventDays < minDays || processingPayment || updatingBooking || disableButton) ? 'not-allowed' : 'pointer' }}
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              Update Booking
            </button>
          </div>
        </div> : <div className="py-6 flex flex-col items-center">
          <CircularProgress color="primary" size={30} />

          <h4 className="mb-0 mt-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-xl">
            Just a moment!
          </h4>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Geting booking's details! Please bear with us for a moment ...
          </p>
        </div>}
    </div>
  );
}
