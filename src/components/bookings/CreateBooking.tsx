"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { EventInput } from "@fullcalendar/core/index.js";
import Select from "../form/Select";
import FullCalendar from "@fullcalendar/react";
import { CalenderIcon, ChevronDownIcon, ErrorIcon, PlusIcon, TimeIcon } from "@/icons";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { CalendarWrapper } from "../calendar/CalendarWrapper";
import dayjs from "dayjs";
import { toast } from "sonner";
import Link from "next/link";
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
  const days = Math.max(0, ((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
  // count complete days only

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


export default function CreateNewBookingForm() {
  const { bookings } = useBooking();
  const { vehicles: VehicleData } = useFleet();
  const [allBookings, setAllBookings] = useState<any[]>([...bookings]);
  const [bookingName, setBookingName] = useState("");
  const [selectedVehicleID, setSelectedVehicleID] = useState<number>(0);
  const [eventStartDate, setEventStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [eventStartTime, setEventStartTime] = useState("10:00");
  const [eventEndDate, setEventEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]);
  const [eventEndTime, setEventEndTime] = useState("10:00");
  const [eventDays, setEventDays] = useState(0);
  const [minDays, setMinDays] = useState(1);
  const [eventLevel, setEventLevel] = useState("");
  const calendarRef = useRef<FullCalendar>(null);
  const [renterName, setRenterName] = useState('Austine Otieno');
  const [renterID, setRenterID] = useState('12345678');
  const [renterPhone, setRenterPhone] = useState('0768927617');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [updatingBooking, setUpdatingBooking] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);


  const getTotalAmount = (vehicleId: number, endDate: string, startDate: string) => {
    const days = getNumberOfDays(startDate, endDate);
    const vehicle = VehicleData.find((v) => v.id === vehicleId);
    const Total = (days * (vehicle ? vehicle.dailyRate : 0));

    return Number(Total);
  };


  useEffect(() => {
    const days = Math.max(0, ((new Date(eventEndDate).getTime() - new Date(eventStartDate).getTime()) / (1000 * 3600 * 24)));
    const minimum = VehicleData.find((vehicle) => vehicle.id === (selectedVehicleID))?.minRentalDays || 1;

    setEventDays(days);
    setMinDays(minimum);
  }, [eventStartDate, eventEndDate, selectedVehicleID]);

  const selectVehicleOptions = [
    // get all vehicles and render their names i.e year make model as label and id as value from VehicleData
    ...VehicleData.map((vehicle) => ({
      value: vehicle.id.toString(),
      label: `${vehicle.licensePlate}: ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    })),
  ];
  const handleSelectChange = (value: string) => {
    setSelectedVehicleID(parseInt(value));
    setBookingName(
      // find vehicle in list using id and merge tits Yesteryear, make, model
      VehicleData.find((vehicle) => vehicle.id === parseInt(value))?.year && VehicleData.find((vehicle) => vehicle.id === parseInt(value))?.make && VehicleData.find((vehicle) => vehicle.id === parseInt(value))?.model ? `${VehicleData.find((vehicle) => vehicle.id === parseInt(value))?.year} ${VehicleData.find((vehicle) => vehicle.id === parseInt(value))?.make} ${VehicleData.find((vehicle) => vehicle.id === parseInt(value))?.model}` : ""
    );
  };

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

  useEffect(() => {
    if (getVehicleDetails(selectedVehicleID)?.status === "Not Available") {
      setNotAvailable(true)
    } else {
      setNotAvailable(false)
    }
  }, [selectedVehicleID])


  const handleAddOrUpdateEvent = () => {
    setProcessingPayment(true);
    setDisableButton(true);
    // add to bookings data with new booking details and total amount 
    // Add new booking
    const newBooking = {
      id: Math.floor(Math.random() * 1000) + 200, // Random ID for demo
      vehicleId: selectedVehicleID,
      renterName: renterName,
      renterPhone: renterPhone,
      renterID: renterID,
      pickupLocation: "Nairobi Depot",
      dropoffLocation: "Nairobi Depot",
      rentalStart: eventStartDate,
      rentalEnd: eventEndDate,
      rentalDays: getNumberOfDays(eventStartDate, eventEndDate),
      discount: 0,
      total: getTotalAmount(selectedVehicleID, eventEndDate, eventStartDate),
      status: "Reserved",
      priority: eventLevel,
    };
    setAllBookings((prevData) => [...prevData, { ...newBooking, ...VehicleData.find(v => v.id === selectedVehicleID), vehicleId: selectedVehicleID, id: newBooking.id }]);



    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);

      if (renterPhone) {
        // Simulate sending SMS confirmation
        setTimeout(() => {
          setPaymentSuccess(false);
          toast(`SMS confirmation sent to ${renterPhone} with booking details and receipt.`)
          setDisableButton(false);

          window.location.href = "/bookings"; // Redirect to bookings view after processing
        }, 5000);
      }
    }, 5000);
  };

  const BUFFER_HOURS = 2;

  // 1. Process existing bookings by stitching date and time strings together directly
  const existingBookingsIntervals = useMemo(() => {
    return bookings
      .filter((b) => b.vehicleId === selectedVehicleID)
      .map((booking) => {
        // Merges "2026-06-01" and "12:30" into "2026-06-01T12:30:00"
        const startDateTimeStr = `${booking.rentalStart}T${booking.rentalTime}:00`;
        const endDateTimeStr = `${booking.rentalEnd}T${booking.rentalTime}:00`;

        return {
          id: booking.id,
          start: dayjs(startDateTimeStr),
          end: dayjs(endDateTimeStr),
        };
      });
  }, [bookings, selectedVehicleID]);

  // 2. Process current form selection (assumes eventStartDate/EndDate are 'YYYY-MM-DD' and selectedTime is 'HH:mm')
  const currentSelectionInterval = useMemo(() => {
    if (!eventStartDate || !eventEndDate || !eventStartTime) return null;

    const newStartStr = `${eventStartDate}T${eventStartTime}:00`;
    const newEndStr = `${eventEndDate}T${eventStartTime}:00`;

    return {
      start: dayjs(newStartStr),
      end: dayjs(newEndStr),
    };
  }, [eventStartDate, eventEndDate, eventStartTime]);

  // 3. Run the overlap validation check
  const isSelectionOverlapping = useMemo(() => {
    if (!currentSelectionInterval) return false;

    const { start: newStart, end: newEnd } = currentSelectionInterval;

    return existingBookingsIntervals.some((existing) => {
      // Add the 2-hour buffer directly to the math
      const existingEndWithBuffer = existing.end.add(BUFFER_HOURS, 'hour');
      const existingStartWithBuffer = existing.start.subtract(BUFFER_HOURS, 'hour');

      // Overlap math: Checks if the intervals collide factoring in the buffer
      const overlaps =
        (newStart.isBefore(existingEndWithBuffer) && newEnd.isAfter(existing.start)) ||
        (newEnd.isAfter(existingStartWithBuffer) && newStart.isBefore(existing.end));

      if (overlaps) {
        console.log(`[Overlap Found] Vehicle ID: ${selectedVehicleID}`);
        console.log(`Existing Booking #${existing.id}: ${existing.start.format('YYYY-MM-DD HH:mm')} to ${existing.end.format('YYYY-MM-DD HH:mm')}`);
        console.log(`Your Selection: ${newStart.format('YYYY-MM-DD HH:mm')} to ${newEnd.format('YYYY-MM-DD HH:mm')}`);
      }

      return overlaps;
    });
  }, [currentSelectionInterval, existingBookingsIntervals, selectedVehicleID]);




  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">

      <div className="flex flex-col px-2">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your bookings by adding new ones. Click on any date to add a new booking or click on an existing booking to edit it.
          </p>
        </div>


        <h4 className="mb-0 mt-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-xl">
          Rental Information
        </h4>

        <div className="mt-3">
          <div>
            {<div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Select Vehicle
              </label>
              <div className="relative">
                <Select
                  options={selectVehicleOptions}
                  placeholder="Select an option"
                  onChange={handleSelectChange}
                  className="dark:bg-dark-900"
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>}
            <div className="hidden">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Vehicle ID
              </label>
              <input
                id="event-id"
                type="text"
                value={selectedVehicleID}
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
            <CalendarWrapper isMarkedUnavailable={getVehicleDetails(selectedVehicleID)?.status === "Not Available"} dateString={new Date().toISOString().split('T')[0]} vehicleId={(selectedVehicleID)} />
          </div>



          {
            getVehicleDetails(selectedVehicleID)?.status === "Not Available" && (

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
                  type="date"
                  value={eventStartDate}
                  disabled={notAvailable}
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
                  disabled={notAvailable}
                  value={eventStartTime}
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
                  disabled={notAvailable}
                  value={eventEndDate}
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
                  disabled={notAvailable}
                  name="end-time"
                  onChange={(e) => {
                    setEventStartTime(e.target.value);
                    setEventEndTime(e.target.value);
                  }}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <TimeIcon />
                </span>
              </div>
            </div>

            {!notAvailable && (eventDays < getVehicleDetails(selectedVehicleID)?.minDays) && (
              <div className="text-sm text-red-500">
                Please select a minimum of {minDays} Days
              </div>
            )}
          </div>
          {isSelectionOverlapping && (
            <div className="text-sm text-red-500 mt-4">
              The date and time you entered overlaps with an existing booking. Please check the time ensuring a buffer time of {BUFFER_HOURS} Hrs is allowed before or after a rental <Link className="text-blue-500 underline" href={'/preferences'}>Click Here</Link> to change burrer time.
            </div>
          )}
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
              disabled={notAvailable}
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
              disabled={notAvailable}
              type="text"
              value={renterID}
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
              disabled={notAvailable}
              type="text"
              value={renterPhone}
              onChange={(e) => setRenterPhone(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          {
            selectedVehicleID && (
              <div className="flex gap-2 flex-col items-end border-t mt-6">
                <h4 className="mt-4 font-semibold text-gray-800 modal-title text-theme-l dark:text-white/90 lg:text-l">
                  Booking Summary:</h4>
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/30">
                  <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Cost Breakdown</h3>

                  {/* Grid Wrapper */}
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-3 text-sm items-center">

                    {/* Row 1 */}
                    <div className="text-left text-gray-500 dark:text-gray-400">Duration</div>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                    <div className="text-right font-medium text-gray-800 dark:text-gray-200">{eventDays} Days</div>

                    {/* Row 2 */}
                    <div className="text-left text-gray-500 dark:text-gray-400">Daily Rate</div>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                    <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                      Ksh. {getVehicleDetails(selectedVehicleID).dailyRate.toLocaleString()}
                    </div>

                    {/* Row 3 */}
                    <div className="text-left text-gray-500 dark:text-gray-400">Delivery + Pickup fee</div>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                    <div className="text-right font-medium text-gray-800 dark:text-gray-200">Ksh. 0</div>

                    {/* Row 4 */}
                    <div className="text-left text-gray-500 dark:text-gray-400">Rescue Plan</div>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                    <div className="text-right font-medium text-gray-800 dark:text-gray-200">Ksh. 200</div>

                    {/* Row 5 */}
                    <div className="text-left text-gray-500 dark:text-gray-400">VAT 16%</div>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                    <div className="text-right font-medium text-gray-800 dark:text-gray-200">Ksh. 0</div>

                    {/* Horizontal Divider Span across all 3 columns */}
                    <div className="col-span-3 border-t border-gray-200 my-1 dark:border-gray-800" />

                    {/* Grand Total Row */}
                    <div className="text-left font-bold text-gray-800 dark:text-gray-100">Customer Total</div>
                    <div className="w-px h-5 bg-gray-300 dark:bg-gray-700" />
                    <div className="text-right text-base font-bold text-green-600 dark:text-green-500">
                      Ksh. {getTotalAmount(selectedVehicleID, eventEndDate, eventStartDate).toLocaleString()}
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
          {/* go back to bookings view  */}
          <button
            type="button"
            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleAddOrUpdateEvent}
            disabled={!bookingName || !eventStartDate || !eventEndDate || !eventLevel || !renterName || !renterID || !renterPhone || (eventDays < minDays || processingPayment || updatingBooking || disableButton || notAvailable || isSelectionOverlapping)}
            type="button"
            style={{ cursor: !bookingName || !eventStartDate || !eventEndDate || !eventLevel || !renterName || !renterID || !renterPhone || (eventDays < minDays || processingPayment || updatingBooking || disableButton || notAvailable || isSelectionOverlapping) ? 'not-allowed' : 'pointer' }}
            className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
          >
            {"Create Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
