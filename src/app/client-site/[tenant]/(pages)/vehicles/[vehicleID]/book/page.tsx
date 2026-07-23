"use client";
import { use, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { createClient } from '@/utils/supabase/client';
import Button from '@/components/ui/button/Button';
import VehicleNotFound from '@/components/vehicles/NotFound';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { useFleet } from '@/context/FleetContext';
import { useUser } from '@/context/UserContext';
import { useTenant } from '@/context/TenantContext';
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined"
import MobileScreenShareOutlinedIcon from "@mui/icons-material/MobileScreenShareOutlined"
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Chip, Modal as MuiModal, Typography, IconButton, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useToast } from '@/context/ToastContext';
import Checkbox from '@/components/form/input/Checkbox';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import { ArrowRightIcon } from '@/icons';
import Alert from '@/components/ui/alert/Alert';
import { createPayment } from '@/app/actions/payments';
import DeliveryBanner from '@/components/client-components/DeliveryBanner';
import userVerified from '@/utils/clients/checkverification';
import { mpesaPollingIterval } from '@/components/company-profile/CompanySubscriptionsCard';
import { createNewBooking } from '@/app/actions/bookings';


dayjs.extend(isBetween);
const supabase = createClient();


interface VehiclePageProps {
    params: Promise<{ vehicleID: string }>;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 750,
    maxHeight: '85vh',
    overflowY: 'hidden',
    border: 0,
};

