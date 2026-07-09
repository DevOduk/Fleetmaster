"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { CalenderIcon, DownloadIcon, PencilIcon, PlusIcon, TimeIcon } from "@/icons";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import Badge from "../ui/badge/Badge";
import { getBookingDetailsServer } from "@/app/api/bookings/booking-details";
import { useUser } from "@/context/UserContext";
import BookingNotFound from "./NotFound";
import Alert from "../ui/alert/Alert";


const calendarsEvents = {
  'High Priority': "success",
  'Medium Priority': "primary",
  'Low Priority': "warning",
};
function getTimeRemaining(status: string, start: string, end: string, time: string, created_at: string): string {
  const startDate = new Date(`${start}T${time}`);
  const endDate = new Date(`${end}T${time}`);
  const now = new Date();

  if (status.toLowerCase() === 'reserved') {
    if(new Date().getTime() > new Date(created_at).getTime() + (30 * 60 * 1000)){
      return 'Reservation Expired!'
    }
    return 'Reserved (Awaiting Payment)';
  }

  if (now > endDate) {
    return `Rental ended on ${endDate.toLocaleDateString()}`;
  }

  if (now >= startDate && now <= endDate) {
    return `Ends in ${formatDuration(endDate.getTime() - now.getTime())}`;
  }

  return `Starts in ${formatDuration(startDate.getTime() - now.getTime())}`;
}

/**
 * Helper to convert milliseconds into "X Days Y Hrs Z Mins S Secs"
 */
