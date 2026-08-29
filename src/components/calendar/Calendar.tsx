"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import {
  CalenderIcon,
  ChevronDownIcon,
  ErrorIcon,
  PlusIcon,
  TimeIcon,
} from "@/icons";
import Select from "../form/Select";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Button from "../ui/button/Button";
import { toast, Toaster } from "sonner";
import dayjs from "dayjs";
import Link from "next/link";
import { useAdminFleet } from "@/context/AdminFleetContext";
import { useAdminBooking } from "@/context/AdminBookingContext";
import { AdminCalendarWrapper } from "./AdminCalendarWrapper";
import CachedIcon from "@mui/icons-material/Cached";

const BUFFER_HOURS = 2;

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    registration?: string;
    renter?: string;
    renterID?: string;
    renterPhone?: string;
    bookingDbId?: number;
    rentalTime?: string;
  };
}

const getNumberOfDays = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
  );
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

const Calendar: React.FC = () => {
  const { bookings, reloadBookings } = useAdminBooking();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const { vehicles, loading } = useAdminFleet();
  const [bookingName, setBookingName] = useState("");
  const [bookingID, setBookingID] = useState(0);
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("10:00");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventEndTime, setEventEndTime] = useState("10:00");
  const [eventDays, setEventDays] = useState(0);
  const [minDays, setMinDays] = useState(1);
  const [eventLevel, setEventLevel] = useState("");
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [renterName, setRenterName] = useState("Austine Otieno");
  const [renterID, setRenterID] = useState("12345678");
  const [renterPhone, setRenterPhone] = useState("0768927617");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [updatingBooking, setUpdatingBooking] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const getVehicleDetails = (id: number) => {
    // Search by 'id'
    const vehicle = vehicles.find((b) => b.id === id);

    return {
      dailyRate: vehicle?.daily_rate || 0,
      vehicleID: vehicle?.id,
      status: vehicle?.status,
      minDays: vehicle?.minRental_days || 1,
    };
  };

  const getTotalAmount = (
    vehicleId: number,
    endDate: string,
    startDate: string,
  ) => {
    const days = getNumberOfDays(startDate, endDate);
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    const Total = days * (vehicle ? vehicle.daily_rate : 0);

    return Number(Total);
  };

  const getBookingDetails = (id: number) => {
    // Search by 'id', not 'vehicleId'
    const booking = bookings.find((b) => b.id === id);

    // Use the vehicleId found inside that booking to get vehicle rates
    const vehicle = vehicles.find((v) => v.id === booking?.vehicleId);

    return {
      days: booking?.rental_days || 0,
      dailyRate: vehicle?.daily_rate || 0,
      totalAmount: Number(booking?.total || 0),
      vehicleID: booking?.vehicleId,
    };
  };

  useEffect(() => {
    const days = Math.ceil(
      (new Date(eventEndDate).getTime() - new Date(eventStartDate).getTime()) /
      (1000 * 3600 * 24),
    );
    const minimum =
      vehicles.find((vehicle) => vehicle.id === bookingID)?.minRentalDays || 1;

    setEventDays(days);
    setMinDays(minimum);
  }, [eventStartDate, eventEndDate, bookingID]);

  const selectVehicleOptions = [
    // get all vehicles and render their names i.e year make model as label and id as value from vehicles
    ...vehicles?.map((vehicle) => ({
      value: vehicle.id.toString(),
      label: `${vehicle.licensePlate}: ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    })),
  ];
  const handleSelectChange = (value: string) => {
    setBookingID(parseInt(value));
    setBookingName(
      // find vehicle in list using id and merge tits Yesteryear, make, model
      vehicles?.find((vehicle) => vehicle.id === parseInt(value))?.year &&
        vehicles.find((vehicle) => vehicle.id === parseInt(value))?.make &&
        vehicles.find((vehicle) => vehicle.id === parseInt(value))?.model
        ? `${vehicles.find((vehicle) => vehicle.id === parseInt(value))?.year} ${vehicles.find((vehicle) => vehicle.id === parseInt(value))?.make} ${vehicles.find((vehicle) => vehicle.id === parseInt(value))?.model}`
        : "",
    );
  };

  const calendarsEvents = {
    "High Priority": "success",
    "Medium Priority": "primary",
    "Low Priority": "warning",
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      console.log({
        rentalStart: eventStartDate,
        rentalEnd: eventEndDate,
        priority: eventLevel,
        renterPhone: renterPhone,
        rentalDays: getNumberOfDays(eventStartDate, eventEndDate),
        total: getTotalAmount(
          getBookingDetails(bookingID)?.vehicleID,
          eventEndDate,
          eventStartDate,
        ),
      });
      // return;
      setUpdatingBooking(true);

      if (
        getTotalAmount(
          getBookingDetails(bookingID)?.vehicleID,
          eventEndDate,
          eventStartDate,
        ) > getBookingDetails(bookingID)?.totalAmount
      ) {
        setProcessingPayment(true);
        // simulate a payment of the extra amount
        setTimeout(() => {
          setProcessingPayment(false);
          setPaymentSuccess(true);
          // update bookings data with new end date and total amount

          setTimeout(() => {
            setPaymentSuccess(false);
            closeModal();
            resetModalFields();
            setUpdatingBooking(false);
          }, 3000);
        }, 5000);
      } else {
        setTimeout(() => {
          // update all bookings

          closeModal();
          resetModalFields();
          setUpdatingBooking(false);
        }, 300);
      }
    } else {
      setProcessingPayment(true);
      setDisableButton(true);
      // add to bookings data with new booking details and total amount
      // Add new booking
      const newBooking = {
        id: Math.floor(Math.random() * 1000) + 200, // Random ID for demo
        vehicleId: bookingID,
        renterName: renterName,
        renterPhone: renterPhone,
        renterID: renterID,
        pickupLocation: "Nairobi Depot",
        dropoffLocation: "Nairobi Depot",
        rentalStart: eventStartDate,
        rentalEnd: eventEndDate,
        rentalTime: eventStartTime,
        rentalDays: getNumberOfDays(eventStartDate, eventEndDate),
        discount: 0,
        total: getTotalAmount(
          getBookingDetails(bookingID)?.vehicleID,
          eventEndDate,
          eventStartDate,
        ),
        status: "Reserved",
        priority: eventLevel,
      };
      // update all bookings

      setTimeout(() => {
        setProcessingPayment(false);
        setPaymentSuccess(true);
        toast.success(
          `Success: SMS confirmation sent to ${renterPhone} with booking details and receipt.`,
        );

        if (renterPhone) {
          // Simulate sending SMS confirmation
          setTimeout(() => {
            setPaymentSuccess(false);
            closeModal();
            resetModalFields();
            setDisableButton(false);
          }, 5000);
        }
      }, 5000);
    }
  };

  const resetModalFields = () => {
    setBookingID(0);
    setBookingName("");
    setEventStartDate("");
    setEventStartTime("10:00");
    setEventEndDate("");
    setEventEndTime("10:00");
    setEventLevel("");
    setSelectedEvent(null);
    setRenterName("Austine Otieno");
    setRenterID("12345678");
    setRenterPhone("0768927617");
  };

  // 1. Process existing bookings by stitching date and time strings together directly
  const existingBookingsIntervals = useMemo(() => {
    return bookings
      ?.filter((b) => b.vehicleId === bookingID)
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
  }, [bookings, bookingID]);

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
      const existingEndWithBuffer = existing.end.add(BUFFER_HOURS, "hour");
      const existingStartWithBuffer = existing.start.subtract(
        BUFFER_HOURS,
        "hour",
      );

      // Overlap math: Checks if the intervals collide factoring in the buffer
      const overlaps =
        (newStart.isBefore(existingEndWithBuffer) &&
          newEnd.isAfter(existing.start)) ||
        (newEnd.isAfter(existingStartWithBuffer) &&
          newStart.isBefore(existing.end));

      // if (overlaps) {
      //   console.log(`[Overlap Found] Vehicle ID: ${bookingID}`);
      //   console.log(`Existing Booking #${existing.id}: ${existing.start.format('YYYY-MM-DD HH:mm')} to ${existing.end.format('YYYY-MM-DD HH:mm')}`);
      //   console.log(`Your Selection: ${newStart.format('YYYY-MM-DD HH:mm')} to ${newEnd.format('YYYY-MM-DD HH:mm')}`);
      // }

      return overlaps;
    });
  }, [currentSelectionInterval, existingBookingsIntervals, bookingID]);

  return (
    <>
      <button
        onClick={() => reloadBookings()}
        className="text-theme-sm ms-auto mb-3 flex items-center justify-center gap-3 rounded-lg bg-gray-800 p-2 px-3 font-medium text-gray-500 hover:bg-gray-800/70"
      >
        <CachedIcon /> Sync now
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={bookings
              ?.filter((b) => b.booking_status !== "Reserved")
              .map((booking) => ({
                id: booking.id.toString(),
                title:
                  booking.vehicleDetails.year +
                  " " +
                  booking.vehicleDetails.make +
                  " " +
                  booking.vehicleDetails.model,
                start: booking.rental_start,
                end: booking.rental_end,
                extendedProps: {
                  calendar: booking.priority,
                  registration: booking.vehicleDetails.license_plate,
                  renter: booking.renter_name,
                  renterID: booking.renter_id,
                  renterPhone: booking.renter_phone,
                  bookingDbId: booking.id,
                  rentalTime: booking.rental_time,
                },
              }))}
            selectable={true}
            select={() => window.open("/bookings/new")}
            eventClick={(e) => window.open(`/bookings/${e.event.id}/edit`)}
            eventContent={renderEventContent}
            customButtons={{
              addEventButton: {
                text: "Create New Booking",
                click: () => (window.location.href = "/bookings/new"),
              },
            }}
          />
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-175 p-6 lg:p-10"
        >
          <div className="custom-scrollbar flex max-h-[calc(100vh-120px)] flex-col overflow-y-auto px-2">
            <div>
              <h5 className="modal-title text-theme-xl mb-2 font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
                {selectedEvent ? "Edit Booking" : "Create Booking"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your bookings by adding new ones or editing existing
                bookings. Click on any date to add a new booking or click on an
                existing booking to edit it.
              </p>
            </div>

            <h4 className="modal-title text-theme-xl mt-3 mb-0 font-semibold text-gray-800 lg:text-xl dark:text-white/90">
              Rental Information
            </h4>

            <div className="mt-3">
              <div>
                {!selectedEvent && (
                  <div>
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
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>
                )}
                <div className="hidden">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Vehicle ID
                  </label>
                  <input
                    id="event-id"
                    type="text"
                    value={bookingID}
                    disabled
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
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
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  />
                </div>
              </div>
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
                              checked={eventLevel === key}
                              onChange={() => setEventLevel(key)}
                            />
                            <span className="box mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 dark:border-gray-700">
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
              <div className="mt-7 bg-white shadow-sm dark:bg-gray-900">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Service Schedule
                </h3>
                <AdminCalendarWrapper
                  isMarkedUnavailable={getVehicleDetails(bookingID)?.status === "Not Available"}
                  dateString={new Date().toISOString().split("T")[0]}
                  vehicleId={bookingID}
                  bookings={[]}
                  loading={false} />
              </div>

              {getVehicleDetails(bookingID)?.status === "Not Available" && (
                <div className="mt-8 flex items-center gap-2 rounded border-gray-500 p-3 text-sm text-red-500 dark:border-red-500 dark:bg-red-500/12">
                  <ErrorIcon className="w-auto" />{" "}
                  <div className="w-full">
                    This vehicle is currently not available for renting YET. Go
                    to vehicles and set is as available or inform renter of when
                    it will be available again!
                  </div>
                </div>
              )}

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Enter Start Date
                  </label>
                  <div className="relative">
                    <input
                      id="event-start-date"
                      disabled={!!selectedEvent}
                      type="date"
                      value={eventStartDate}
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
                      value={eventStartTime}
                      disabled={!!selectedEvent}
                      onChange={(e) => {
                        setEventStartTime(e.target.value);
                        setEventEndTime(e.target.value);
                      }}
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
                    Enter End Date
                  </label>
                  <div className="relative">
                    <input
                      id="event-end-date"
                      type="date"
                      value={eventEndDate}
                      onChange={(e) => setEventEndDate(e.target.value)}
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
                      value={eventEndTime}
                      name="end-time"
                      disabled={!!selectedEvent}
                      onChange={(e) => {
                        setEventStartTime(e.target.value);
                        setEventEndTime(e.target.value);
                      }}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <TimeIcon />
                    </span>
                  </div>
                </div>
                {getVehicleDetails(bookingID)?.status !== "Not Available" &&
                  eventDays < getVehicleDetails(bookingID)?.minDays && (
                    <div className="text-sm text-red-500">
                      Please select a minimum of {minDays} Days
                    </div>
                  )}
              </div>

              {isSelectionOverlapping && (
                <div className="mt-4 text-sm text-red-500">
                  The date and time you entered overlaps with an existing
                  booking. Please check the time ensuring a buffer time of{" "}
                  {BUFFER_HOURS} Hrs is allowed before or after a rental{" "}
                  <Link
                    className="text-blue-500 underline"
                    href={"/preferences"}
                  >
                    Click Here
                  </Link>{" "}
                  to change burrer time.
                </div>
              )}

              {selectedEvent && (
                <div>
                  <label className="mt-3 mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Extend Booking
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((day) => (
                      <Button
                        size="sm"
                        variant="success-outline"
                        key={day}
                        onClick={() => {
                          // add days to end date
                          setEventEndDate(
                            new Date(
                              new Date(eventEndDate).getTime() +
                              day * 24 * 60 * 60 * 1000,
                            )
                              .toISOString()
                              .split("T")[0],
                          );
                        }}
                      >
                        <PlusIcon />
                        {day} Day{day > 1 ? "s" : ""}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
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
                  value={renterName}
                  readOnly={!!selectedEvent}
                  onChange={(e) => setRenterName(e.target.value)}
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
                  value={renterID}
                  readOnly={!!selectedEvent}
                  onChange={(e) => setRenterID(e.target.value)}
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
                  value={renterPhone}
                  readOnly={!!selectedEvent}
                  onChange={(e) => setRenterPhone(e.target.value)}
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
              {bookingID && (
                <div className="mt-6 flex flex-col items-end gap-2 border-t">
                  <h4 className="modal-title text-theme-l lg:text-l mt-4 font-semibold text-gray-800 dark:text-white/90">
                    Booking Summary:
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedEvent && "Booked"} Days:{" "}
                    {selectedEvent
                      ? getBookingDetails(bookingID)?.days
                      : eventDays}{" "}
                    Days
                  </p>
                  {!!selectedEvent && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Extension:{" "}
                      {eventDays - Number(getBookingDetails(bookingID)?.days)}{" "}
                      Days
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Daily Rate: Ksh.{" "}
                    {getBookingDetails(
                      bookingID,
                    ).dailyRate.toLocaleString()}{" "}
                  </p>
                  {!!selectedEvent && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Amount: Ksh.{" "}
                      {getBookingDetails(
                        bookingID,
                      ).totalAmount.toLocaleString()}
                    </p>
                  )}
                  <p className="text-sm font-bold text-green-500">
                    Total Payable: Ksh.{" "}
                    {selectedEvent
                      ? (
                        getTotalAmount(
                          getBookingDetails(bookingID)?.vehicleID,
                          eventEndDate,
                          eventStartDate,
                        ) - getBookingDetails(bookingID)?.totalAmount
                      ).toLocaleString()
                      : getTotalAmount(
                        getBookingDetails(bookingID)?.vehicleID,
                        eventEndDate,
                        eventStartDate,
                      ).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div style={{ minHeight: "8.5rem", position: "relative" }}>
              {processingPayment && (
                <div className="mt-6 flex animate-pulse items-center gap-3 rounded-md border border-blue-400 bg-blue-500/10 p-2 py-3">
                  <div className="p-2">
                    <AccessTimeIcon fontSize="large" color="primary" />
                  </div>
                  <div>
                    <h5 className="text-blue-500">
                      <strong>Processing Payment!</strong>
                    </h5>

                    {/* This is where the payment processing component will go. For now, it's just a placeholder. */}
                    <div className="mt-1 text-sm text-blue-300 dark:text-blue-200">
                      <p>
                        {" "}
                        A payment request will be sent to the renter's phone
                        number ({renterPhone}) upon booking confirmation. The
                        booking will be finalized once the payment is
                        successfully processed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {paymentSuccess && (
                <div className="mt-6 flex items-center gap-3 rounded-md border border-green-400 bg-green-500/10 p-2 py-3">
                  <div className="p-2 text-green-500">
                    <TaskAltIcon fontSize="large" />
                  </div>
                  <div>
                    <h5 className="text-green-500">
                      <strong>Payment Success!</strong>
                    </h5>

                    {/* This is where the payment processing component will go. For now, it's just a placeholder. */}
                    <div className="mt-1 text-sm text-green-300 dark:text-green-200">
                      <p>
                        Payment has been successfully processed. The booking is
                        now confirmed and will appear on the calendar. An SMS
                        confirmation will be sent to the renter's phone number (
                        {renterPhone}) with the booking details and receipt.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer mt-6 flex items-center gap-3 sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateEvent}
                disabled={
                  !bookingName ||
                  !eventStartDate ||
                  !eventEndDate ||
                  !eventLevel ||
                  !renterName ||
                  !renterID ||
                  !renterPhone ||
                  eventDays < minDays ||
                  processingPayment ||
                  updatingBooking ||
                  disableButton ||
                  isSelectionOverlapping
                }
                type="button"
                style={{
                  cursor:
                    !bookingName ||
                      !eventStartDate ||
                      !eventEndDate ||
                      !eventLevel ||
                      !renterName ||
                      !renterID ||
                      !renterPhone ||
                      eventDays < minDays ||
                      processingPayment ||
                      updatingBooking ||
                      disableButton ||
                      isSelectionOverlapping
                      ? "not-allowed"
                      : "pointer",
                }}
                className="btn btn-success btn-update-event bg-brand-500 hover:bg-brand-600 flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white sm:w-auto"
              >
                {selectedEvent ? "Update Booking" : "Create Booking"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  // modify color class to use value instead of key and make it lowercase to match the class names in tailwind
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar === "High Priority" ? "success" : eventInfo.event.extendedProps.calendar === "Medium Priority" ? "primary" : "warning"}`;
  const registration = eventInfo.event.extendedProps.registration;
  const renter = eventInfo.event.extendedProps.renter;
  const titleAttr = `${eventInfo.event.start?.toLocaleDateString() || ""}${eventInfo.event.end ? ` - ${eventInfo.event.end?.toLocaleDateString()}` : ""}`;

  return (
    <div
      title={titleAttr}
      className={`event-fc-color fc-event-main flex cursor-pointer ${colorClass} rounded-sm p-1`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="min-w-0 pl-2">
        <div className="truncate text-xs text-gray-500 dark:text-gray-400">
          {eventInfo.timeText}
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="fc-event-title truncate overflow-hidden font-medium text-ellipsis whitespace-nowrap">
            {eventInfo.event.title} •{" "}
            <span className="font-small text-xs text-gray-500 dark:text-gray-500">
              From {eventInfo.event.start?.toLocaleDateString()},{" "}
              {eventInfo.event.extendedProps.rentalTime}
            </span>
          </div>
          {registration && renter && (
            <div className="truncate overflow-hidden text-xs text-ellipsis whitespace-nowrap text-gray-500 dark:text-gray-400">
              {registration} | {renter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