const BookingPage = ({ params }: VehiclePageProps) => {
    const searchParams = useSearchParams();
    const resolvedParams = use(params);
    const { vehicles, loading } = useFleet();
    const { profile } = useUser();
    const { tenant } = useTenant();
    const { showToast } = useToast();
    const [mpesaNumber, setMpesaNumber] = useState(profile?.phone || '');
    const [isPaying, setIsPaying] = useState(false);
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const successModal = useModal();
    const fallbackStart = dayjs().add(1, 'day').format('YYYY-MM-DD[T]HH:mm');
    // 2 days after tomorrow (3 days total) at the exact same hour and minute
    const fallbackEnd = dayjs().add(3, 'day').format('YYYY-MM-DD[T]HH:mm');

    const token = searchParams.get('token');
    let decodedData = null;
    if (token) {
        try {
            decodedData = JSON.parse(decodeURIComponent(atob(token)));
        } catch (e) {
            console.error("Failed to parse vehicle rental token details:", e);
        }
    }

    useEffect(() => {
        if (!profile?.phone) return;
        setMpesaNumber((profile?.phone).replace('+254', '').replace(' ', ''))
    }, [profile?.phone])

    const start = useMemo(() => {
        return decodedData?.bookingInformation?.start || searchParams.get('start') || fallbackStart;
    }, [decodedData, searchParams, fallbackStart]);

    const end = useMemo(() => {
        return decodedData?.bookingInformation?.end || searchParams.get('end') || fallbackEnd;
    }, [decodedData, searchParams, fallbackEnd]);

    const [expandBreakdown, setExpandBreakdown] = useState(true);
    const [openPolicyModal, setOpenPolicyModal] = useState(false);
    const [policiesAccepted, setPoliciesAccepted] = useState(localStorage.getItem('policiesAccepted') ? JSON.parse(localStorage.getItem('policiesAccepted')) : false);

    // Logistics Options State
    const [dropoffOption, setDropoffOption] = useState('same'); // 'same' | 'elsewhere'
    const [dropoffLocation, setDropoffLocation] = useState(''); // 'same' | 'elsewhere'

    // Payment Setup State
    const [paymentMethod, setPaymentMethod] = useState('m-pesa');

    const vehicleID = resolvedParams.vehicleID;

    if (!decodedData || vehicleID != decodedData?.vehicleID) {
        showToast('There was a critical error when resolving booking data!', 'error');
        return <div className='max-w-screen h-screen text-red-500 text-center py-6'>Something went wrong!</div>;
    }

    // Prefer the secure payload parameters, fallback to finding it inside the local collections arrays
    const VehicleDetails = decodedData?.VehicleDetails || vehicles.find(v => v.id === parseInt(vehicleID));
    const [pickupOption, setPickupOption] = useState(VehicleDetails?.location || ''); // 'default' | 'nairobi' | 'airport' | 'Outside Major Yards'

    // Date Parsing Logic
    const startDay = dayjs(start);
    const endDay = dayjs(end);
    const dayGap = startDay.isValid() && endDay.isValid() ? endDay.diff(start, "day") : 0;

    // Extract calculated totalDays directly from token data or calculate from fields dynamically
    const totalDays = decodedData?.bookingInformation?.totalDays || (dayGap <= 0 ? 1 : dayGap);

    // Transform raw input or state into uniform, clean ISO date strings
    const startDayString = dayjs(start).format('YYYY-MM-DD'); // Outputs e.g., "2026-06-28"
    const endDayString = dayjs(end).format('YYYY-MM-DD');   // Outputs e.g., "2026-07-02"
    const rentalTimeString = dayjs(start).format('HH:mm:ss'); // Outputs e.g., "18:30:00"


    // Cost Computations
    const baseRateTotal = totalDays * VehicleDetails.daily_rate;

    const getPickupFee = () => {
        if (pickupOption === 'Nairobi') return 1000;
        if (pickupOption === 'Airport (JKIA - NBO)') return 1500;
        if (pickupOption === 'Airport (Wilson Airport - WIL)') return 1500;
        if (pickupOption === 'Outside Major Yards') return 2000;
        return 0; // default branch
    };
    const getDropOffFee = () => {
        if (dropoffOption === 'elsewhere') return 200;
        return 0; // default branch
    };

    const pickupFee = getPickupFee();
    const dropFee = getDropOffFee();
    const rescuePlanFee = 200;
    const grossSubTotal = baseRateTotal + pickupFee + rescuePlanFee + dropFee;
    const vatAmount = Math.round(grossSubTotal * 0.16);
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
    const handleCheckoutSubmit = async () => {
        setError(null);
        const buffer = Number(profile?.fleetmaster_tenants?.buffer);

        if (!profile) {
            showToast('Please sign in to your account to place a booking!', 'error');
            return;
        }
        if (!policiesAccepted) {
            showToast('Please read and accept the terms of rental to proceed!', 'error');
            return;
        }
        if (paymentMethod === 'm-pesa' && !mpesaNumber) {
            showToast('Please enter a valid M-Pesa phone number!', 'error');
            return;
        }
        if (dropoffOption === 'elsewhere' && dropoffLocation === '') {
            showToast('Please select a dropoff location to proceed!', 'error');
            return;
        }
        if (VehicleDetails.status === 'Not Available') {
            showToast('This vehicle is not available for booking at the moment!', 'error');
            return;
        }

        setIsPaying(true);
        const firstName = profile?.first_name; // Keeping your custom profile schema spelling
        const lastName = profile?.last_name;

        // --- BRANCH 1: ONE-CLICK DIRECT M-PESA STK PUSH (NO MODAL) ---
        if (paymentMethod === 'm-pesa') {
            // --- SANITIZE AND NORMALIZE PHONE NUMBER INPUT ---
            let sanitizedNumber = sanitizeMpesaNo(mpesaNumber);


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
                        vehicleID,
                        rentalStart: startDayString,    // Format: YYYY-MM-DD
                        rentalEnd: endDayString,      // Format: YYYY-MM-DD
                        rentalTime: rentalTimeString,   // Format: HH:MM
                        tenantID: profile?.tenant_id,
                        userID: profile?.id,
                        buffer
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

                        const newBooking = {
                            total: Number(grandTotalAmount),
                            renter_phone: sanitizedNumber,
                            renter_name: `${firstName} ${lastName}`.trim(),
                            vehicle_id: Number(VehicleDetails?.id),
                            rental_start: startDayString,
                            rental_end: endDayString,
                            rental_time: rentalTimeString,
                            rental_days: Number(totalDays),
                            tenant_id: profile?.tenant_id,
                            user_id: profile?.id,
                            renter_id: profile?.national_id || "UNKNOWN",
                            pickup_location: pickupOption,
                            dropoff_location: dropoffOption === 'elsewhere' ? dropoffLocation : pickupOption,
                            payment_method: 'M-PESA',
                            payment_status: statusData.state,
                            intasend_invoice_id: targetCheckoutId,
                            payment_ref: mpesaRef
                        };

                        if (resultCode === "0") {
                            showToast('Payment Confirmed! Your booking has been processed successfully.', 'success');
                            successModal.openModal();
                            setPaymentSuccess(true);

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

                            const bookingRes = await createNewBooking({ ...newBooking, booking_status: 'Booked', });
                            const dbRes = await createPayment(newPayment);

                            console.log("Database payment update response:", dbRes);
                            console.log("Database booking insert response:", bookingRes);
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

                            const bookingRes = await createNewBooking({ ...newBooking, booking_status: 'Reserved' });
                            const dbRes = await createPayment(newPayment);

                            console.log("Database payment update response:", dbRes);
                            console.log("Database booking insert response:", bookingRes);
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




    useEffect(() => {
        if (!document.getElementById("intasend-inline-sdk")) {
            const script = document.createElement("script");
            script.id = "intasend-inline-sdk";
            script.src = "https://unpkg.com/intasend-checkout-sdk";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);


    if (loading) {
        return (
            <main className="space-y-6 p-6 container m-auto animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-6" />
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-7 space-y-6">
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-xl aspect-video" />
                        <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                    </div>
                    <div className="col-span-12 lg:col-span-5 h-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                </div>
            </main>
        );
    }

    if (!VehicleDetails) {
        return <VehicleNotFound />;
    }

    return (
        <main className="p-6 container m-auto">
            {/* Dynamic Header Promo Banner */}
            <DeliveryBanner />


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

            <div className="grid grid-cols-12 gap-6">

                {/* ================= LEFT SIDE: VEHICLE & LOGISTICS PRODUCTION PANEL (col-span-7) ================= */}
                <div className="col-span-12 lg:col-span-7 space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">

                        {/* Header Identity Meta */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {VehicleDetails.year} {VehicleDetails.make} {VehicleDetails.model}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Category: {VehicleDetails.category} | Class: {VehicleDetails.group}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    Self Driven
                                </span>
                            </div>
                        </div>

                        {/* Media Presentation Display Canvas */}
                        <div className='relative rounded-xl overflow-hidden mb-6 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800'>
                            <img src={VehicleDetails.image_url} alt={''} className="w-full object-cover relative object-center aspect-video" />
                            <Box className='flex gap-2' sx={{ position: 'absolute', top: 12, right: 12 }}>
                                <Chip size="small" className='' sx={{ px: 0.5, py: 1.5, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', backdropFilter: 'blur(4px)' }} icon={<LocalGasStationOutlinedIcon fontSize='small' style={{ color: '#fff' }} />} label={VehicleDetails.fuel_type} />
                                <Chip size="small" className='' sx={{ px: 0.5, py: 1.5, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', backdropFilter: 'blur(4px)' }} icon={<PeopleAltOutlinedIcon fontSize='small' style={{ color: '#fff' }} />} label={`${VehicleDetails.seats} Seats`} />
                            </Box>
                        </div>

                        {/* Core Specs Information Grid */}
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">Vehicle Specifications</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-sm mb-6">
                            <div>
                                <p className="text-gray-400 text-xs">Body Style / Type</p>
                                <p className="font-medium mt-1 text-gray-900 dark:text-gray-200">{VehicleDetails.group || 'SUV'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Transmission</p>
                                <p className="font-medium mt-1 text-gray-900 dark:text-gray-200">{VehicleDetails.transmission}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Fuel Category</p>
                                <p className="font-medium mt-1 text-gray-900 dark:text-gray-200">{VehicleDetails.fuel_type}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Luggage Allowance</p>
                                <p className="font-medium mt-1 text-gray-900 dark:text-gray-200">2 standard carry-ons</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Station Location</p>
                                <p className="font-medium mt-1 text-gray-900 dark:text-gray-200">{VehicleDetails.location}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Daily Base Rental Rate</p>
                                <p className="font-semibold mt-1 text-brand-500">Ksh. {VehicleDetails.daily_rate.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Logistics Configuration Layer */}
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 pt-4 border-t border-gray-100 dark:border-gray-800">Logistics & Distribution Preferences</h3>

                        <div className="space-y-4 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">1. Select Pickup Type & Fleet Handover</label>
                                <FormControl component="fieldset" className="w-full">
                                    <RadioGroup value={pickupOption} onChange={(e) => setPickupOption(e.target.value)} className="space-y-2">
                                        <div className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${pickupOption === VehicleDetails?.location ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                            <FormControlLabel value={VehicleDetails?.location} control={<Radio size="small" color="primary" />} label={<span className="text-sm dark:text-gray-200">Station Handover ({VehicleDetails?.location})</span>} />
                                            <span className="text-xs font-semibold text-gray-500">Free</span>
                                        </div>
                                        <div className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${pickupOption === 'Nairobi' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                            <FormControlLabel value="Nairobi" control={<Radio size="small" color="primary" />} label={<span className="text-sm dark:text-gray-200">Door Delivery within Nairobib (Work, Home, Office)</span>} />
                                            <span className="text-xs font-semibold text-blue-500">+ Ksh 1,000</span>
                                        </div>
                                        <div className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${pickupOption === 'Airport (JKIA - NBO)' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                            <FormControlLabel value="Airport (JKIA - NBO)" control={<Radio size="small" color="primary" />} label={<span className="text-sm dark:text-gray-200">Airport Dropoff (JKIA - NBO)</span>} />
                                            <span className="text-xs font-semibold text-blue-500">+ Ksh 1,500</span>
                                        </div>
                                        <div className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${pickupOption === 'Airport (Wilson Airport - WIL)' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                            <FormControlLabel value="Airport (Wilson Airport - WIL)" control={<Radio size="small" color="primary" />} label={<span className="text-sm dark:text-gray-200">Airport Dropoff (JKIA - NBO, Wilson Airport - WIL)</span>} />
                                            <span className="text-xs font-semibold text-blue-500">+ Ksh 1,500</span>
                                        </div>
                                        <div className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${pickupOption === 'Outside Major Yards' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                            <FormControlLabel value="Outside Major Yards" control={<Radio size="small" color="primary" />} label={<span className="text-sm dark:text-gray-200">Outside Major Yards (Distances max 100km out)</span>} />
                                            <span className="text-xs font-semibold text-blue-500">+ Ksh 2,000</span>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                            </div>

                            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">2. Drop-off Return Coordinates</label>
                                <FormControl component="fieldset" className="w-full">
                                    <RadioGroup value={dropoffOption} onChange={(e) => setDropoffOption(e.target.value)} row className="gap-4">
                                        <div className={`flex-1 flex items-center border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${dropoffOption === 'same' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                            <FormControlLabel value="same" control={<Radio size="small" color="primary" />} label={<span className="text-xs sm:text-sm dark:text-gray-200">Same Location Dropoff</span>} />
                                        </div>
                                        <div className={`flex-1 flex items-center border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${dropoffOption === 'elsewhere' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                            <FormControlLabel value="elsewhere" control={<Radio size="small" color="primary" />} label={<span className="text-xs sm:text-sm dark:text-gray-200">Specific Alternative Coordinate</span>} />
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>

                        {
                            dropoffOption === 'elsewhere' ? (
                                <>
                                    <p className='text-gray-500 text-sm mb-3 mt-3'>Other yards you can return to:</p>
                                    {
                                        tenant ? (
                                            <FormControl component="fieldset" className="w-full">
                                                <RadioGroup value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} className="space-y-2">
                                                    {
                                                        tenant?.yards.filter(y => y.title !== VehicleDetails?.location).length > 0 ? tenant?.yards.filter(y => y.title !== VehicleDetails?.location).map((y) => (
                                                            <div key={y.title} className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${dropoffLocation === y.title ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                                                <FormControlLabel value={y.title} control={<Radio size="small" color="primary" />} label={<span className="text-sm dark:text-gray-200">{y.title}</span>} />
                                                                <span className="text-xs font-semibold text-brand-500">+ Ksh 200</span>
                                                            </div>
                                                        )) :
                                                            <p className='text-red-500 mt-4 text-sm mb-3 nt-3 border-red-500 text-center ring-1 ring-red-500 flex-1 flex items-center justify-center border rounded-lg px-3 py-7 bg-white dark:bg-gray-900 '>
                                                                No other yards found!
                                                            </p>
                                                    }
                                                </RadioGroup>
                                            </FormControl>
                                        ) :
                                            <p className='text-red-500 mt-4 text-sm mb-3 nt-3 border-red-500 text-center ring-1 ring-red-500 flex-1 flex items-center justify-center border rounded-lg px-3 py-7 bg-white dark:bg-gray-900 '>
                                                No other locations!
                                            </p>
                                    }

                                </>
                            ) : <>
                                <p className='text-gray-500 dark:text-gray-400 mt-4 text-sm mb-3 nt-3 border-gray-500 ring-1 ring-gray-500 flex-1 flex items-center border rounded-lg px-3 py-3 bg-white dark:bg-gray-900 '>
                                    Dropoff at same location picked up ({pickupOption} - {end.replace('T', ', ')})
                                </p>
                            </>
                        }

                        {/* Explicit Modal Checkpoint Anchor */}
                        <div className={`mt-6 p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-amber-50/50 transition-colors duration-200 ${policiesAccepted
                            ? 'border-emerald-200 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                            : 'border-red-200 dark:border-red-900/50 dark:bg-red-950/20'
                            }`}>
                            <div className="flex items-start gap-3">
                                <InfoOutlinedIcon className={`mt-0.5 ${policiesAccepted ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                                    }`} />
                                <div>
                                    <h4 className={`text-sm font-bold text-red-800 ${policiesAccepted ? 'dark:text-emerald-300' : 'dark:text-red-500'
                                        }`}>
                                        Review Legal Rules & Handover Policies
                                    </h4>
                                    <p className={`text-xs mt-2 ${policiesAccepted ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
                                        }`}>
                                        You must review and acknowledge the documentation, liability thresholds, and insurance policies prior to booking fulfillment.
                                    </p>
                                    <p className="text-xs text-blue-500 mt-2 underline cursor-pointer" onClick={() => setOpenPolicyModal(true)}>
                                        Read Key Info & Policies Checklist.
                                    </p>
                                </div>
                            </div>
                            <Checkbox onChange={() => { }} checked={policiesAccepted} />
                        </div>

                    </div>
                </div>

                {/* ================= RIGHT SIDE: INVOICE & INTASEND GATEWAY (col-span-5) ================= */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                            Invoice Summary
                        </h3>

                        {/* Date Picking Mirror Layer */}
                        <div className="space-y-3 mb-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-xs text-gray-400">Handover Date</Label>
                                    <Input type="datetime-local" disabled className="text-xs mt-1" value={start} />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-400">Return Date</Label>
                                    <Input type="datetime-local" disabled className="text-xs mt-1" value={end} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 dark:bg-gray-950 p-2 rounded border dark:border-gray-800">
                                <span className="flex items-center gap-1"><ScheduleIcon fontSize="inherit" /> Computed Span:</span>
                                <span className="font-bold text-gray-800 dark:text-gray-200">{totalDays} Days</span>
                            </div>
                        </div>

                        {/* Dynamic Financial Statement Engine */}
                        {expandBreakdown && (
                            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-950/40 text-sm space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400">Duration Allocation</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{totalDays} Days</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400">Base Subtotal ({totalDays}d × Ksh {VehicleDetails.daily_rate.toLocaleString()})</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">Ksh. {baseRateTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400">Logistics Transfer Supplement</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">Ksh. {pickupFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400">Standard Incident Rescue Plan</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">Ksh. {rescuePlanFee}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400">Statutory VAT (16%)</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">Ksh. {vatAmount.toLocaleString()}</span>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-800 my-2" />
                            </div>
                        )}

                        {/* Grand Total Matrix Block */}
                        <div className="mt-4 flex items-center justify-between p-3 bg-brand-500/10 dark:bg-brand-500/5 rounded-xl border border-brand-500/20">
                            <span className="font-bold text-gray-900 dark:text-white text-base">Grand Payable Total:</span>
                            <span className="text-xl font-extrabold text-green-600 dark:text-green-500">
                                Ksh. {grandTotalAmount.toLocaleString()}
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
                            // isOpen
                            isOpen={successModal.isOpen}
                            onClose={successModal.closeModal}
                            className="max-w-150 p-5 lg:p-10"
                        >
                            <div className="text-center">
                                <div className="relative flex items-center justify-center mb-7">
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
                            <Button onClick={handleCheckoutSubmit} className="w-full intaSendPayButton" data-amount="10" data-currency="KES" size='md'
                                disabled={isPaying || paymentSuccess || !userVerified(profile)}
                            >
                                {!userVerified(profile) ? 'Verify account to book' : isPaying
                                    ? "Processing Transaction..."
                                    : `Pay Now (Ksh. ${grandTotalAmount.toLocaleString()})`
                                }
                            </Button>

                            <div className='flex mt-3 text-gray-500 gap-3 items-center text-sm w-1/2 mx-auto'>
                                <div className='w-full h-0.5 bg-gray-600'></div>
                                OR
                                <div className='w-full h-0.5 bg-gray-600'></div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Link className='w-full' href={'tel:+254768927617'}>
                                    <Button className='w-full' size='sm' variant='outline'>
                                        <PhoneOutlinedIcon fontSize='small' className="me-1" /> Call To Book
                                    </Button>
                                </Link>
                                <Link className='w-full' href={`https://wa.me/254768927617?text=I%20am%20interested%20in%20booking%20the%20${VehicleDetails.make}%20${VehicleDetails.model}`}>
                                    <Button className='w-full' size='sm' variant='success'>
                                        <SmsOutlinedIcon fontSize='small' className="me-1" /> WhatsApp Desk
                                    </Button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* ================= MUI REGULATORY & COMPLIANCE MODAL LAYER ================= */}
            <MuiModal
                open={openPolicyModal}
                onClose={() => setOpenPolicyModal(false)}
                aria-labelledby="policy-modal-title"
                aria-describedby="policy-modal-description"
            >
                <Box sx={modalStyle}>
                    {/* Outer container managing layout height and strict layout flex limits */}
                    <div className="dark:bg-gray-900 relative rounded-2xl bg-white dark:text-white dark:border-gray-800 custom-scrollbar max-h-[85vh] flex flex-col">

                        {/* Pinned Header */}
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 p-6 pb-3">
                            <Typography id="policy-modal-title" variant="h6" className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                Key Info & Policies Checklist
                            </Typography>
                            <IconButton onClick={() => setOpenPolicyModal(false)} size="small" className="dark:text-white">
                                <CloseIcon />
                            </IconButton>
                        </div>

                        {/* Dedicated Scroll Container holding your exact layout text content */}
                        <div id="policy-modal-description" className="flex-1 overflow-y-auto px-6 py-2 space-y-4 text-sm text-gray-600 dark:text-gray-300 custom-scrollbar leading-6">
                            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1"><GppGoodOutlinedIcon fontSize='small' />  Handover Documentation Verification</h4>
                            <section className='border border-gray-300 dark:border-gray-600 rounded-2xl p-3'>
                                <p className="mt-1 text-xs leading-6">When picking up your rental, you will need:</p>
                                <ul className="list-disc list-inside pl-2 text-xs mt-1 space-y-2 text-gray-500 dark:text-gray-400">
                                    <li>Primary renter Passport or ID Card</li>
                                    <li>Driver License for approved drivers</li>
                                    <li>Signed Contract</li>
                                    <li>Completed Payment</li>
                                </ul>
                            </section>
                            <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm inline-block items-center"><GppGoodOutlinedIcon fontSize='small' />  Similar Car Substitution Policy</h4>

                            <section className='border border-gray-300 dark:border-gray-600 rounded-2xl p-3'>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    The exact make and model of your booked vehicle may vary. We'll always provide a similar vehicle that meets your rental needs.
                                </p>
                                <ul className="list-disc list-inside pl-2 text-xs mt-1 space-y-2 text-gray-500 dark:text-gray-400">
                                    <li>Regular vehicle maintenance schedules</li>
                                    <li>Extended bookings by previous renters</li>
                                    <li>The dynamic nature of our rental operations</li>
                                </ul>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    This policy helps us ensure reliable service for all our customers.
                                </p>
                            </section>
                            <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm inline-block items-center"><GppGoodOutlinedIcon fontSize='small' />  Fuel Policy</h4>

                            <section className='border border-gray-300 dark:border-gray-600 rounded-2xl p-3'>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    Fuel is not included for self-drive or chauffeured bookings. Return the car at the same fuel level received (or higher) to avoid any fuel charges. Fuel is only included in quote-based bookings where explicitly stated.
                                </p>
                            </section>
                            <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm inline-block items-center"><GppGoodOutlinedIcon fontSize='small' />  Late Drop Policy</h4>

                            <section className='border border-gray-300 dark:border-gray-600 rounded-2xl p-3'>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    Most partners offer a ~1hr grace period. if you would like to extend a trip, give 24hrs notice.
                                </p>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-6 italic font-semibold">
                                    Please verify exact policy with rental partner
                                </p>
                            </section>

                            <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm inline-block items-center mt-6">
                                <GppGoodOutlinedIcon fontSize='small' /> &nbsp;Vandalism and Theft Liability Policy
                            </h4>

                            <section className='border border-gray-300 dark:border-gray-600 rounded-2xl p-3'>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    Renters are strictly responsible for the vehicle's security and structural integrity during the active booking window. In the event of malicious damage, break-ins, or vehicle theft, immediate operational protocols must be followed.
                                </p>
                                <ul className="list-disc list-inside pl-2 text-xs mt-1 space-y-2 text-gray-500 dark:text-gray-400">
                                    <li>Immediate reporting to the nearest police station to secure a formal abstract</li>
                                    <li>Mandatory notification to our fleet support desk within 2 hours of any incident</li>
                                    <li>Strict Zero-Tolerance for Intentional Vandalism: Any deliberate destruction, modification, interior tearing, or forced abuse of the vehicle by the renter will result in an immediate forfeiture of the security deposit.</li>
                                    <li>Renter liability for third-party theft is capped at the insurance deductible threshold, provided no negligence occurred</li>
                                </ul>
                                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    Failure to secure a police abstract, or evidence of damage, you (driver/renter) will be liable for these damages. Under these conditions, the renter remains fully liable for repair & replacement costs.
                                </p>
                            </section>

                            <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm inline-block items-center"><GppGoodOutlinedIcon fontSize='small' /> Free Cancelation &gt; 24hrs start time</h4>

                            <section className='border border-gray-300 dark:border-gray-600 rounded-2xl p-3'>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    Cancelations made more than 24hrs before the trip start time will receive a full refund.
                                </p>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    Cancelations within 24hrs, will not receive a refund.
                                </p>
                                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 leading-6 italic">
                                    Before signing rental agreement, verify exact policy of rental supplier you are matched with.
                                </p>
                            </section>
                            <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm inline-block items-center"><GppGoodOutlinedIcon fontSize='small' />  Trip Extensions</h4>

                            <section className='border border-gray-300 dark:border-gray-600 rounded-2xl p-3'>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    If you'd like to extend a trip, contact the rental office at least 24hrs before planned trip end.
                                </p>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    If the car is available for extension, you will be sent a payment link that you can use to extend your trip.
                                </p>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-6 font-semibold">
                                    Payment must be made before trip extension is valid.
                                </p>
                                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 leading-6 italic">
                                    Before signing rental agreement, verify exact policy of rental supplier you are matched with.
                                </p>
                            </section>
                            <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm inline-block items-center"><GppGoodOutlinedIcon fontSize='small' />  Mileage</h4>

                            <section className='border border-gray-300 dark:border-gray-600 rounded-2xl p-3'>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-6 font-semibold">
                                    Unlimited but strictly within the indicated area of use
                                </p>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    Mileage policy determines how many miles/kilometers you can drive during your car rental without paying any additional fees.
                                </p>
                                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 leading-6 italic">
                                    Before signing rental agreement, verify policy of rental supplier you are matched with.
                                </p>
                            </section>
                            <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm inline-block items-center"><GppGoodOutlinedIcon fontSize='small' />  Cross Border Transfer</h4>

                            <section className='border border-gray-300 dark:border-gray-600 rounded-2xl p-3'>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    Travel outside country is not permitted without pre approval. This normally requires an additional fee and reasonable notice time, so that the rental partner can file appropriate paperwork for the vehicle.
                                </p>
                                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 leading-6 italic">
                                    Before signing rental agreement, verify policy of rental supplier you are matched with.
                                </p>
                            </section>
                            <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm inline-block items-center"><GppGoodOutlinedIcon fontSize='small' />  Cleaning Policy</h4>

                            <section className='border border-gray-300 dark:border-gray-600 rounded-2xl p-3'>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-6">
                                    Additional Vehicle Cleaning: We charge a cleaning fee if the vehicle is returned excessively dirty, or with any strong odors, and requires extra cleaning.
                                </p>
                                <p className="mt-2 text-xs font-bold text-gray-500 dark:text-gray-300 leading-6">
                                    How to Avoid Charges
                                </p>
                                <ul className="list-disc list-inside pl-2 text-xs mt-1 space-y-2 text-gray-500 dark:text-gray-400">
                                    <li>Remove Trash: Clear all personal belongings and trash before returning.</li>
                                    <li>Quick Shake-out: Shake out floor mats to remove dirt.</li>
                                    <li>Do Not Smoke: Avoid smoking entirely in the car.</li>
                                    <li>Take Photos: Document the car's condition upon pickup and return.</li>
                                </ul>
                            </section>

                            <section className="bg-green-100 dark:bg-green-500/10 border border-green-100 dark:border-green-800 p-3 rounded-lg">
                                <h4 className="font-bold text-green-900 dark:text-green-300 text-xs sm:text-sm inline-block items-center"><GppGoodOutlinedIcon fontSize='small' /> Standard Self-Drive Liability Protection</h4>
                                <p className="mt-1 text-xs text-green-700 dark:text-green-400 leading-5">
                                    Includes mandatory structural parameters mirroring Collision Damage Waiver (CDW), Theft Protection (TP), and standard local Third-Party Liability. Maximum Financial Liability caps roughly at 8-10% of total asset book value during incident resolution.
                                </p>
                            </section>
                        </div>

                        {/* Pinned Action Buttons Footer */}
                        <div className="mt-auto border-t border-gray-100 dark:border-gray-800 p-6 pt-3 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
                            <Checkbox label='I have read all the terms, rules aand regulations. By approving, you legally bind execution parameters.' checked={policiesAccepted} onChange={() => {
                                setPoliciesAccepted(!policiesAccepted);
                                setOpenPolicyModal(false);

                                localStorage.setItem('policiesAccepted', JSON.stringify(!policiesAccepted))
                            }} />
                        </div>
                    </div>
                </Box>
            </MuiModal>
        </main>
    );
};

export default BookingPage;