function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days} Days ${hours} Hrs ${minutes} Mins ${seconds} Secs`;
}

export default function ViewBooking({ BookingID }: { BookingID: number; }) {
  const { loading, profile } = useUser();
  const [eventStartDate, setEventStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [timerString, setTimerString] = useState<string>('');

  useEffect(() => {
    if (loading) return;
    setLoadingBooking(true);

    getBookingDetailsServer(BookingID)
      .then(res => {
        console.log('get bookings', res);
        if (!res.error) {
          setBookingDetails(res.data);
          setLoadingBooking(false);

        } else {
          setLoadingBooking(false);
          setBookingDetails(null);
        }

      })
  }, [loading, BookingID])


useEffect(() => {
  if (!bookingDetails) return;

  // Define the interval function
  const updateTimer = () => {
    setTimerString(
      getTimeRemaining(
        bookingDetails.booking_status, 
        bookingDetails.rental_start, 
        // Ensure you use the correct field for the end date!
        bookingDetails.rental_end, 
        bookingDetails.rental_time,
        bookingDetails.created_at,
      )
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
  if (loading || loadingBooking) {
    return <div className="min-h-[70vh]">
      <div className="py-6 flex flex-col items-center">
        <CircularProgress color="primary" size={30} />

        <h4 className="mb-0 mt-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-xl">
          Just a moment!
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Geting booking's details! Please bear with us for a moment ...
        </p>
      </div>
    </div>
  }


  if (!bookingDetails || (profile.role === 'Client' && bookingDetails.user_id !== profile.id)) {
    return <BookingNotFound />
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 max-w-6xl mx-auto">
      {bookingDetails ?
        <div className="flex flex-col px-2 relative">
          <Button className="sticky right-0 top-20 z-9999" variant="primary" size="sm">{timerString}</Button>
          {bookingDetails?.booking_status.toLowerCase() === 'reserved' && (new Date().getTime() > new Date(bookingDetails.created_at).getTime() + (30 * 60 * 1000)) && (
            <Alert variant="error" title="Reservation expired!" message="This reservation has expired and can be rented by anther person. Once reservation is made, you have 30 minutes to complete payment or the reservation will be released for someone. If this happens you can check again after a few minutes for availability. Thank you!"></Alert>
          )}
          <div className="mt-5">
            <Badge size="md" color="success">STATUS: {bookingDetails?.booking_status}</Badge>
          </div>
          <h4 className="mt-3 mb-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-xl">
            Rental Information
          </h4>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your bookings by adding new ones or editing existing bookings. Click on any date to add a new booking or click on an existing booking to edit it.
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
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div className="mb-4 mt-2">
                <img className="h-45 w-full object-cover rounded-lg" src={bookingDetails?.vehicle?.image_url} alt={bookingDetails?.vehicle?.make} />
              </div>
              <div className="">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Vehicle Name
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={(profile.role !== 'Client' && (bookingDetails?.vehicle?.license_plate + ': ')) + bookingDetails?.vehicle?.year + ' ' + bookingDetails?.vehicle?.make + ' ' + bookingDetails?.vehicle?.model}
                  disabled
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
            {profile.role !== 'Client' && <div className="mt-6">
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
                            id={`modal${key}`} readOnly
                            checked={bookingDetails.priority === key}
                          />
                          <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                            <span
                              className={`h-2 w-2 rounded-full bg-white ${bookingDetails.priority === key ? "block" : "hidden"
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
            }

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-6">
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
                    value={bookingDetails.rental_time}
                    disabled
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
                  End Date
                </label>
                <div className="relative">
                  <input
                    id="event-end-date"
                    type="date"
                    disabled
                    value={formatDateToLocal(bookingDetails.rental_end)}
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
                    value={bookingDetails.rental_time}
                    name="end-time"
                    disabled
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <TimeIcon />
                  </span>
                </div>
              </div>
              {bookingDetails?.id && (
                <div className="text-sm text-green-500">
                  Rental period set at a minimum of {bookingDetails?.vehicle?.min_rental_days} Days
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
                value={bookingDetails?.renter_name}
                readOnly
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
                value={bookingDetails?.renter_id}
                readOnly
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
                value={bookingDetails?.renter_phone}
                readOnly
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
            {
              bookingDetails?.id && (

                <div className={`flex mt-5 ms-auto ${bookingDetails?.booking_status.toLowerCase() === 'reserved' && (new Date().getTime() > new Date(bookingDetails.created_at).getTime() + (30 * 60 * 1000)) ? 'dark:bg-red-800/30 bg-red-200' : 'dark:bg-green-800/30 bg-green-200'} rounded-2xl top-0  w-full gap-2 flex-col col-span-12 lg:col-span-3 mb-5`}>
                  <h4 className="mt-4 px-3 text-right font-semibold text-gray-800 modal-title text-theme-l dark:text-white/90 lg:text-l">
                    Booking Summary</h4>
                  <div className="mt-2 p-2 px-3 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/30">
                    <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Cost Breakdown</h3>

                    {/* Grid Wrapper */}
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-3 text-sm items-center">

                      {/* Row 1 */}
                      <div className="text-left text-gray-500 dark:text-gray-400">Duration</div>
                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                      <div className="text-right font-medium text-gray-800 dark:text-gray-200">{bookingDetails?.rental_days} Days</div>

                      {/* Row 2 */}
                      <div className="text-left text-gray-500 dark:text-gray-400">Daily Rate</div>
                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                      <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                        Ksh. {bookingDetails?.vehicle?.daily_rate.toLocaleString()}
                      </div>

                      {/* Row 3 */}
                      <div className="text-left text-gray-500 dark:text-gray-400">Delivery + Pickup fee</div>
                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                      <div className="text-right font-medium text-gray-800 dark:text-gray-200">Ksh. 0</div>

                      {/* Row 4 */}
                      <div className="text-left text-gray-500 dark:text-gray-400">Rescue Plan</div>
                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                      <div className="text-right font-medium text-gray-800 dark:text-gray-200">Ksh. {200}</div>

                      {/* Row 5 */}
                      <div className="text-left text-gray-500 dark:text-gray-400">VAT 16%</div>
                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                      <div className="text-right font-medium text-gray-800 dark:text-gray-200">Ksh. {((bookingDetails?.vehicle?.daily_rate * bookingDetails?.rental_days) * 0.16).toLocaleString()}</div>

                      {/* Horizontal Divider Span across all 3 columns */}
                      <div className="col-span-3 border-t border-gray-200 my-1 dark:border-gray-800" />

                      {/* Grand Total Row */}
                      <div className="text-left font-bold text-gray-800 dark:text-gray-100">Total</div>
                      <div className="w-px h-5 bg-gray-300 dark:bg-gray-700" />
                      <div className={`text-right text-base font-bold ${bookingDetails?.booking_status.toLowerCase() === 'reserved' && (new Date().getTime() > new Date(bookingDetails.created_at).getTime() + (30 * 60 * 1000)) ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'}`}>
                        Ksh. {bookingDetails?.total?.toLocaleString() || 0}
                      </div>

                    </div>
                  </div>
                </div>

              )
            }
          </div>

          <div className={`p-5 tracking-[0.2em] text-center uppercase ${bookingDetails?.booking_status.toLowerCase() === 'reserved' && (new Date().getTime() > new Date(bookingDetails.created_at).getTime() + (30 * 60 * 1000)) ? 'text-red-500' : 'text-brand-500'}`}>payment method: {bookingDetails?.booking_status.toLowerCase() === 'reserved' && (new Date().getTime() > new Date(bookingDetails.created_at).getTime() + (30 * 60 * 1000)) ? 'NOT PAID' : bookingDetails.payment_method}</div>


          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <Link href={'#download'}><Button size="sm" variant="success-outline"><DownloadIcon /> Print Receipt</Button></Link>
            <Link href={'/bookings/' + bookingDetails?.id + '/edit'}>
              <Button
                variant="primary"
                size="sm"
              >
                Edit Booking <PencilIcon />
              </Button></Link>
          </div>
        </div> :
        (
          <div className="py-6 flex flex-col items-center">
            <CircularProgress color="primary" size={30} />

            <h4 className="mb-0 mt-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-xl">
              Opps! That booking could not be found.
            </h4>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Geting booking's details! Please bear with us for a moment ...
            </p>
          </div>
        )
      }
    </div>
  );
}
