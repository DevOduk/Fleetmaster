"use client";
import { use, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/ui/button/Button";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useUser } from "@/context/UserContext";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import MobileScreenShareOutlinedIcon from "@mui/icons-material/MobileScreenShareOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Chip,
  Modal as MuiModal,
  Typography,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useToast } from "@/context/ToastContext";
import Checkbox from "@/components/form/input/Checkbox";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { ArrowRightIcon } from "@/icons";
import Alert from "@/components/ui/alert/Alert";
import { createPayment } from "@/app/actions/payments";
import { useAdminFleet } from "@/context/AdminFleetContext";
import Select from "../form/Select";
import { PencilIcon, ChevronDownIcon } from "@/icons";
import { mpesaPollingIterval } from "../company-profile/CompanySubscriptionsCard";
import { createNewBooking } from "@/app/actions/bookings";
import { useAdminBooking } from "@/context/AdminBookingContext";
import { syncTimeToDateString } from "../client-components/hero/searchform";
import Image from "next/image";

dayjs.extend(isBetween);
const supabase = createClient();

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 750,
  maxHeight: "85vh",
  overflowY: "hidden",
  border: 0,
};

const CreateNewBookingForm = () => {
  const searchParams = useSearchParams();
  const { vehicles, loading } = useAdminFleet();
  const { profile } = useUser();
  const { showToast } = useToast();
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const successModal = useModal();
  const { isOpen, openModal, closeModal } = useModal();
  const { reloadBookings } = useAdminBooking();

  const token = searchParams.get("token");
  let decodedData = null;
  if (token) {
    try {
      decodedData = JSON.parse(decodeURIComponent(atob(token)));
    } catch (e) {
      console.error("Failed to parse vehicle rental token details:", e);
    }
  }

  const [expandBreakdown, setExpandBreakdown] = useState(true);
  const [openPolicyModal, setOpenPolicyModal] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(
    localStorage.getItem("policiesAccepted")
      ? JSON.parse(localStorage.getItem("policiesAccepted"))
      : false,
  );

  // Logistics Options State
  const [dropoffOption, setDropoffOption] = useState("same"); // 'same' | 'elsewhere'
  const [dropoffLocation, setDropoffLocation] = useState(""); // 'same' | 'elsewhere'
  const [renterName, setRenterName] = useState("");
  const [renterID, setRenterID] = useState("");
  const [VehicleDetails, setVehicleDetails] = useState(null);
  const fallbackStart = dayjs().add(1, "day").format("YYYY-MM-DD[T]HH:mm");
  const fallbackEnd = dayjs().add(3, "day").format("YYYY-MM-DD[T]HH:mm");

  // Payment Setup State
  const [paymentMethod, setPaymentMethod] = useState("m-pesa");
  const [selectedLocation, setSelectedLocation] =
    useState<string>("Countrywide");
  const [filters, setFilters] = useState<any>({
    driverType: "All",
    start: fallbackStart,
    end: fallbackEnd,
  });
  const startDayString = dayjs(filters.start).format("YYYY-MM-DD"); // Outputs e.g., "2026-06-28"
  const endDayString = dayjs(filters.end).format("YYYY-MM-DD"); // Outputs e.g., "2026-07-02"
  const rentalTimeString = dayjs(filters.start).format("HH:mm"); // Outputs e.g., "18:30:00"

  const allCategories = vehicles.map((v) => v.category);
  const allMakes = vehicles.map((v) => v.make);
  const allLocations = profile?.fleetmaster_tenants?.yards || [];

  const modelsForMake = (make: string) => {
    const vehicleModels = vehicles.filter((v) => v.make === make);
    return vehicleModels.map((v) => v.model);
  };

  const categories = [...new Set(allCategories)];
  const makes = [...new Set(allMakes)];
  const locations = [
    {
      title: "Countrywide",
      description:
        "Find rental vehicles all over the country through our countrywide selection",
      imageUrl:
        "https://images.goway.com/production/hero_image/Amboseli_AdobeStock_568345335.jpeg?VersionId=sEzQrGblBaQDhMGlcsN_UCovnYeM0tUf",
      location: [-1.286389, 36.817223],
    },
    ...allLocations,
  ];

  // Prefer the secure payload parameters, fallback to finding it inside the local collections arrays
  const [pickupOption, setPickupOption] = useState(
    VehicleDetails?.location || "",
  ); // 'default' | 'nairobi' | 'airport' | 'outside'

  // Extract calculated totalDays directly from token data or calculate from fields dynamically
  const totalDays = useMemo(() => {
    const startDay = dayjs(filters.start);
    const endDay = dayjs(filters.end);

    const dayGap =
      startDay.isValid() && endDay.isValid()
        ? endDay.diff(filters.start, "day")
        : 0;

    return dayGap <= 0 ? 1 : dayGap;
  }, [filters]);

  // Cost Computations
  const baseRateTotal = totalDays * VehicleDetails?.daily_rate || 0;

  const getPickupFee = () => {
    if (pickupOption === "nairobi") return 1000;
    if (pickupOption === "airport") return 1500;
    if (pickupOption === "outside") return 2000;
    return 0; // default branch
  };
  const getDropOffFee = () => {
    if (dropoffOption === "elsewhere") return 200;
    return 0; // default branch
  };

  const handleSave = () => {
    // 1. Create the single source of truth for the updated state
    const updatedFilters = { ...filters, location: selectedLocation };

    // 2. Update your local React component state
    setFilters(updatedFilters);
    closeModal();
  };

  const pickupFee = getPickupFee();
  const dropFee = getDropOffFee();
  const rescuePlanFee = 200;
  const grossSubTotal = baseRateTotal + pickupFee + rescuePlanFee + dropFee;
  const vatAmount = Math.round(grossSubTotal * 0.16);
  const grandTotalAmount = grossSubTotal + vatAmount;

  const sanitizeMpesaNo = (mpesaNumber: string) => {
    let sanitizedNumber = mpesaNumber.replace(/\D/g, "");

    if (sanitizedNumber.startsWith("0")) {
      sanitizedNumber = `254${sanitizedNumber.substring(1)}`;
    } else if (
      sanitizedNumber.startsWith("7") ||
      sanitizedNumber.startsWith("1")
    ) {
      sanitizedNumber = `254${sanitizedNumber}`;
    } else if (
      sanitizedNumber.startsWith("254") &&
      sanitizedNumber.length > 3
    ) {
      // Already formatted
    } else {
      console.warn(
        "Phone formatting fallback pattern encountered:",
        sanitizedNumber,
      );
    }

    if (sanitizedNumber.length !== 12) {
      showToast(
        "Please enter a valid 9 or 10-digit M-Pesa phone number.",
        "error",
      );
      setIsPaying(false);
      return null;
    }

    return sanitizedNumber;
  };

  const handleCheckoutSubmit = async () => {
    setError(null);

    if (!renterID || !renterName) {
      showToast("Please enter renter Name and ID to place a booking!", "error");
      return;
    }
    if (!policiesAccepted) {
      showToast(
        "Please read and accept the terms of rental to proceed!",
        "error",
      );
      return;
    }
    if (paymentMethod === "m-pesa" && !mpesaNumber) {
      showToast("Please enter a valid M-Pesa phone number!", "error");
      return;
    }
    if (!filters.start || !filters.end) {
      showToast("Please enter a valid Start and End Date!", "error");
      return;
    }
    if (totalDays < VehicleDetails?.min_rental_days) {
      showToast(
        `Please enter at least ${VehicleDetails?.min_rental_days} Days!`,
        "error",
      );
      return;
    }

    if (dropoffOption === "elsewhere" && dropoffLocation === "") {
      showToast("Please select a dropoff location to proceed!", "error");
      return;
    }
    if (VehicleDetails?.status === "Not Available") {
      showToast(
        "This vehicle is not available for booking at the moment!",
        "error",
      );
      return;
    }
    const sanitizedNumber = sanitizeMpesaNo(mpesaNumber);

    setIsPaying(true);
    const firstName = renterName.split(" ")[0]; // Keeping your custom profile schema spelling
    const lastName = renterName.split(" ")[1];

    // --- BRANCH 1: ONE-CLICK DIRECT M-PESA STK PUSH (NO MODAL) ---
    if (paymentMethod === "m-pesa") {
      let intervalId: NodeJS.Timeout | null = null;
      let safetyTimeoutId: NodeJS.Timeout | null = null;
      let hasHandledCompletion = false; // <-- Lock flag to prevent duplicate processing

      const clearPollingTimers = () => {
        if (intervalId) clearInterval(intervalId);
        if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
      };

      showToast("Checking rental vehicle availability...", "info");

      try {
        const res = await fetch("/api/mpesa/stk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(grandTotalAmount),
            phoneNumber: sanitizedNumber,
          }),
        });

        const data = await res.json();

        if (!res.ok || data.ResponseCode !== "0") {
          throw new Error(
            data.errorMessage ||
            data.ResponseDescription ||
            "Failed to dispatch M-Pesa push.",
          );
        }

        const targetCheckoutId = data.CheckoutRequestID;
        if (!targetCheckoutId) {
          throw new Error(
            "No tracking CheckoutRequestID returned from M-Pesa gateway.",
          );
        }

        showToast(
          "STK Push Request Sent! Please enter your M-Pesa PIN",
          "info",
        );

        intervalId = setInterval(async () => {
          // If already handled by a previous tick, skip execution completely
          if (hasHandledCompletion) return;

          try {
            const statusRes = await fetch("/api/mpesa/status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ checkoutRequestID: targetCheckoutId }),
            });

            const statusData = await statusRes.json();
            const resultCode = statusData.ResultCode;
            const responseCode = statusData.ResponseCode;

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
              user_id: null,
              renter_id: renterID || "UNKNOWN",
              pickup_location: pickupOption,
              dropoff_location:
                dropoffOption === "elsewhere" ? dropoffLocation : pickupOption,
              payment_method: "M-PESA",
              intasend_invoice_id: targetCheckoutId,
              payment_ref: mpesaRef,
            };

            if (resultCode === "0") {
              showToast(
                "Payment Confirmed! Your booking has been processed successfully.",
                "success",
              );
              successModal.openModal();
              setPaymentSuccess(true);

              const newPayment = {
                tenant_id: profile?.tenant_id,
                intasend_invoice_id: targetCheckoutId,
                provider: "M-PESA",
                provider_reference: mpesaRef,
                amount: Number(grandTotalAmount),
                currency: "KES",
                account_number: sanitizedNumber,
                payment_ref: mpesaRef,
                user_id: profile?.id || null,
                status: "Success",
                message:
                  "Confirmed! Your booking has been processed successfully.",
              };

              const bookingRes = await createNewBooking({
                ...newBooking,
                booking_status: "Booked",
                payment_status: "COMPLETE",
              }, profile?.email, profile?.fleetmaster_tenants, profile?.first_name);
              const dbRes = await createPayment(newPayment);


              reloadBookings(); // <-- Trigger a refresh of the bookings list in the parent component
            } else {
              const failReason =
                statusData.ResultDesc || "Transaction was canceled or failed.";
              showToast(failReason, "error");
              setError({ message: failReason });

              const newPayment = {
                tenant_id: profile?.tenant_id,
                intasend_invoice_id: targetCheckoutId,
                provider: "M-PESA",
                provider_reference: mpesaRef,
                amount: Number(grandTotalAmount),
                currency: "KES",
                account_number: sanitizedNumber,
                payment_ref: mpesaRef,
                user_id: null,
                status: "Failed",
                message: failReason,
              };


              await createNewBooking({
                ...newBooking,
                booking_status: "Reserved",
                payment_status: "FAILED",
              }, profile?.email, profile?.fleetmaster_tenants, profile?.first_name);
              await createPayment(newPayment);
            }
          } catch (pollErr) {
            console.error(
              "Error during background status poll checking:",
              pollErr,
            );
          }
        }, mpesaPollingIterval);

        safetyTimeoutId = setTimeout(() => {
          if (!hasHandledCompletion) {
            hasHandledCompletion = true;
            clearPollingTimers();
            setIsPaying(false);
            showToast(
              "Payment verification timed out. Please check your transaction history.",
              "error",
            );
          }
        }, 65000);
      } catch (err: any) {
        setError(err);
        console.error("Direct STK Push Failed:", err);
        showToast(err.message || "M-Pesa STK verification failed.", "error");
        setIsPaying(false);
      }

      // --- BRANCH 2: SECURE CARD CHECKOUT via BACKEND INLINE MODAL ---
    } else {
      showToast(
        "Card payment checkout not available! Consult support.",
        "error",
      );
      setIsPaying(false);
      setError({
        message: "Card payment checkout not available! Consult support.",
      });

      return;
    }
  };

  const filteredVehicles = useMemo(() => {
    if (!filters) {
      return vehicles;
    }
    const filtered = vehicles.filter((vehicle) => {
      const matchesLocation =
        filters.location && filters.location !== "Countrywide"
          ? vehicle.location === filters.location
          : true;

      // If driverType filter is set to "All" or not specified, show all. Otherwise, match the type strictly.
      const matchesDriverType =
        filters.driverType && filters.driverType !== "All"
          ? vehicle.driver_type === filters.driverType
          : true;

      const matchesCategory = filters.category
        ? vehicle.category === filters.category
        : true;
      const matchesMake = filters.make ? vehicle.make === filters.make : true;
      const matchesModel = filters.model
        ? vehicle.model === filters.model
        : true;
      const matchesYear =
        (filters.minYear ? vehicle.year >= filters.minYear : true) &&
        (filters.maxYear ? vehicle.year <= filters.maxYear : true);
      const matchesPrice =
        (filters.minPrice ? vehicle.daily_rate >= filters.minPrice : true) &&
        (filters.maxPrice ? vehicle.daily_rate <= filters.maxPrice : true);

      return (
        matchesLocation &&
        matchesDriverType &&
        matchesCategory &&
        matchesMake &&
        matchesModel &&
        matchesYear &&
        matchesPrice
      );
    });
    return filtered;
  }, [filters, vehicles]);

  if (loading) {
    return (
      <main className="container m-auto animate-pulse space-y-6 p-6">
        <div className="mb-6 h-6 w-1/4 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 space-y-6 lg:col-span-7">
            <div className="aspect-video w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-20 rounded-xl bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="col-span-12 h-96 rounded-xl bg-gray-200 lg:col-span-5 dark:bg-gray-800" />
        </div>
      </main>
    );
  }

  // if (!VehicleDetails) {
  //   return <VehicleNotFound />;
  // }

  return (
    <main className="container m-auto p-6">
      <div className="space-y-5">
        {isPaying && (
          <Alert
            title="Payment Processing!"
            variant="info"
            message="Your payment is being processed. Check your phone."
          />
        )}
        {paymentSuccess && (
          <Alert
            title="Payment Confirmed!"
            variant="success"
            message="Your payment was successful. A receipt and your booking details have been sent to your email. If you have any questions, contact support."
          />
        )}

        {error && (
          <Alert
            title="Payment Error!"
            variant="error"
            message={
              error?.message || "An error occured. Please try again later!"
            }
          />
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ================= LEFT SIDE: VEHICLE & LOGISTICS PRODUCTION PANEL (col-span-7) ================= */}
        {VehicleDetails ? (
          <div className="col-span-12 space-y-6 lg:col-span-7">
            <div className="ms-auto mt-3 text-right text-gray-500 italic">
              Remove and select another
              <Button
                onClick={() => setVehicleDetails(null)}
                className="ms-5"
                variant="danger"
                size="sm"
              >
                Clear Selection
              </Button>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {/* Header Identity Meta */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {VehicleDetails?.year} {VehicleDetails?.make}{" "}
                    {VehicleDetails?.model}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Category: {VehicleDetails?.category} | Class:{" "}
                    {VehicleDetails?.group}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Self Driven
                  </span>
                </div>
              </div>

              {/* Media Presentation Display Canvas */}
              <div className="relative mb-6 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                <Box
                  className="flex gap-2"
                  sx={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}
                >
                  <Chip
                    size="small"
                    sx={{
                      px: 0.5,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      backdropFilter: "blur(4px)",
                    }}
                    icon={
                      <LocalGasStationOutlinedIcon
                        fontSize="small"
                        style={{ color: "#fff" }}
                      />
                    }
                    label={VehicleDetails?.fuel_type}
                  />
                  <Chip
                    size="small"
                    sx={{
                      px: 0.5,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      backdropFilter: "blur(4px)",
                    }}
                    icon={
                      <PeopleAltOutlinedIcon
                        fontSize="small"
                        style={{ color: "#fff" }}
                      />
                    }
                    label={`${VehicleDetails?.seats} Seats`}
                  />
                </Box>
                <img
                  src={VehicleDetails?.image_url}
                  alt={""}
                  className="aspect-video w-full object-cover object-center"
                />
              </div>

              {/* Core Specs Information Grid */}
              <h3 className="mb-3 border-b border-gray-100 pb-2 text-base font-bold text-gray-900 dark:border-gray-800 dark:text-white">
                Vehicle Specifications
              </h3>
              <div className="mb-6 grid grid-cols-2 gap-x-2 gap-y-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-400">Body Style / Type</p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-gray-200">
                    {VehicleDetails?.group || "SUV"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Transmission</p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-gray-200">
                    {VehicleDetails?.transmission}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Fuel Category</p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-gray-200">
                    {VehicleDetails?.fuel_type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Luggage Allowance</p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-gray-200">
                    2 standard carry-ons
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Station Location</p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-gray-200">
                    {VehicleDetails?.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">
                    Daily Base Rental Rate
                  </p>
                  <p className="text-brand-500 mt-1 font-semibold">
                    Ksh. {VehicleDetails?.daily_rate.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Logistics Configuration Layer */}
              <h3 className="mb-3 border-t border-gray-100 pt-4 text-base font-bold text-gray-900 dark:border-gray-800 dark:text-white">
                Logistics & Distribution Preferences
              </h3>

              <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    1. Select Pickup Type & Fleet Handover
                  </label>
                  <FormControl component="fieldset" className="w-full">
                    <RadioGroup
                      value={pickupOption}
                      onChange={(e) => setPickupOption(e.target.value)}
                      className="space-y-2"
                    >
                      <div
                        className={`flex items-center justify-between rounded-lg border bg-white px-3 py-2 dark:bg-gray-900 ${pickupOption === VehicleDetails?.location ? "border-brand-500 ring-brand-500 ring-1" : "border-gray-200 dark:border-gray-800"}`}
                      >
                        <FormControlLabel
                          value={VehicleDetails?.location}
                          control={<Radio size="small" color="primary" />}
                          label={
                            <span className="text-sm dark:text-gray-200">
                              Station Handover ({VehicleDetails?.location})
                            </span>
                          }
                        />
                        <span className="text-xs font-semibold text-gray-500">
                          Free
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-between rounded-lg border bg-white px-3 py-2 dark:bg-gray-900 ${pickupOption === "nairobi" ? "border-brand-500 ring-brand-500 ring-1" : "border-gray-200 dark:border-gray-800"}`}
                      >
                        <FormControlLabel
                          value="nairobi"
                          control={<Radio size="small" color="primary" />}
                          label={
                            <span className="text-sm dark:text-gray-200">
                              Door Delivery within Nairobi
                            </span>
                          }
                        />
                        <span className="text-xs font-semibold text-blue-500">
                          + Ksh 1,000
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-between rounded-lg border bg-white px-3 py-2 dark:bg-gray-900 ${pickupOption === "JKIA - NBO" ? "border-brand-500 ring-brand-500 ring-1" : "border-gray-200 dark:border-gray-800"}`}
                      >
                        <FormControlLabel
                          value="JKIA - NBO"
                          control={<Radio size="small" color="primary" />}
                          label={
                            <span className="text-sm dark:text-gray-200">
                              Airport Dropoff (JKIA - NBO)
                            </span>
                          }
                        />
                        <span className="text-xs font-semibold text-blue-500">
                          + Ksh 1,500
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-between rounded-lg border bg-white px-3 py-2 dark:bg-gray-900 ${pickupOption === "Wilson Airport - WIL" ? "border-brand-500 ring-brand-500 ring-1" : "border-gray-200 dark:border-gray-800"}`}
                      >
                        <FormControlLabel
                          value="Wilson Airport - WIL"
                          control={<Radio size="small" color="primary" />}
                          label={
                            <span className="text-sm dark:text-gray-200">
                              Airport Dropoff (JKIA - NBO, Wilson Airport - WIL)
                            </span>
                          }
                        />
                        <span className="text-xs font-semibold text-blue-500">
                          + Ksh 1,500
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-between rounded-lg border bg-white px-3 py-2 dark:bg-gray-900 ${pickupOption === "outside" ? "border-brand-500 ring-brand-500 ring-1" : "border-gray-200 dark:border-gray-800"}`}
                      >
                        <FormControlLabel
                          value="outside"
                          control={<Radio size="small" color="primary" />}
                          label={
                            <span className="text-sm dark:text-gray-200">
                              Outside Major Yards (Distances max 100km out)
                            </span>
                          }
                        />
                        <span className="text-xs font-semibold text-blue-500">
                          + Ksh 2,000
                        </span>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </div>

                <div className="border-t border-gray-200 pt-2 dark:border-gray-800">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    2. Drop-off Return Coordinates
                  </label>
                  <FormControl component="fieldset" className="w-full">
                    <RadioGroup
                      value={dropoffOption}
                      onChange={(e) => setDropoffOption(e.target.value)}
                      row
                      className="gap-4"
                    >
                      <div
                        className={`flex flex-1 items-center rounded-lg border bg-white px-3 py-2 dark:bg-gray-900 ${dropoffOption === "same" ? "border-brand-500 ring-brand-500 ring-1" : "border-gray-200 dark:border-gray-800"}`}
                      >
                        <FormControlLabel
                          value="same"
                          control={<Radio size="small" color="primary" />}
                          label={
                            <span className="text-xs sm:text-sm dark:text-gray-200">
                              Same Location Dropoff
                            </span>
                          }
                        />
                      </div>
                      <div
                        className={`flex flex-1 items-center rounded-lg border bg-white px-3 py-2 dark:bg-gray-900 ${dropoffOption === "elsewhere" ? "border-brand-500 ring-brand-500 ring-1" : "border-gray-200 dark:border-gray-800"}`}
                      >
                        <FormControlLabel
                          value="elsewhere"
                          control={<Radio size="small" color="primary" />}
                          label={
                            <span className="text-xs sm:text-sm dark:text-gray-200">
                              Specific Alternative Coordinate
                            </span>
                          }
                        />
                      </div>
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>

              {dropoffOption === "elsewhere" ? (
                <>
                  <p className="mt-3 mb-3 text-sm text-gray-500">
                    Other yards you can return to:
                  </p>
                  {profile?.fleetmaster_tenants ? (
                    <FormControl component="fieldset" className="w-full">
                      <RadioGroup
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        className="space-y-2"
                      >
                        {profile?.fleetmaster_tenants?.yards.filter(
                          (y) => y.title !== VehicleDetails?.location,
                        ).length > 0 ? (
                          profile?.fleetmaster_tenants?.yards
                            .filter((y) => y.title !== VehicleDetails?.location)
                            .map((y) => (
                              <div
                                key={y.title}
                                className={`flex items-center justify-between rounded-lg border bg-white px-3 py-2 dark:bg-gray-900 ${dropoffLocation === y.title ? "border-brand-500 ring-brand-500 ring-1" : "border-gray-200 dark:border-gray-800"}`}
                              >
                                <FormControlLabel
                                  value={y.title}
                                  control={
                                    <Radio size="small" color="primary" />
                                  }
                                  label={
                                    <span className="text-sm dark:text-gray-200">
                                      {y.title}
                                    </span>
                                  }
                                />
                                <span className="text-brand-500 text-xs font-semibold">
                                  + Ksh 200
                                </span>
                              </div>
                            ))
                        ) : (
                          <p className="nt-3 mt-4 mb-3 flex flex-1 items-center justify-center rounded-lg border border-red-500 bg-white px-3 py-7 text-center text-sm text-red-500 ring-1 ring-red-500 dark:bg-gray-900">
                            No other yards found!
                          </p>
                        )}
                      </RadioGroup>
                    </FormControl>
                  ) : (
                    <p className="nt-3 mt-4 mb-3 flex flex-1 items-center justify-center rounded-lg border border-red-500 bg-white px-3 py-7 text-center text-sm text-red-500 ring-1 ring-red-500 dark:bg-gray-900">
                      No other locations!
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="nt-3 mt-4 mb-3 flex flex-1 items-center rounded-lg border border-gray-500 bg-white px-3 py-3 text-sm text-gray-500 ring-1 ring-gray-500 dark:bg-gray-900 dark:text-gray-400">
                    Dropoff at same location picked up ({pickupOption} -{" "}
                    {filters.end.replace("T", ", ")})
                  </p>
                </>
              )}

              {/* Explicit Modal Checkpoint Anchor */}
              <div
                className={`mt-6 flex flex-col items-start justify-between gap-3 rounded-xl border bg-amber-50/50 p-4 transition-colors duration-200 sm:flex-row sm:items-center ${policiesAccepted
                  ? "border-emerald-200 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                  : "border-red-200 dark:border-red-900/50 dark:bg-red-950/20"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <InfoOutlinedIcon
                    className={`mt-0.5 ${policiesAccepted
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                      }`}
                  />
                  <div>
                    <h4
                      className={`text-sm font-bold text-amber-900 ${policiesAccepted
                        ? "dark:text-emerald-300"
                        : "dark:text-red-300"
                        }`}
                    >
                      Review Legal Rules & Handover Policies
                    </h4>
                    <p
                      className={`mt-2 text-xs ${policiesAccepted
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-red-700 dark:text-red-400"
                        }`}
                    >
                      You must review and acknowledge the documentation,
                      liability thresholds, and insurance policies prior to
                      booking fulfillment.
                    </p>
                    <p
                      className="text-brand-500 mt-2 cursor-pointer text-xs underline"
                      onClick={() => setOpenPolicyModal(true)}
                    >
                      Read Key Info & Policies Checklist.
                    </p>
                  </div>
                </div>
                <Checkbox onChange={() => { }} checked={policiesAccepted} />
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-12 space-y-6 text-gray-400 lg:col-span-7">
            <div className="flex aspect-video items-center justify-center rounded-2xl border border-gray-400 p-3 dark:border-gray-600">
              No Vehicle Selected!
            </div>

            <div className="mb-3 rounded-2xl bg-gray-500/3 shadow dark:bg-gray-500/10">
              <div className="relative">
                <Box
                  className="flex h-full w-full items-end gap-2 rounded-xl p-4 font-bold text-white bg-blend-darken"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "linear-gradient(to top, black, transparent)",
                  }}
                >
                  {locations?.find((l) => l.title === filters?.location)
                    ?.title || "Countrywide"}
                  <Box
                    onClick={openModal}
                    className="flex cursor-pointer items-end gap-2 rounded-lg bg-gray-900/40 p-1 px-2 text-sm font-medium text-green-400 bg-blend-darken"
                    sx={{ position: "absolute", top: 10, right: 10 }}
                  >
                    <PencilIcon /> Change
                  </Box>
                </Box>
                <img
                  src={
                    locations?.find((l) => l.title === filters?.location)
                      ?.imageUrl ||
                    "https://images.goway.com/production/hero_image/Amboseli_AdobeStock_568345335.jpeg?VersionId=sEzQrGblBaQDhMGlcsN_UCovnYeM0tUf"
                  }
                  alt={
                    locations?.find((l) => l.title === filters?.location)
                      ?.title || "Countrywide"
                  }
                  className="h-35 w-full rounded-xl object-cover"
                />
              </div>

              <Modal
                isOpen={isOpen}
                onClose={() => {
                  setFilters({ ...filters, location: "CountryWide" });
                  closeModal();
                }}
                className="max-w-150 p-5 lg:p-10"
              >
                <h4 className="text-title-sm mb-7 font-semibold text-gray-800 dark:text-white/90">
                  Change Location
                </h4>
                <div className="custom-scrollbar flex max-h-125 flex-col gap-3 overflow-auto">
                  {locations.map((l, i) => (
                    <div
                      key={i}
                      className={`relative rounded-2xl border-2 ${l.title === selectedLocation ? "border-green-500" : "border-transparent"}`}
                    >
                      <Box
                        onClick={() => setSelectedLocation(l?.title)}
                        className="z-9 flex h-full w-full cursor-pointer items-end gap-2 rounded-xl p-4 font-medium text-white bg-blend-darken"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          background:
                            "linear-gradient(to top, black, transparent)",
                        }}
                      >
                        {l?.title}
                        <Box
                          className="flex cursor-pointer items-end gap-2 rounded-lg bg-gray-900/40 p-1 px-3 text-sm text-gray-100 bg-blend-darken"
                          sx={{ position: "absolute", top: 10, right: 10 }}
                        >
                          {selectedLocation === l?.title ? (
                            <span className="text-green-400">
                              <DoneAllOutlinedIcon fontSize="small" /> Selected
                            </span>
                          ) : (
                            <>Select</>
                          )}
                        </Box>
                      </Box>
                      <img
                        src={l?.imageUrl}
                        alt={''}
                        className="h-35 w-full rounded-xl object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex w-full items-center justify-end gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    Close
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </Modal>
            </div>

            <div className="my-5 flex rounded-2xl bg-gray-500/5">
              {["All", "Self Drive", "Chauffeured"].map((d, i) => (
                <button
                  key={d}
                  onClick={() => setFilters({ ...filters, driverType: d })}
                  className={
                    filters?.driverType === d
                      ? "small bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition"
                      : "inline-flex w-full items-center justify-center gap-2 rounded-lg border-0 bg-transparent px-4 py-2 text-sm font-medium text-gray-500 transition"
                  }
                >
                  {d}
                </button>
              ))}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                  Filters
                </h4>
              </div>
              {/* Category Dropdown */}
              <div className="mb-2">
                <Label>Category</Label>
                <div className="relative">
                  <Select
                    value={filters?.category}
                    defaultValue={filters?.category}
                    options={categories.map((c) => ({ value: c, label: c }))}
                    placeholder="Select category"
                    onChange={(e) =>
                      setFilters({ ...filters, category: e || "" })
                    }
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              {/* Make Dropdown */}
              <div className="mb-2 flex w-full gap-2">
                <div className="w-full">
                  <Label>Make</Label>
                  <div className="relative">
                    <Select
                      value={filters?.make}
                      defaultValue={filters?.make}
                      options={makes.map((c) => ({ value: c, label: c }))}
                      placeholder="Select Make"
                      onChange={(e) =>
                        setFilters({ ...filters, make: e || "" })
                      }
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                {/* Model Dropdown */}
                <div className="w-full">
                  <Label>Model</Label>
                  <div className="relative">
                    <Select
                      value={filters?.model}
                      defaultValue={filters?.model}
                      options={modelsForMake(filters?.make).map((c) => ({
                        value: c,
                        label: c,
                      }))}
                      placeholder="Select Model"
                      onChange={(e) =>
                        setFilters({ ...filters, model: e || "" })
                      }
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
              </div>

              {/* Year Range Inputs */}
              <div className="mb-2">
                <Label>Year</Label>
                <div className="flex w-full gap-2">
                  <div className="w-full">
                    <div className="relative">
                      <Select
                        options={[
                          { value: "2020", label: "2020" },
                          { value: "2022", label: "2022" },
                          { value: "2024", label: "2024" },
                        ]}
                        placeholder="Min Year"
                        onChange={(e) =>
                          setFilters({ ...filters, minYear: parseInt(e) || 0 })
                        }
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="relative">
                      <Select
                        options={[
                          { value: "2023", label: "2023" },
                          { value: "2025", label: "2025" },
                          { value: "2026", label: "2026" },
                        ]}
                        placeholder="Max Year"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxYear: parseInt(e) || 2026,
                          })
                        }
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Range Fields */}
              <div className="mt-3 mb-2">
                <Label>Matches ({filteredVehicles.length} found)</Label>
                <div className="mt-3 flex w-full flex-col gap-3">
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((v) => (
                      <div
                        onClick={() => {
                          setVehicleDetails(v);
                          window.scrollTo(0, 0);
                        }}
                        className="flex w-full cursor-pointer items-center gap-3 p-2"
                        key={v.id}
                      >
                        <div className="aspect-video w-30 relative">
                          <Image
                            src={v?.image_url}
                            alt={``}
                            preload
                            fill
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg object-cover object-center"
                          />
                        </div>
                        <div>
                          <p>{`${v.make} ${v.model} ${v.year} ${v.color[0]}`}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-500">{`${v.category} | ${v.daily_rate?.toLocaleString()}/=`}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 text-center text-red-500">
                      Nothing to show!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= RIGHT SIDE: INVOICE & INTASEND GATEWAY (col-span-5) ================= */}
        <div className="col-span-12 space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 border-b border-gray-100 pb-2 text-lg font-bold text-gray-900 dark:border-gray-800 dark:text-white">
              Invoice Summary
            </h3>

            {/* Date Picking Mirror Layer */}
            <div className="mb-4 space-y-3">
              <div>
                <Label className="text-xs text-gray-400">Renter Name</Label>
                <Input
                  value={renterName}
                  placeholder="e.g John Doe"
                  onChange={(e) => setRenterName(e.target.value)}
                />
                <small className="mt-2 text-sm text-red-500">
                  {renterName.trim() &&
                    renterName.trim().split(" ").length < 2 &&
                    "Please enter renter full name!"}
                </small>
              </div>

              <div>
                <Label className="text-xs text-gray-400">Renter ID</Label>
                <Input
                  value={renterID}
                  placeholder="e.g 12389176"
                  onChange={(e) => setRenterID(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-400">Handover Date</Label>
                  <Input
                    type="datetime-local"
                    className="mt-1 text-xs"
                    value={
                      filters.start
                        ? dayjs(filters.start).format("YYYY-MM-DDTHH:mm")
                        : ""
                    }
                    onChange={(e) => {
                      const newStart = e.target.value; // e.g., "2026-06-22T14:30"
                      // Force the existing end date to adopt this new start time
                      const updatedEnd = syncTimeToDateString(
                        filters.end,
                        newStart,
                      );

                      setFilters({
                        ...filters,
                        start: newStart,
                        end: updatedEnd,
                      });
                    }}
                    name="start_date"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Return Date</Label>
                  <Input
                    type="datetime-local"
                    className="mt-1 text-xs"
                    value={
                      filters.end
                        ? dayjs(filters.end).format("YYYY-MM-DDTHH:mm")
                        : ""
                    }
                    onChange={(e) => {
                      const newEnd = e.target.value; // e.g., "2026-06-25T16:00"
                      // Force the existing start date to adopt this new end time
                      const updatedStart = syncTimeToDateString(
                        filters.start,
                        newEnd,
                      );

                      setFilters({
                        ...filters,
                        start: updatedStart,
                        end: newEnd,
                      });
                    }}
                    name="end_date"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded border bg-gray-50 p-2 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-950">
                <span className="flex items-center gap-1">
                  <ScheduleIcon fontSize="inherit" /> Computed Span:
                </span>
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {totalDays} Days
                </span>
              </div>
            </div>

            {/* Dynamic Financial Statement Engine */}
            {expandBreakdown && (
              <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-sm dark:border-gray-800 dark:bg-gray-950/40">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Duration Allocation
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {totalDays} Days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Base Subtotal ({totalDays}d × Ksh{" "}
                    {VehicleDetails?.daily_rate.toLocaleString()})
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Ksh. {baseRateTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Logistics Transfer Supplement
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Ksh. {pickupFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Standard Incident Rescue Plan
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Ksh. {rescuePlanFee}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Statutory VAT (16%)
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Ksh. {vatAmount.toLocaleString()}
                  </span>
                </div>

                <div className="my-2 border-t border-gray-200 dark:border-gray-800" />
              </div>
            )}

            {/* Grand Total Matrix Block */}
            <div className="bg-brand-500/10 dark:bg-brand-500/5 border-brand-500/20 mt-4 flex items-center justify-between rounded-xl border p-3">
              <span className="text-base font-bold text-gray-900 dark:text-white">
                Grand Payable Total:
              </span>
              <span className="text-xl font-extrabold text-green-600 dark:text-green-500">
                Ksh. {grandTotalAmount.toLocaleString()}
              </span>
            </div>

            <p
              role="button"
              className="text-brand-500 mt-2 mb-6 cursor-pointer text-left text-xs font-medium underline"
              onClick={() => setExpandBreakdown(!expandBreakdown)}
            >
              {expandBreakdown
                ? "Hide itemized breakdowns"
                : "Expose line-item invoice data"}
            </p>

            {/* Billing Gateway Gateway Interface Config */}
            <h4 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">
              3. Choose Payment Method
            </h4>
            <FormControl component="fieldset" className="mb-6 w-full">
              {/* Use ONE RadioGroup mapped directly to your state variable */}
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="space-y-3"
              >
                {/* M-Pesa Option Layout Box */}
                <div
                  onClick={() => setPaymentMethod("m-pesa")}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border bg-white px-3 py-2 transition-colors dark:bg-gray-900 ${paymentMethod === "m-pesa"
                    ? "border-brand-500 bg-brand-50/5"
                    : "border-gray-200 dark:border-gray-800"
                    }`}
                >
                  <FormControlLabel
                    value="m-pesa"
                    control={<Radio size="small" />}
                    label={
                      <div className="flex items-center gap-2">
                        <MobileScreenShareOutlinedIcon
                          className="text-brand-500"
                          fontSize="small"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          M-Pesa Instant PayBill
                        </span>
                      </div>
                    }
                  />
                </div>

                {/* Card Option Layout Box */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border bg-white px-3 py-2 transition-colors dark:bg-gray-900 ${paymentMethod === "card"
                    ? "border-brand-500 bg-brand-50/5"
                    : "border-gray-200 dark:border-gray-800"
                    }`}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio size="small" />}
                    label={
                      <div className="flex items-center gap-2">
                        <CreditCardIcon
                          className="text-brand-500"
                          fontSize="small"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Bank Instant Checkout (VISA/MASTER Card)
                        </span>
                      </div>
                    }
                  />
                </div>
              </RadioGroup>
            </FormControl>

            <div className="mt-4 mb-4 transition-all duration-200">
              {paymentMethod === "m-pesa" && (
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
                    <span className="absolute top-1/2 left-0 flex h-11 w-13.75 -translate-y-1/2 items-center justify-center border-r border-gray-200 text-sm dark:border-gray-800 dark:text-white">
                      +254
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
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
                      <span className="absolute top-1/2 left-0 flex h-11 w-11.5 -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
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
                        max={"5"}
                        placeholder="MM/YY"
                        className="mt-2 w-full text-center"
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
                        max={"4"}
                        placeholder="•••"
                        className="mt-2 w-full text-center tracking-widest"
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
              className="z-99999 max-w-150 p-5 lg:p-10"
            >
              <div className="text-center">
                <div className="relative z-1 mb-7 flex items-center justify-center">
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

                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
                <h4 className="sm:text-title-sm mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Confirmed! Payment Successful.
                </h4>
                <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Your payment was successful. A receipt and your booking
                  details have been sent to your email. If you have any
                  questions, contact support or view your booking in the
                  dashboard.
                </p>

                <div className="mt-7 flex w-full items-center justify-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    endIcon={<ArrowRightIcon />}
                  >
                    Go to bookings
                  </Button>
                  <button
                    type="button"
                    onClick={successModal.closeModal}
                    className="bg-success-500 shadow-theme-xs hover:bg-success-600 flex w-full justify-center rounded-lg px-4 py-3 text-sm font-medium text-white sm:w-auto"
                  >
                    Okay, Got It
                  </button>
                </div>
              </div>
            </Modal>

            <div className="space-y-5">
              {isPaying && (
                <Alert
                  title="Payment Processing!"
                  variant="info"
                  message="Your payment is being processed. Check your phone."
                />
              )}
              {paymentSuccess && (
                <Alert
                  title="Payment Confirmed!"
                  variant="success"
                  message="Your payment was successful. A receipt and your booking details have been sent to your email. If you have any questions, contact support."
                />
              )}

              {error && (
                <Alert
                  title="Payment Error!"
                  variant="error"
                  message={
                    error?.message ||
                    "An error occured. Please try again later!"
                  }
                />
              )}
            </div>
            {/* Dynamic Call-To-Action Operations Routing Grid */}
            <div className="mt-4 space-y-3">
              <Button
                onClick={handleCheckoutSubmit}
                className="intaSendPayButton w-full"
                data-amount="10"
                data-currency="KES"
                size="md"
                disabled={isPaying || paymentSuccess}
              >
                {isPaying
                  ? "Processing Transaction..."
                  : `Pay Now (Ksh. ${grandTotalAmount.toLocaleString()})`}
              </Button>

              <div className="flex items-center gap-3">
                <Link className="w-full" href={"tel:+254768927617"}>
                  <Button className="w-full" size="sm" variant="outline">
                    <PhoneOutlinedIcon fontSize="small" className="me-1" /> Call
                    To Book
                  </Button>
                </Link>
                <Link
                  className="w-full"
                  href={`https://wa.me/254768927617?text=I%20am%20interested%20in%20booking%20the%20${VehicleDetails?.make}%20${VehicleDetails?.model}`}
                >
                  <Button className="w-full" size="sm" variant="success">
                    <SmsOutlinedIcon fontSize="small" className="me-1" />{" "}
                    WhatsApp Desk
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
          <div className="custom-scrollbar relative flex max-h-[85vh] flex-col rounded-2xl bg-white dark:border-gray-800 dark:bg-gray-900 dark:text-white">
            {/* Pinned Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-6 pb-3 dark:border-gray-800">
              <Typography
                id="policy-modal-title"
                variant="h6"
                className="flex items-center gap-2 font-bold text-gray-900 dark:text-white"
              >
                Key Info & Policies Checklist
              </Typography>
              <IconButton
                onClick={() => setOpenPolicyModal(false)}
                size="small"
                className="dark:text-white"
              >
                <CloseIcon />
              </IconButton>
            </div>

            {/* Dedicated Scroll Container holding your exact layout text content */}
            <div
              id="policy-modal-description"
              className="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-6 py-2 text-sm leading-6 text-gray-600 dark:text-gray-300"
            >
              <h4 className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
                <GppGoodOutlinedIcon fontSize="small" /> Handover Documentation
                Verification
              </h4>
              <section className="rounded-2xl border border-gray-300 p-3 dark:border-gray-600">
                <p className="mt-1 text-xs leading-6">
                  When picking up your rental, you will need:
                </p>
                <ul className="mt-1 list-inside list-disc space-y-2 pl-2 text-xs text-gray-500 dark:text-gray-400">
                  <li>Primary renter Passport or ID Card</li>
                  <li>Driver License for approved drivers</li>
                  <li>Signed Contract</li>
                  <li>Completed Payment</li>
                </ul>
              </section>
              <h4 className="inline-block items-center text-xs font-bold text-gray-900 sm:text-sm dark:text-white">
                <GppGoodOutlinedIcon fontSize="small" /> Similar Car
                Substitution Policy
              </h4>

              <section className="rounded-2xl border border-gray-300 p-3 dark:border-gray-600">
                <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  The exact make and model of your booked vehicle may vary.
                  We'll always provide a similar vehicle that meets your rental
                  needs.
                </p>
                <ul className="mt-1 list-inside list-disc space-y-2 pl-2 text-xs text-gray-500 dark:text-gray-400">
                  <li>Regular vehicle maintenance schedules</li>
                  <li>Extended bookings by previous renters</li>
                  <li>The dynamic nature of our rental operations</li>
                </ul>
                <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  This policy helps us ensure reliable service for all our
                  customers.
                </p>
              </section>
              <h4 className="inline-block items-center text-xs font-bold text-gray-900 sm:text-sm dark:text-white">
                <GppGoodOutlinedIcon fontSize="small" /> Fuel Policy
              </h4>

              <section className="rounded-2xl border border-gray-300 p-3 dark:border-gray-600">
                <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  Fuel is not included for self-drive or chauffeured bookings.
                  Return the car at the same fuel level received (or higher) to
                  avoid any fuel charges. Fuel is only included in quote-based
                  bookings where explicitly stated.
                </p>
              </section>
              <h4 className="inline-block items-center text-xs font-bold text-gray-900 sm:text-sm dark:text-white">
                <GppGoodOutlinedIcon fontSize="small" /> Late Drop Policy
              </h4>

              <section className="rounded-2xl border border-gray-300 p-3 dark:border-gray-600">
                <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  Most partners offer a ~1hr grace period. if you would like to
                  extend a trip, give 24hrs notice.
                </p>
                <p className="mt-2 text-xs leading-6 font-semibold text-gray-500 italic dark:text-gray-400">
                  Please verify exact policy with rental partner
                </p>
              </section>

              <h4 className="mt-6 inline-block items-center text-xs font-bold text-gray-900 sm:text-sm dark:text-white">
                <GppGoodOutlinedIcon fontSize="small" /> &nbsp;Vandalism and
                Theft Liability Policy
              </h4>

              <section className="rounded-2xl border border-gray-300 p-3 dark:border-gray-600">
                <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  Renters are strictly responsible for the vehicle's security
                  and structural integrity during the active booking window. In
                  the event of malicious damage, break-ins, or vehicle theft,
                  immediate operational protocols must be followed.
                </p>
                <ul className="mt-1 list-inside list-disc space-y-2 pl-2 text-xs text-gray-500 dark:text-gray-400">
                  <li>
                    Immediate reporting to the nearest police station to secure
                    a formal abstract
                  </li>
                  <li>
                    Mandatory notification to our fleet support desk within 2
                    hours of any incident
                  </li>
                  <li>
                    Strict Zero-Tolerance for Intentional Vandalism: Any
                    deliberate destruction, modification, interior tearing, or
                    forced abuse of the vehicle by the renter will result in an
                    immediate forfeiture of the security deposit.
                  </li>
                  <li>
                    Renter liability for third-party theft is capped at the
                    insurance deductible threshold, provided no negligence
                    occurred
                  </li>
                </ul>
                <p className="mt-3 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  Failure to secure a police abstract, or evidence of damage,
                  you (driver/renter) will be liable for these damages. Under
                  these conditions, the renter remains fully liable for repair &
                  replacement costs.
                </p>
              </section>

              <h4 className="inline-block items-center text-xs font-bold text-gray-900 sm:text-sm dark:text-white">
                <GppGoodOutlinedIcon fontSize="small" /> Free Cancelation &gt;
                24hrs start time
              </h4>

              <section className="rounded-2xl border border-gray-300 p-3 dark:border-gray-600">
                <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  Cancelations made more than 24hrs before the trip start time
                  will receive a full refund.
                </p>
                <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  Cancelations within 24hrs, will not receive a refund.
                </p>
                <p className="mt-2 text-xs leading-6 text-gray-400 italic dark:text-gray-500">
                  Before signing rental agreement, verify exact policy of rental
                  supplier you are matched with.
                </p>
              </section>
              <h4 className="inline-block items-center text-xs font-bold text-gray-900 sm:text-sm dark:text-white">
                <GppGoodOutlinedIcon fontSize="small" /> Trip Extensions
              </h4>

              <section className="rounded-2xl border border-gray-300 p-3 dark:border-gray-600">
                <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  If you'd like to extend a trip, contact the rental office at
                  least 24hrs before planned trip end.
                </p>
                <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  If the car is available for extension, you will be sent a
                  payment link that you can use to extend your trip.
                </p>
                <p className="mt-2 text-xs leading-6 font-semibold text-gray-500 dark:text-gray-400">
                  Payment must be made before trip extension is valid.
                </p>
                <p className="mt-2 text-xs leading-6 text-gray-400 italic dark:text-gray-500">
                  Before signing rental agreement, verify exact policy of rental
                  supplier you are matched with.
                </p>
              </section>
              <h4 className="inline-block items-center text-xs font-bold text-gray-900 sm:text-sm dark:text-white">
                <GppGoodOutlinedIcon fontSize="small" /> Mileage
              </h4>

              <section className="rounded-2xl border border-gray-300 p-3 dark:border-gray-600">
                <p className="mt-1 text-xs leading-6 font-semibold text-gray-500 dark:text-gray-400">
                  Unlimited but strictly within the indicated area of use
                </p>
                <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  Mileage policy determines how many miles/kilometers you can
                  drive during your car rental without paying any additional
                  fees.
                </p>
                <p className="mt-2 text-xs leading-6 text-gray-400 italic dark:text-gray-500">
                  Before signing rental agreement, verify policy of rental
                  supplier you are matched with.
                </p>
              </section>
              <h4 className="inline-block items-center text-xs font-bold text-gray-900 sm:text-sm dark:text-white">
                <GppGoodOutlinedIcon fontSize="small" /> Cross Border Transfer
              </h4>

              <section className="rounded-2xl border border-gray-300 p-3 dark:border-gray-600">
                <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  Travel outside country is not permitted without pre approval.
                  This normally requires an additional fee and reasonable notice
                  time, so that the rental partner can file appropriate
                  paperwork for the vehicle.
                </p>
                <p className="mt-2 text-xs leading-6 text-gray-400 italic dark:text-gray-500">
                  Before signing rental agreement, verify policy of rental
                  supplier you are matched with.
                </p>
              </section>
              <h4 className="inline-block items-center text-xs font-bold text-gray-900 sm:text-sm dark:text-white">
                <GppGoodOutlinedIcon fontSize="small" /> Cleaning Policy
              </h4>

              <section className="rounded-2xl border border-gray-300 p-3 dark:border-gray-600">
                <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  Additional Vehicle Cleaning: We charge a cleaning fee if the
                  vehicle is returned excessively dirty, or with any strong
                  odors, and requires extra cleaning.
                </p>
                <p className="mt-2 text-xs leading-6 font-bold text-gray-500 dark:text-gray-300">
                  How to Avoid Charges
                </p>
                <ul className="mt-1 list-inside list-disc space-y-2 pl-2 text-xs text-gray-500 dark:text-gray-400">
                  <li>
                    Remove Trash: Clear all personal belongings and trash before
                    returning.
                  </li>
                  <li>Quick Shake-out: Shake out floor mats to remove dirt.</li>
                  <li>Do Not Smoke: Avoid smoking entirely in the car.</li>
                  <li>
                    Take Photos: Document the car's condition upon pickup and
                    return.
                  </li>
                </ul>
              </section>

              <section className="rounded-lg border border-green-100 bg-green-100 p-3 dark:border-green-800 dark:bg-green-500/10">
                <h4 className="inline-block items-center text-xs font-bold text-green-900 sm:text-sm dark:text-green-300">
                  <GppGoodOutlinedIcon fontSize="small" /> Standard Self-Drive
                  Liability Protection
                </h4>
                <p className="mt-1 text-xs leading-5 text-green-700 dark:text-green-400">
                  Includes mandatory structural parameters mirroring Collision
                  Damage Waiver (CDW), Theft Protection (TP), and standard local
                  Third-Party Liability. Maximum Financial Liability caps
                  roughly at 8-10% of total asset book value during incident
                  resolution.
                </p>
              </section>
            </div>

            {/* Pinned Action Buttons Footer */}
            <div className="mt-auto flex flex-col items-center justify-between gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50 p-6 pt-3 sm:flex-row dark:border-gray-800 dark:bg-gray-900/50">
              <Checkbox
                label="I have read all the terms, rules aand regulations. By approving, you legally bind execution parameters."
                checked={policiesAccepted}
                onChange={() => {
                  setPoliciesAccepted(!policiesAccepted);
                  setOpenPolicyModal(false);

                  localStorage.setItem(
                    "policiesAccepted",
                    JSON.stringify(!policiesAccepted),
                  );
                }}
              />
            </div>
          </div>
        </Box>
      </MuiModal>
    </main>
  );
};

export default CreateNewBookingForm;
