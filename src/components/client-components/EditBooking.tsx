"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { ArrowRightIcon, CalenderIcon, ChevronDownIcon, CloseIcon, CloseLineIcon, DownloadIcon, PencilIcon, PlusIcon, TimeIcon } from "@/icons";
import { CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup, useTheme } from "@mui/material";
import Badge from "../ui/badge/Badge";
import { getBookingDetailsServer } from "@/app/api/bookings/booking-details";
import { useUser } from "@/context/UserContext";
import BookingNotFound from "../bookings/NotFound";
import Alert from "../ui/alert/Alert";
import dayjs from "dayjs";
import { useModal } from "@/hooks/useModal";
import MobileScreenShareOutlinedIcon from "@mui/icons-material/MobileScreenShareOutlined"
import ScheduleIcon from "@mui/icons-material/Schedule";
import TextArea from "../form/input/TextArea";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Modal } from "../ui/modal";
import { useToast } from "@/context/ToastContext";
import { updateBookingDetails } from "@/app/actions/bookings";
import { createPayment } from "@/app/actions/payments";
import { mpesaPollingIterval } from "../company-profile/CompanySubscriptionsCard";
import ComponentCard from "../common/ComponentCard";
import Rating from '@mui/material/Rating';
import { submitUserFeedback } from "@/app/actions/feedback";





const calendarsEvents = {
  'High Priority': "success",
  'Medium Priority': "primary",
  'Low Priority': "warning",
};

