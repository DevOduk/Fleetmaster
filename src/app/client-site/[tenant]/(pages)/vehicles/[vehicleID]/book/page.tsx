"use client";
import { use, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

// UI Components & Contexts
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import VehicleNotFound from '@/components/vehicles/NotFound';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { useFleet } from '@/context/FleetContext';
import { useUser } from '@/context/UserContext';
import { useTenant } from '@/context/TenantContext';
import LocalCarWashOutlinedIcon from "@mui/icons-material/LocalCarWashOutlined"
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined"
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined"
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined"
import MobileScreenShareOutlinedIcon from "@mui/icons-material/MobileScreenShareOutlined"
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Material UI
import { Box, Chip, Modal, Typography, IconButton, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useToast } from '@/context/ToastContext';

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
};

const BookingPage = ({ params }: VehiclePageProps) => {
    const searchParams = useSearchParams();
    const resolvedParams = use(params);
    const { vehicles, loading } = useFleet();
    const { profile } = useUser();
    const { tenant } = useTenant();
    const { showToast } = useToast();

    // --- TOKEN EXTRACTION AND PARSING ---
    const token = searchParams.get('token');
    let decodedData = null;
    if (token) {
        try {
            decodedData = JSON.parse(decodeURIComponent(atob(token)));
        } catch (e) {
            console.error("Failed to parse vehicle rental token details:", e);
        }
    }

    // Basic Setup & State (Extract defaults from token payload fallback to search parameters)
    const [start, setStart] = useState(decodedData?.bookingInformation?.start || searchParams.get('start') || '');
    const [end, setEnd] = useState(decodedData?.bookingInformation?.end || searchParams.get('end') || '');
    const [expandBreakdown, setExpandBreakdown] = useState(true);
    const [openPolicyModal, setOpenPolicyModal] = useState(false);
    const [policiesAccepted, setPoliciesAccepted] = useState(false);

    // Logistics Options State
    const [pickupOption, setPickupOption] = useState('default'); // 'default' | 'nairobi' | 'airport' | 'outside'
    const [dropoffOption, setDropoffOption] = useState('same'); // 'same' | 'elsewhere'
    const [dropoffLocation, setDropoffLocation] = useState(''); // 'same' | 'elsewhere'

    // Payment Setup State
    const [paymentMethod, setPaymentMethod] = useState('m-pesa');

    const vehicleID = resolvedParams.vehicleID;

    if (vehicleID !== decodedData?.vehicleID) {
        showToast('There was a critical error when resolving booking!', 'error');
        return;
    }

    // Prefer the secure payload parameters, fallback to finding it inside the local collections arrays
    const VehicleDetails = decodedData?.VehicleDetails || vehicles.find(v => v.id === parseInt(vehicleID));

    // Date Parsing Logic
    const startDay = dayjs(start);
    const endDay = dayjs(end);
    const dayGap = startDay.isValid() && endDay.isValid() ? endDay.diff(start, "day") : 0;

    // Extract calculated totalDays directly from token data or calculate from fields dynamically
    const totalDays = decodedData?.bookingInformation?.totalDays || (dayGap <= 0 ? 1 : dayGap);

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

    // Cost Computations
    const baseRateTotal = totalDays * VehicleDetails.dailyRate;

    const getPickupFee = () => {
        if (pickupOption === 'nairobi') return 1000;
        if (pickupOption === 'airport') return 1500;
        if (pickupOption === 'outside') return 2000;
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

    const handleCheckoutSubmit = () => {
        if (!profile) {
            showToast('Please sign in to your account to place a booking!', 'error')
            return;
        }
        if (!policiesAccepted) {
            showToast('Please read and accept the terms of rental to proceed!', 'error')
            return;
        }
        if (dropoffOption === 'elsewhere' && dropoffLocation === '') {
            showToast('Please select a dropoff location to proceed!', 'error');
            return;
        }
        // Paystack integration payload initialization goes here
        showToast(`Initializing Paystack processing for KSH. ${grandTotalAmount.toLocaleString()} via ${paymentMethod}...`, 'info');
    };
    return (
        <main className="p-6 container m-auto">
            {/* Dynamic Header Promo Banner */}
            <div className="col-span-full bg-gray-100 dark:bg-gray-800 items-center flex gap-4 border border-gray-200 dark:border-gray-700 rounded-xl mb-6 p-4">
                <img className="w-32 object-contain hidden md:block" src={'https://indigocarhire.co.uk/wp-content/uploads/header_22-768x281.png'} alt="Delivery Banner" />
                <div>
                    <h5 className="text-gray-900 dark:text-white font-semibold">Flexible Logistics Available</h5>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Choose between picking up at our station or request seamless localized direct doorstep delivery services.</p>
                    <p className="text-brand-500 font-medium text-xs mt-1">📍 1,000 Ksh Within Nairobi | 1,500 Ksh Airport Dropoffs | 2,000 Ksh Outside Nairobi (&lt;100km)</p>
                </div>
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
                            <Box className='flex gap-2' sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
                                <Chip size="small" sx={{ px: 0.5, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', backdropFilter: 'blur(4px)' }} icon={<LocalGasStationOutlinedIcon fontSize='small' style={{ color: '#fff' }} />} label={VehicleDetails.fuelType} />
                                <Chip size="small" sx={{ px: 0.5, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', backdropFilter: 'blur(4px)' }} icon={<PeopleAltOutlinedIcon fontSize='small' style={{ color: '#fff' }} />} label={`${VehicleDetails.seats} Seats`} />
                            </Box>
                            <img src={VehicleDetails.imageUrl} alt={`${VehicleDetails.make}`} className="w-full object-cover object-center aspect-video" />
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
                                <p className="font-medium mt-1 text-gray-900 dark:text-gray-200">{VehicleDetails.fuelType}</p>
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
                                <p className="font-semibold mt-1 text-brand-500">Ksh. {VehicleDetails.dailyRate.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Logistics Configuration Layer */}
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 pt-4 border-t border-gray-100 dark:border-gray-800">Logistics & Distribution Preferences</h3>

                        <div className="space-y-4 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">1. Select Pickup Type & Fleet Handover</label>
                                <FormControl component="fieldset" className="w-full">
                                    <RadioGroup value={pickupOption} onChange={(e) => setPickupOption(e.target.value)} className="space-y-2">
                                        <div className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${pickupOption === 'default' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                            <FormControlLabel value="default" control={<Radio size="small" color="primary" />} label={<span className="text-sm dark:text-gray-200">Station Handover ({VehicleDetails?.location})</span>} />
                                            <span className="text-xs font-semibold text-gray-500">Free</span>
                                        </div>
                                        <div className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${pickupOption === 'nairobi' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                            <FormControlLabel value="nairobi" control={<Radio size="small" color="primary" />} label={<span className="text-sm dark:text-gray-200">Door Delivery within Nairobi</span>} />
                                            <span className="text-xs font-semibold text-brand-500">+ Ksh 1,000</span>
                                        </div>
                                        <div className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${pickupOption === 'airport' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                            <FormControlLabel value="airport" control={<Radio size="small" color="primary" />} label={<span className="text-sm dark:text-gray-200">Airport Dropoff (JKIA - NBO, Wilson Airport - WIL)</span>} />
                                            <span className="text-xs font-semibold text-brand-500">+ Ksh 1,500</span>
                                        </div>
                                        <div className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${pickupOption === 'outside' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                            <FormControlLabel value="outside" control={<Radio size="small" color="primary" />} label={<span className="text-sm dark:text-gray-200">Outside Nairobi (Distances max 100km out)</span>} />
                                            <span className="text-xs font-semibold text-brand-500">+ Ksh 2,000</span>
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

                        list of our yards
                        {
                            dropoffOption === 'elsewhere' && (
                                <>other yards you can return to
                                    {
                                        tenant ? (
                                            <FormControl component="fieldset" className="w-full">
                                                <RadioGroup value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} className="space-y-2">
                                                    {
                                                        tenant?.yards.filter(y => y.title !== VehicleDetails?.location).map((y) => (
                                                            <div key={y.title} className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${dropoffLocation === y.title ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
                                                                <FormControlLabel value={y.title} control={<Radio size="small" color="primary" />} label={<span className="text-sm dark:text-gray-200">{y.title}</span>} />
                                                                <span className="text-xs font-semibold text-brand-500">+ Ksh 200</span>
                                                            </div>
                                                        ))
                                                    }
                                                </RadioGroup>
                                            </FormControl>
                                        ) : <div>No other locations!</div>
                                    }

                                </>
                            )
                        }

                        {/* Explicit Modal Checkpoint Anchor */}
                        <div className="mt-6 p-4 rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex items-start gap-3">
                                <InfoOutlinedIcon className="text-amber-600 dark:text-amber-400 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">Review Legal Rules & Handover Policies</h4>
                                    <p className="text-xs text-amber-700 dark:text-amber-400">You must review and acknowledge documentation, liability thresholds, and insurance policies prior to booking fulfillment.</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => setOpenPolicyModal(true)}
                                variant={policiesAccepted ? "success" : "outline"}
                                size="sm"
                                className="whitespace-nowrap w-full sm:w-auto"
                            >
                                {policiesAccepted ? "Rules Read & Approved ✓" : "Read Essential Rules"}
                            </Button>
                        </div>

                    </div>
                </div>

                {/* ================= RIGHT SIDE: INVOICE & PAYSTACK GATEWAY (col-span-5) ================= */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm sticky top-6">

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
                                    <span className="text-gray-500 dark:text-gray-400">Base Subtotal ({totalDays}d × Ksh {VehicleDetails.dailyRate.toLocaleString()})</span>
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

                        <div className="mt-4 transition-all duration-200">
                            {paymentMethod === 'm-pesa' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                        M-Pesa Mobile Number
                                    </label>
                                    <div className="relative mt-2">
                                        <Input
                                            type="tel"
                                            placeholder="e.g., 0712345678"
                                            className="pl-[62px]"
                                        // value={mpesaNumber}
                                        // onChange={(e) => setMpesaNumber(e.target.value)}
                                        />
                                        <span className="absolute left-0 top-1/2 flex text-sm h-11 w-[55px] dark:text-white -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
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
                                                className="pl-[62px]"
                                            // value={cardNumber}
                                            // onChange={(e) => setCardNumber(e.target.value)}
                                            />
                                            <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
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

                        {/* Dynamic Call-To-Action Operations Routing Grid */}
                        <div className="space-y-3 mt-4">
                            <Button onClick={handleCheckoutSubmit} className='w-full' size='md'>
                                Secure Checkout with Paystack
                            </Button>

                            <div className='flex items-center gap-3'>
                                <Link className='w-full' href={'tel:+254768927617'}>
                                    <Button className='w-full' size='sm' variant='outline'>
                                        <PhoneOutlinedIcon fontSize='small' className="me-1" /> Call Support
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
            <Modal
                open={openPolicyModal}
                onClose={() => setOpenPolicyModal(false)}
                aria-labelledby="policy-modal-title"
                aria-describedby="policy-modal-description"
            >
                <Box sx={modalStyle}>
                    {/* Outer container managing layout height and strict layout flex limits */}
                    <div className="dark:bg-gray-900 relative rounded-2xl bg-white dark:text-white border dark:border-gray-800 custom-scrollbar max-h-[85vh] flex flex-col">

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
                            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1 inline-block items-center"><GppGoodOutlinedIcon fontSize='small' />  Handover Documentation Verification</h4>
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
                                    <li>• Regular vehicle maintenance schedules</li>
                                    <li>• Extended bookings by previous renters</li>
                                    <li>• The dynamic nature of our rental operations</li>
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
                            <p className="text-xs text-gray-400">By approving, you legally bind execution parameters.</p>
                            <div className="flex gap-2 w-full sm:w-auto">
                                {/* <Button size="sm" variant="outline" onClick={() => { setPoliciesAccepted(false); setOpenPolicyModal(false); }}>Reject</Button> */}
                                <Button size="sm" variant="success" onClick={() => { setPoliciesAccepted(true); setOpenPolicyModal(false); }}>Acknowledge & Accept</Button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </main>
    );
};

export default BookingPage;