export function getTimeRemaining(status: string, start: string, end: string, time: string, created_at: string): string {
  const startDate = new Date(`${start}T${time}`);
  const endDate = new Date(`${end}T${time}`);
  const now = new Date();

  if (status.toLowerCase() === 'reserved') {
    if (new Date().getTime() > new Date(created_at).getTime() + (30 * 60 * 1000)) {
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
  const [newBookingDetails, setNewBookingDetails] = useState<any>(null);
  const [timerString, setTimerString] = useState<string>('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const successModal = useModal();
  const { showToast } = useToast();
  const theme = useTheme();
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('m-pesa');
  const [expandBreakdown, setExpandBreakdown] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState<number | null>(0);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);






  useEffect(() => {
    if (loading) return;
    setLoadingBooking(true);

    getBookingDetailsServer(BookingID, profile?.tenant_id)
      .then(res => {
        if (!res.error) {
          setBookingDetails(res.data);
          setMpesaNumber(res.data.renter_phone);
          setNewBookingDetails(res.data);
          setLoadingBooking(false);

        } else {
          setLoadingBooking(false);
          setBookingDetails(null);
          setNewBookingDetails(null);
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




  const handleSubmit = async () => {
    // 1. Guard check: make sure description text exists
    if (!description.trim()) {
      showToast('Please enter a valid description before submitting.', 'error')
      setStatusMessage({ type: "error", text: "Please enter a valid description before submitting." });
      return;
    }

    // 2. Guard check: Make sure context has fully loaded the user profile
    if (!profile) {
      showToast('User profile context not loaded. Please log in again.', 'error');
      setStatusMessage({ type: "error", text: "User profile context not loaded. Please log in again." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    // 3. Fire server action passing state alongside useUser details parameters
    const result = await submitUserFeedback(
      {
        category,
        rating: rating || 5,
        feedback_text: description,
      },
      {
        id: profile.id,
        tenant_id: profile.tenant_id,
        role: profile.role,
      }
    );

    setIsSubmitting(false);

    if (result.success) {
      showToast('Your feedback has been sent successfully.', 'success');
      setStatusMessage({ type: "success", text: "Thank you! Your feedback has been saved successfully." });
      setDescription("");
      setRating(0);
    } else {
      showToast('Failed to submit feedback.', 'error');
      setStatusMessage({ type: "error", text: result.error || "Failed to submit feedback." });
    }
  };


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

  const dayGap = useMemo(() => {
    if (!bookingDetails || !newBookingDetails) return 0;

    const startDay = dayjs(bookingDetails.rental_end);
    const endDay = dayjs(newBookingDetails?.rental_end);

    const days = startDay.isValid() && endDay.isValid() ? endDay.diff(startDay, "day") : 0;

    return days;
  }, [bookingDetails, newBookingDetails])


  const grossSubTotal = useMemo(() => {
    return bookingDetails?.vehicle?.daily_rate * (dayGap) || 0;
  }, [bookingDetails, newBookingDetails]);

  const vatAmount = useMemo(() => {
    return Math.round((bookingDetails?.vehicle?.daily_rate * (dayGap)) * 0.16);
  }, [bookingDetails, newBookingDetails]);

  const grandTotalAmount = grossSubTotal + vatAmount;

  const sanitizeMpesaNo = (mpesaNumber: string) => {
    let sanitizedNumber = mpesaNumber.replace(/\D/g, '');

    if (sanitizedNumber.startsWith('0')) {
      sanitizedNumber = `254${sanitizedNumber.substring(1)}`;
    } else if (sanitizedNumber.startsWith('7') || sanitizedNumber.startsWith('1')) {
      sanitizedNumber = `254${sanitizedNumber}`;
    } else if (sanitizedNumber.startsWith('254') && sanitizedNumber.length > 3) {
      // Already formatted
    } else {
      console.warn("Phone formatting fallback pattern encountered:", sanitizedNumber);
    }

    if (sanitizedNumber.length !== 12) {
      showToast('Please enter a valid 9 or 10-digit M-Pesa phone number.', 'error');
      setIsPaying(false);
      return null;
    }

    return sanitizedNumber;
  }

  const updateBookingStatus = async (status: string) => {
    showToast('Updating booking. Just a moment ...', 'info');

    const { vehicle, ...bookingWithoutVehicles } = newBookingDetails;

    const response = await updateBookingDetails(BookingID, { ...bookingWithoutVehicles, booking_status: status });

    if (response.success) {
      showToast(`Booking #${BookingID} status updated successfully!`, 'success');

      setNewBookingDetails((prev) => ({ ...prev, booking_status: status }))
      setBookingDetails((prev) => ({ ...prev, booking_status: status }))
    } else {
      console.log(response.error)
      showToast('Could not update booking status. Try again later!', 'error');
    }
  }


  const isEnded = (() => {
    const now = new Date();
    const end = dayjs(bookingDetails?.rental_end);
    const date = dayjs(now);

    return date.isAfter(end); // Changed from isBefore to isAfter
  })();

  const isStarted = (() => {
    const now = new Date();

    const start = dayjs(bookingDetails?.rental_start);
    const date = dayjs(now);
    const status = bookingDetails?.booking_status;

    return date.isAfter(start) && status === 'Active';
  })();

  const isCompleted = (() => {
    const now = new Date();

    const end = dayjs(bookingDetails?.rental_end);
    const date = dayjs(now);
    const status = bookingDetails?.booking_status;

    return date.isAfter(end) && status === 'Completed';
  })();




  const handleCheckoutSubmit = async () => {
    if (isEnded) {
      showToast('This booking has ended! Open vehicles to rebook.', 'error');
      return;
    }

    setError(null);
    const buffer = Number(profile?.fleetmaster_tenants?.buffer);

    // performing server update wihout triggering payment 
    if (grandTotalAmount === 0) {
      showToast('Updating booking. Just a moment ...', 'info');

      const { vehicle, ...bookingWithoutVehicles } = newBookingDetails;

      const response = await updateBookingDetails(BookingID, bookingWithoutVehicles);

      if (response.success) {
        showToast(`Booking #${BookingID} updated successfully!`, 'success');
      } else {
        showToast('Could not update booking. Try again later!', 'error');
      }
      return;
    }



    let sanitizedNumber = sanitizeMpesaNo(mpesaNumber);

    if (paymentMethod === 'm-pesa' && !sanitizedNumber) {
      showToast('Please enter a valid M-Pesa phone number!', 'error');
      return;
    }
    if (!newBookingDetails.rental_end || new Date(`${newBookingDetails.rental_end}T${newBookingDetails.rental_time}`) < new Date(`${bookingDetails.rental_end}T${bookingDetails.rental_time}`)) {
      showToast('Please enter a valid End Date!', 'error');
      return;
    }

    setIsPaying(true);

    if (paymentMethod === 'm-pesa') {
      let intervalId: NodeJS.Timeout | null = null;
      let safetyTimeoutId: NodeJS.Timeout | null = null;
      let hasHandledCompletion = false; // <-- Lock flag to prevent duplicate processing

      const clearPollingTimers = () => {
        if (intervalId) clearInterval(intervalId);
        if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
      };

      try {
        showToast('Checking rental vehicle availability...', 'info');

        const availabilityCheckRes = await fetch('/api/bookings/check-overlap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicleID: bookingDetails?.vehicle_id,
            rentalStart: bookingDetails.rental_end,    // Format: YYYY-MM-DD
            rentalEnd: newBookingDetails.rental_end,      // Format: YYYY-MM-DD
            rentalTime: newBookingDetails.rental_time,   // Format: HH:MM
            tenantID: profile?.tenant_id,
            userID: profile?.id,
            buffer,
            isAdmin: profile?.role !== 'Client'
          })
        });

        const availabilityCheckResdata = await availabilityCheckRes.json();
        console.log("❌ Availability check response failed:", {
          status: availabilityCheckRes.status,
          statusText: availabilityCheckRes.statusText,
          data: availabilityCheckResdata
        });

        if (!availabilityCheckRes.ok || !availabilityCheckResdata.success) {
          const errorMessage = availabilityCheckResdata.error || availabilityCheckResdata.message || 'This vehicle is booked for some of the selected days!';
          showToast(errorMessage, 'error');
          setIsPaying(false);
          return;
        }


        const res = await fetch('/api/mpesa/stk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Number(grandTotalAmount),
            phoneNumber: sanitizedNumber,
          })
        });

        const data = await res.json();
        console.log('Daraja STK Response: ', data);

        if (!res.ok || data.ResponseCode !== "0") {
          throw new Error(data.errorMessage || data.ResponseDescription || 'Failed to dispatch M-Pesa push.');
        }

        const targetCheckoutId = data.CheckoutRequestID;
        if (!targetCheckoutId) {
          throw new Error('No tracking CheckoutRequestID returned from M-Pesa gateway.');
        }

        showToast('STK Push Request Sent! Please enter your M-Pesa PIN', 'info');

        intervalId = setInterval(async () => {
          // If already handled by a previous tick, skip execution completely
          if (hasHandledCompletion) return;

          try {
            const statusRes = await fetch('/api/mpesa/status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ checkoutRequestID: targetCheckoutId })
            });

            const statusData = await statusRes.json();
            const resultCode = statusData.ResultCode;
            const responseCode = statusData.ResponseCode;
            console.log('Daraja status check poll: ', resultCode, responseCode, statusData);

            // Ignore intermediate processing states (e.g. "The service request has been accepted successfully" with no ResultCode yet)
            if (!resultCode || resultCode === "PROCESSING") {
              return;
            }

            // --- LOCK ACQUIRED: Prevent other ticks from running ---
            hasHandledCompletion = true;
            clearPollingTimers();
            setIsPaying(false);

            const mpesaRef = statusData.MpesaReceiptNumber || targetCheckoutId;


            if (resultCode === "0") {
              // showToast('Payment Confirmed! Your booking has been processed successfully.', 'success');
              successModal.openModal();
              setPaymentSuccess(true);
              setBookingDetails({ ...newBookingDetails, rental_days: (bookingDetails.rental_days + dayGap) });

              const newPayment = {
                tenant_id: profile?.tenant_id,
                intasend_invoice_id: targetCheckoutId,
                provider: 'M-PESA',
                provider_reference: mpesaRef,
                amount: Number(grandTotalAmount),
                currency: 'KES',
                account_number: sanitizedNumber,
                payment_ref: mpesaRef,
                user_id: profile?.id || null,
                status: 'Success',
                message: 'Confirmed! Your booking has been processed successfully.',
              };

              await updateBookingDetails(BookingID, {
                total: Number(bookingDetails.total + grandTotalAmount),
                renter_phone: sanitizedNumber,
                rental_end: newBookingDetails.rental_end,
                rental_days: Number(dayGap + bookingDetails?.rental_days),
                intasend_invoice_id: targetCheckoutId,
                payment_ref: mpesaRef,
              });

              const dbRes = await createPayment(newPayment);
              if (!dbRes.success) {
                await createPayment(newPayment);
              }

            } else {
              const failReason = statusData.ResultDesc || 'Transaction was canceled or failed.';
              showToast(failReason, 'error');
              setError({ message: failReason });

              const newPayment = {
                tenant_id: profile?.tenant_id,
                intasend_invoice_id: targetCheckoutId,
                provider: 'M-PESA',
                provider_reference: mpesaRef,
                amount: Number(grandTotalAmount),
                currency: 'KES',
                account_number: sanitizedNumber,
                payment_ref: mpesaRef,
                user_id: null,
                status: 'Failed',
                message: failReason,
              };

              await createPayment(newPayment);
            }
          } catch (pollErr) {
            console.error("Error during background status poll checking:", pollErr);
          }
        }, mpesaPollingIterval);

        safetyTimeoutId = setTimeout(() => {
          if (!hasHandledCompletion) {
            hasHandledCompletion = true;
            clearPollingTimers();
            setIsPaying(false);
            showToast('Payment verification timed out. Please check your transaction history.', 'error');
          }
        }, 65000);

      } catch (err: any) {
        setError(err);
        console.error("Direct STK Push Failed:", err);
        showToast(err.message || 'M-Pesa STK verification failed.', 'error');
        setIsPaying(false);
      }
    } else {
      showToast('Card payment checkout not available! Consult support.', 'error');
      setIsPaying(false);
      setError({ message: 'Card payment checkout not available! Consult support.' })

      return;
    }
  };


  console.log(isCompleted)
  // Helper to format Date object to YYYY-MM-DD (Local Time)
  if (loading || loadingBooking) {
    return (
      <div className="min-h-[70vh]">
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
    )
  }


  if (!bookingDetails || (profile.role === 'Client' && bookingDetails.user_id !== profile.id)) {
    return <BookingNotFound />
  }

  return (
    <div className="p-5 border-gray-200 rounded-2xl dark:border-gray-800">

      <div className='space-y-5 mb-4'>
        {
          isPaying && <Alert title='Payment Processing!' variant='info' message='Your payment is being processed. Check your phone.' />
        }
        {
          paymentSuccess && <Alert title='Payment Confirmed!' variant='success' message='Your payment was successful. A receipt and your booking details have been sent to your email. If you have any questions, contact support.' />
        }

        {
          error && <Alert title='Payment Error!' variant='error' message={error?.message || 'An error occured. Please try again later!'} />
        }
      </div>
      {bookingDetails ?
        <div className="grid grid-cols-12 gap-6">
          <div className="flex flex-col px-2 relative col-span-12 xl:col-span-7">
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
                  Update Booking Priority
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
                              checked={newBookingDetails.priority === key}
                              onChange={() => setNewBookingDetails((prev) => ({ ...prev, priority: key }))}
                            />
                            <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                              <span
                                className={`h-2 w-2 rounded-full bg-white ${newBookingDetails.priority === key ? "block" : "hidden"
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
              </div>}

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
              {/* if a user is client they can cancel only if not ended or if isstarted
              if a user is admin they can cancel before it start before it ends but only if status is not active, admin should mark as started */}
              {
                profile.role === 'Client' ?
                  <Button disabled={isEnded || isStarted} className="w-full mt-6" variant="danger" size="sm">{'Cancel Booking'}</Button>
                  : (
                    <div>
                      {/* mark as active but only if start date is "more than"current meaning it should have started then if has started give 2 optionsmark started or cancel with reasons like client no show, client failed to provide documentation etc */}
                      <Button onClick={(e) => updateBookingStatus(isEnded ? "Completed" : !isStarted ? "Active" : '...')} className={`w-full mt-6 ${isCompleted && 'hidden!'}`} variant="success" size="sm">
                        {isEnded ? 'Mark as Complete' : !isStarted ? 'Mark as Started' : '...'}
                      </Button>
                      <Button disabled={isEnded || isCompleted} className="w-full mt-6" variant="danger" size="sm">{'Cancel Booking'}</Button>
                    </div>
                  )
              }
              <p className="text-center text-sm py-4 text-gray-500">Cancellations charges may apply. </p>
            </div>
          </div>


          {/* ================= RIGHT SIDE: INVOICE & INTASEND GATEWAY (col-span-5) ================= */}
          <div className="col-span-12 xl:col-span-5 space-y-6">
            {
              (isCompleted) ?
                <ComponentCard title="Leave A Review">
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90 mb-4">
                    This rental ended. How would you recommend this {profile.role === 'Client' ? 'Rental experience' : 'Client'} on a scale of 1 to 10?
                  </p>

                  <div className="space-y-4">
                    {/* Category selection selector */}
                    <div>
                      <Label>Review Title</Label>
                      <Input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g Excellent customer service"
                        className="w-full mt-1 p-2.5 border rounded-lg bg-transparent border-gray-200 dark:border-white/10 text-theme-sm text-gray-800 dark:text-white/90 outline-none focus:border-brand-500"
                      />
                    </div>

                    {/* Evaluation Score Selection */}
                    <div>
                      <Label>Pick Your Rating</Label>
                      <div className="flex flex-col justify-center items-center py-3 gap-3">
                        <div>
                          <h3 className="text-purple-600 text-2xl font-bold">({rating.toFixed(1)})</h3>
                        </div>
                        <Rating
                          name="feedback-rating"
                          value={rating}
                          onChange={(_, newValue) => setRating(newValue)}
                          size="large"
                          max={5}
                          precision={.5}
                          sx={{
                            '& .MuiRating-iconEmpty': {
                              color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : '#cbd5e1'
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Narrative Box */}
                    <div>
                      <Label>Feedback Description</Label>
                      <TextArea
                        rows={6}
                        value={description}
                        onChange={(value) => setDescription(value)}
                        placeholder={`Describe what you encountered or what your experience was with the ${profile.role === 'Client' ? 'rentee' : 'renter'}.`}
                      />
                    </div>

                    {/* Notification alert response box */}
                    {statusMessage && (
                      <div className={`p-3 rounded-lg text-theme-sm ${statusMessage.type === "success"
                        ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        }`}>
                        {statusMessage.text}
                      </div>
                    )}

                    {/* Submission Action Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`flex mt-3 ms-auto items-center justify-center p-2 px-4 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                      {isSubmitting ? "Processing Submission..." : "Submit Feedback"}
                    </button>
                  </div>
                </ComponentCard> :
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                    Invoice Summary
                  </h3>

                  {/* Date Picking Mirror Layer */}
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-gray-400">Handover Date</Label>
                        <Input disabled type="datetime-local" className="text-xs mt-1"
                          value={
                            dayjs((bookingDetails.rental_start + 'T' + bookingDetails.rental_time)).format('YYYY-MM-DDTHH:mm')
                          }
                          name="start_date" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-400">Return Date</Label>
                        <Input
                          type="datetime-local"
                          className="text-xs mt-1"
                          // Keep the value display consistent
                          value={`${newBookingDetails.rental_end}T${newBookingDetails.rental_time}`}
                          onChange={(e) => {
                            // 1. Get the new full string from the input (e.g., "2026-07-15T14:30")
                            const newDateTime = e.target.value;

                            // 2. Extract ONLY the date part from the new selection
                            const newDate = newDateTime.split('T')[0];



                            // 3. Update the state using the NEW date, but the EXISTING (unchanged) time
                            setNewBookingDetails((prev) => ({
                              ...prev,
                              rental_end: newDate,
                              // Ensure rental_time remains explicitly the old value
                              rental_time: prev.rental_time,
                            }));
                          }}
                          name="end_date"
                        />
                      </div>
                    </div>
                    <small className="text-red-500 mb-2 text-sm">{new Date(`${newBookingDetails.rental_end}T${newBookingDetails.rental_time}`) < new Date(`${bookingDetails.rental_end}T${bookingDetails.rental_time}`) && 'Enter a valid end date!'}</small>

                    {[1, 2, 3, 4, 5, 7, 10, 14].map((day) => (
                      <Button className="mb-2 mr-2 py-2!" size="sm" variant="success-outline" key={day}
                        onClick={() => {
                          setNewBookingDetails((prev) => ({
                            ...prev,
                            rental_end: new Date(new Date(bookingDetails.rental_end).getTime() + day * 24 * 60 * 60 * 1000)
                              .toISOString()
                              .split('T')[0],
                          }));
                        }}>
                        <PlusIcon />
                        {day} Day{day > 1 ? 's' : ''}
                      </Button>
                    ))}

                    <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 dark:bg-gray-950 p-2 rounded border dark:border-gray-800">
                      <span className="flex items-center gap-1"><ScheduleIcon fontSize="inherit" /> Computed Extension Span:</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">{dayGap} Days</span>
                    </div>
                  </div>

                  {/* Dynamic Financial Statement Engine */}
                  {expandBreakdown && (
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-950/40 text-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">Booked Days</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{bookingDetails?.rental_days} Days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">Duration Allocation</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{dayGap} Days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">Base Subtotal ({dayGap}d × Ksh {(bookingDetails?.vehicle?.daily_rate).toLocaleString()})</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">Ksh. {(grossSubTotal).toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">Logistics Transfer Supplement</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">Ksh. {(0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">Standard Incident Rescue Plan</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">Ksh. {0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">Statutory VAT (16%)</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">Ksh. {(vatAmount).toLocaleString()}</span>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-800 my-2" />
                    </div>
                  )}

                  {/* Grand Total Matrix Block */}
                  <div className="mt-4 flex items-center justify-between p-3 bg-brand-500/10 dark:bg-brand-500/5 rounded-xl border border-brand-500/20">
                    <span className="font-bold text-gray-900 dark:text-white text-base">Grand Payable Total:</span>
                    <span className="text-xl font-extrabold text-green-600 dark:text-green-500">
                      Ksh. {(grandTotalAmount).toLocaleString()}
                    </span>
                  </div>

                  <p role='button' className='font-medium text-left text-xs text-brand-500 mt-2 mb-6 underline cursor-pointer' onClick={() => setExpandBreakdown(!expandBreakdown)}>
                    {expandBreakdown ? 'Hide itemized breakdowns' : 'Expose line-item invoice data'}
                  </p>

                  {/* Billing Gateway Gateway Interface Config */}
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">3. Choose Payment Method</h4>
                  <FormControl component="fieldset" className="w-full mb-6">
                    {/* Use ONE RadioGroup mapped directly to your state variable */}
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="space-y-3"
                    >
                      {/* M-Pesa Option Layout Box */}
                      <div
                        onClick={() => setPaymentMethod('m-pesa')}
                        className={`flex items-center justify-between border rounded-xl px-3 py-2 cursor-pointer bg-white dark:bg-gray-900 transition-colors ${paymentMethod === 'm-pesa'
                          ? 'border-brand-500 bg-brand-50/5'
                          : 'border-gray-200 dark:border-gray-800'
                          }`}
                      >
                        <FormControlLabel
                          value="m-pesa"
                          control={<Radio size="small" />}
                          label={
                            <div className="flex items-center gap-2">
                              <MobileScreenShareOutlinedIcon className="text-brand-500" fontSize="small" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">M-Pesa Instant PayBill</span>
                            </div>
                          }
                        />
                      </div>

                      {/* Card Option Layout Box */}
                      <div
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center justify-between border rounded-xl px-3 py-2 cursor-pointer bg-white dark:bg-gray-900 transition-colors ${paymentMethod === 'card'
                          ? 'border-brand-500 bg-brand-50/5'
                          : 'border-gray-200 dark:border-gray-800'
                          }`}
                      >
                        <FormControlLabel
                          value="card"
                          control={<Radio size="small" />}
                          label={
                            <div className="flex items-center gap-2">
                              <CreditCardIcon className="text-brand-500" fontSize="small" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">Bank Instant Checkout (VISA/MASTER Card)</span>
                            </div>
                          }
                        />
                      </div>
                    </RadioGroup>
                  </FormControl>

                  <div className="mt-4 mb-4 transition-all duration-200">
                    {paymentMethod === 'm-pesa' && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          M-Pesa Mobile Number
                        </label>
                        <div className="relative mt-2">
                          <Input
                            type="tel"
                            placeholder="e.g., 0712345678"
                            className="pl-15.5"
                            defaultValue={mpesaNumber}
                            value={mpesaNumber}
                            onChange={(e) => setMpesaNumber(e.target.value)}
                            disabled={isPaying}
                          />
                          <span className="absolute left-0 top-1/2 flex text-sm h-11 w-13.75 dark:text-white -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                            +254
                          </span>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        {/* Card Number Row */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            Card Details
                          </label>
                          <div className="relative mt-2">
                            <Input
                              type="text"
                              placeholder="Card number"
                              className="pl-15.5"
                            // value={cardNumber}
                            // onChange={(e) => setCardNumber(e.target.value)}
                            />
                            <span className="absolute left-0 top-1/2 flex h-11 w-11.5 -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="6.25" cy="10" r="5.625" fill="#E80B26" />
                                <circle cx="13.75" cy="10" r="5.625" fill="#F59D31" />
                                <path
                                  d="M10 14.1924C11.1508 13.1625 11.875 11.6657 11.875 9.99979C11.875 8.33383 11.1508 6.8371 10 5.80713C8.84918 6.8371 8.125 8.33383 8.125 9.99979C8.125 11.6657 8.84918 13.1625 10 14.1924Z"
                                  fill="#FC6020"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Expiry and CVV Side-by-Side Row */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Expiry Field */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                              Expiry Date
                            </label>
                            <Input
                              type="text"
                              max={'5'}
                              placeholder="MM/YY"
                              className="w-full text-center mt-2"
                            // value={expiry}
                            // onChange={(e) => handleExpiryChange(e.target.value)}
                            />
                          </div>

                          {/* CVV/CVC Field */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                              Secure Code (CVV)
                            </label>
                            <Input
                              type="password"
                              max={'4'}
                              placeholder="•••"
                              className="w-full text-center tracking-widest mt-2"
                            // value={cvv}
                            // onChange={(e) => setCvv(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>


                  <Modal
                    isOpen={successModal.isOpen}
                    onClose={successModal.closeModal}
                    className="max-w-150 p-5 lg:p-10 z-99999 bg-white! dark:bg-black!"
                  >
                    <div className="text-center">
                      <div className="relative flex items-center justify-center z-1 mb-7">
                        <svg
                          className="fill-success-50 dark:fill-success-500/15"
                          width="90"
                          height="90"
                          viewBox="0 0 90 90"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                            fill=""
                            fillOpacity=""
                          />
                        </svg>

                        <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                          <svg
                            className="fill-success-600 dark:fill-success-500"
                            width="38"
                            height="38"
                            viewBox="0 0 38 38"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.9375 19.0004C5.9375 11.7854 11.7864 5.93652 19.0014 5.93652C26.2164 5.93652 32.0653 11.7854 32.0653 19.0004C32.0653 26.2154 26.2164 32.0643 19.0014 32.0643C11.7864 32.0643 5.9375 26.2154 5.9375 19.0004ZM19.0014 2.93652C10.1296 2.93652 2.9375 10.1286 2.9375 19.0004C2.9375 27.8723 10.1296 35.0643 19.0014 35.0643C27.8733 35.0643 35.0653 27.8723 35.0653 19.0004C35.0653 10.1286 27.8733 2.93652 19.0014 2.93652ZM24.7855 17.0575C25.3713 16.4717 25.3713 15.522 24.7855 14.9362C24.1997 14.3504 23.25 14.3504 22.6642 14.9362L17.7177 19.8827L15.3387 17.5037C14.7529 16.9179 13.8031 16.9179 13.2173 17.5037C12.6316 18.0894 12.6316 19.0392 13.2173 19.625L16.657 23.0647C16.9383 23.346 17.3199 23.504 17.7177 23.504C18.1155 23.504 18.4971 23.346 18.7784 23.0647L24.7855 17.0575Z"
                              fill=""
                            />
                          </svg>
                        </span>
                      </div>
                      <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                        Confirmed! Payment Successful.
                      </h4>
                      <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Your payment was successful. A receipt and your booking details have been sent to your email. If you have any questions, contact support or view your booking in the dashboard.
                      </p>

                      <div className="flex items-center justify-center w-full gap-3 mt-7">
                        <Button size="sm" variant="outline" endIcon={<ArrowRightIcon />} >
                          Go to bookings
                        </Button>
                        <button
                          type="button"
                          onClick={successModal.closeModal}
                          className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-success-500 shadow-theme-xs hover:bg-success-600 sm:w-auto"
                        >
                          Okay, Got It
                        </button>
                      </div>
                    </div>
                  </Modal>


                  <div className='space-y-5'>
                    {
                      isPaying && <Alert title='Payment Processing!' variant='info' message='Your payment is being processed. Check your phone.' />
                    }
                    {
                      paymentSuccess && <Alert title='Payment Confirmed!' variant='success' message='Your payment was successful. A receipt and your booking details have been sent to your email. If you have any questions, contact support.' />
                    }

                    {
                      error && <Alert title='Payment Error!' variant='error' message={error?.message || 'An error occured. Please try again later!'} />
                    }
                  </div>
                  {/* Dynamic Call-To-Action Operations Routing Grid */}
                  <div className="space-y-3 mt-4">
                    <Button onClick={handleCheckoutSubmit} className="w-full intaSendPayButton" data-amount="10" data-currency="KES" size='md' disabled={isPaying || paymentSuccess || newBookingDetails === bookingDetails}>
                      {isPaying
                        ? "Processing Transaction..."
                        : `Pay Now (Ksh. ${(grandTotalAmount).toLocaleString()})`
                      }
                    </Button>
                  </div>

                </div>
            }
          </div>
        </div>
        :
        <div className="min-h-[70vh]">
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
    </div >
  );
}
