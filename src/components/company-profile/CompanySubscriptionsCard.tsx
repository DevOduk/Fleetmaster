"use client";

import {
  fetchTenantDetails,
  fetchTenantSubscriptions,
  updateTenantDetails,
} from "@/app/actions/tenant";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import ExpiryBanner, { getExpiryString } from "./ExpiryBanner";
import Input from "../form/input/InputField";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MobileScreenShareOutlinedIcon from "@mui/icons-material/MobileScreenShareOutlined";
import Button from "../ui/button/Button";
import { subscriptionPlans } from "@/data/globalExports";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/context/ToastContext";
import { createPayment } from "@/app/actions/payments";
import Alert from "../ui/alert/Alert";
import { Modal } from "../ui/modal";
import { ArrowRightIcon } from "@/icons";
import { createExpense } from "@/app/actions/expenses";
import LoadingInfo from "../loading/LoadingInfo";

export const mpesaPollingIterval = 22000;

interface Subscription {
  label: string;
  value: string;
  amount: number;
  method: string;
  date: string;
}

export default function CompanySubscriptionsCard() {
  const { profile, setProfile } = useUser();
  const [company, setCompany] = useState<any>(null);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("m-pesa");
  const [billingPeriod, setBillingPeriod] = useState(3);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState(null);
  const successModal = useModal();
  const { showToast } = useToast();

  const defaultSubscription: Subscription = {
    label: "Free Trial Plan",
    value: "Welcome to fleetmaster crm dashboard where you can manage your rental fleet with ease!",
    amount: 0,
    method: "M-PESA",
    date: company?.created_at || profile?.fleetmaster_tenants?.created_at,
  };

  const [subscriptionsList, setSubScriptionsList] = useState<Subscription[]>([
    defaultSubscription
  ]);

  useEffect(() => {
    const getTenantDetails = async () => {
      if (!profile?.tenant_id) {
        setLoadingCompany(false);
        return;
      }
      if (profile?.tenant_id) {
        const res = await fetchTenantDetails(profile.tenant_id);
        const subRes = await fetchTenantSubscriptions(profile.tenant_id);

        setCompany(res.data);
        setSubScriptionsList([...(subRes.data || []), defaultSubscription]);

        if (res) {
          setLoadingCompany(false);
        }
      }
    };

    getTenantDetails();
  }, [profile?.tenant_id]);

  const monthlyAmount = Number(subscriptionPlans[selectedIndex].price);
  const subtotalAmount = monthlyAmount * (billingPeriod);
  const vatAmount = subtotalAmount * 0.05;
  const grandTotalAmount = Math.round(subtotalAmount + vatAmount);


  // 1. Determine the base date to add 30 days to
  const currentExpiry = company?.expiry_date
    ? new Date(company.expiry_date).getTime()
    : 0;
  const now = new Date().getTime();

  // If current expiry is in the future, add 30 days to it. Otherwise, add to today.
  const baseTime = currentExpiry > now ? currentExpiry : now;
  const thirtyDaysInMs = (30 * 24 * 60 * 60 * 1000) * billingPeriod;
  const newExpiryTimestamp = baseTime + thirtyDaysInMs;

  // 2. Convert to ISO string for Supabase timestamptz compatibility
  const newExpiryIsoString = new Date(newExpiryTimestamp).toISOString();


  const createNewPayment = async () => {
    setError(null);

    if (!profile) {
      showToast(
        "Please sign in to your account to renew subscription!",
        "error",
      );
      return;
    }
    if (paymentMethod === "m-pesa" && !mpesaNumber) {
      showToast("Please enter a valid M-Pesa phone number!", "error");
      return;
    }

    setIsPaying(true);

    if (paymentMethod === "m-pesa") {
      showToast("Processing your security checks...", "info");

      let sanitizedNumber = mpesaNumber.replace(/\D/g, "");
      if (sanitizedNumber.startsWith("0")) {
        sanitizedNumber = `254${sanitizedNumber.substring(1)}`;
      } else if (
        sanitizedNumber.startsWith("7") ||
        sanitizedNumber.startsWith("1")
      ) {
        sanitizedNumber = `254${sanitizedNumber}`;
      }

      if (sanitizedNumber.length !== 12) {
        showToast(
          "Please enter a valid 9 or 10-digit M-Pesa phone number.",
          "error",
        );
        setIsPaying(false);
        return;
      }

      let intervalId: NodeJS.Timeout | null = null;
      let safetyTimeoutId: NodeJS.Timeout | null = null;

      const clearPollingTimers = () => {
        if (intervalId) clearInterval(intervalId);
        if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
      };

      try {
        // --- 1. CALL YOUR CUSTOM DARAJA STK ROUTE ---
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

        safetyTimeoutId = setTimeout(() => {
          clearPollingTimers();
          setIsPaying(false);
          setError({
            message:
              "Payment verification timed out. Please check your Phone and try again.",
          });
          showToast(
            "Payment verification timed out. Please check your Phone and try again",
            "error",
          );
        }, 65000);

        // --- 2. POLL DARAJA STATUS ENDPOINT ---
        intervalId = setInterval(async () => {
          try {
            const statusRes = await fetch("/api/mpesa/status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ checkoutRequestID: targetCheckoutId }),
            });

            const statusData = await statusRes.json();

            // Daraja returns ResultCode ('0' = Success, non-zero or user cancellation handles failure)
            const resultCode = statusData.ResultCode;
            const responseCode = statusData.ResponseCode;

            // If ResultCode is 0, payment succeeded
            if (resultCode === "0") {
              clearPollingTimers();
              setIsPaying(false);
              showToast(
                "Payment Confirmed! Your subscription renewal has been processed successfully.",
                "success",
              );
              successModal.openModal();
              setPaymentSuccess(true);

              const mpesaRef =
                statusData.MpesaReceiptNumber || targetCheckoutId;

              const newPayment = {
                tenant_id: profile?.tenant_id,
                intasend_invoice_id: targetCheckoutId,
                provider: "M-PESA",
                provider_reference: mpesaRef,
                amount: Number(grandTotalAmount),
                currency: "KES",
                account_number: sanitizedNumber,
                payment_ref: mpesaRef,
                user_id: profile.id,
                status: "Success",
                message: `Subscription renewal for package: ${subscriptionPlans[selectedIndex]?.name}`,
              };

              const newExpense = {
                tenant_id: profile?.tenant_id,
                category: "Subscription",
                method: "M-PESA",
                currency: "KES",
                amount: Number(grandTotalAmount),
                payment_ref: mpesaRef,
                description: `Subscription renewal for package: ${subscriptionPlans[selectedIndex]?.name}`,
              };

              await createPayment(newPayment);
              await createExpense(newExpense);

              const { admins, yards, ...cleanData } = company;

              const updatedTenant = {
                ...cleanData,
                subscription_status: "Active",
                subscription_plan: subscriptionPlans[selectedIndex]?.name,
                expiry_date: newExpiryIsoString,
              }

              const { data } = await updateTenantDetails(profile?.tenant_id, updatedTenant);
              setCompany(data);

              setProfile((profile: any) => ({
                ...profile,
                fleetmaster_tenants: {
                  ...profile.fleetmaster_tenants,
                  subscription_status: 'Active',
                  expiry_date: newExpiryIsoString
                }
              }))

              const subRes = await fetchTenantSubscriptions(profile.tenant_id);

              setSubScriptionsList([
                ...(subRes.data || []),
                defaultSubscription,
              ]);
            } else if (
              resultCode &&
              resultCode !== "0" &&
              resultCode !== "4999"
            ) {
              // ResultCode exists and is not 0 (User canceled, insufficient funds, etc.)
              clearPollingTimers();
              setIsPaying(false);
              const failReason =
                statusData.ResultDesc || "Transaction was canceled or failed.";
              showToast(failReason, "error");
              setError({ message: failReason });

              const newPayment = {
                tenant_id: profile.tenant_id,
                intasend_invoice_id: targetCheckoutId,
                provider: "M-PESA",
                provider_reference: targetCheckoutId,
                amount: Number(grandTotalAmount),
                currency: "KES",
                account_number: sanitizedNumber,
                payment_ref: targetCheckoutId,
                user_id: profile.id,
                status: "Failed",
                message: "Subscription renewal failure: " + failReason,
              };

              await createPayment(newPayment);
            }
            // If ResultCode is undefined, it means transaction is still processing on Safaricom's side; keep polling.
          } catch (pollErr) {
            console.error(
              "Error during background status poll checking:",
              pollErr,
            );
          }
        }, mpesaPollingIterval);
      } catch (err: any) {
        setError(err);
        console.error("Direct STK Push Failed:", err);
        showToast(err.message || "M-Pesa STK verification failed.", "error");
        setIsPaying(false);
      }
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

  useEffect(() => {
    if (!document.getElementById("intasend-inline-sdk")) {
      const script = document.createElement("script");
      script.id = "intasend-inline-sdk";
      script.src = "https://unpkg.com/intasend-checkout-sdk";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!profile || !profile.tenant_id || loadingCompany) {
    return <LoadingInfo />;
  }
  if (!company) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800">
        <div className="mb-4 text-4xl">🏢</div>
        <h3 className="text-lg font-semibold text-red-600">
          Company Not Found
        </h3>
        <p className="mt-2 max-w-sm text-gray-500">
          We couldn't locate a profile associated with your account. If you
          believe this is an error, please contact support.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <ExpiryBanner
        plan={company.subscription_plan}
        expiryDate={company.expiry_date}
      />

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
            Your payment was successful. A receipt and your subscription details
            have been sent to your email. If you have any questions, contact
            support.{" "}
          </p>

          <div className="mt-7 flex w-full items-center justify-center gap-3">
            <a href="/">
              <Button size="sm" variant="outline" endIcon={<ArrowRightIcon />}>
                Go to Dashboard
              </Button>
            </a>
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

      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            {company.tenant_logo ? (
              <img
                src={company.tenant_logo}
                alt="Company Logo"
                className="h-full w-full bg-white object-contain p-1"
              />
            ) : (
              <span className="text-xl font-bold text-gray-400">
                {company.name?.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {company.name}
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-gray-500">
                {company.slug}.fleetmaster.co.ke{" "}
                {company.website && ` - ${company.website}`}
              </p>
              <span className="text-xs text-gray-400">|</span>
              <p className="text-xs font-medium text-gray-500">
                {company.subscription_plan || "N/A"} Plan
              </p>
              <span className="text-xs text-gray-400">|</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${company.subscription_status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600"}`}
              >
                {company.subscription_status || "Inactive"}
              </span>
              <span className="text-xs text-gray-400">|</span>
              <p className="text-xs font-medium text-gray-500">
                {getExpiryString(company.expiry_date)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6">
        {/* new  subscription */}
        <ComponentCard title="Contact Information">
          <div className="text-gray-400">
            New subscriptions are automatically added to existing ones and
            features will update within 1 day
          </div>
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {subscriptionPlans?.map((plan, index) => (
              <div
                key={index}
                className={`border-brand-300 dark:border-brand-900 relative flex h-full cursor-pointer flex-col rounded-2xl border p-8 shadow-sm hover:-translate-y-5 dark:text-white ${selectedIndex === index ? "bg-brand-950 -translate-y-5" : "bg-transparent"} transition-all`}
                style={{ opacity: selectedIndex === index ? 1 : 0.85 }}
                onClick={() => setSelectedIndex(index)}
              >
                <h3
                  className={`text-brand-500 uppercase ${selectedIndex === index ? "font-semibold text-white" : ""}`}
                >
                  {plan?.name}
                </h3>
                <p
                  className={`text-muted mt-1 mb-5 text-xs ${selectedIndex === index ? "text-gray-300" : "text-muted"}`}
                >
                  {" "}
                  {plan?.tagline}
                </p>
                <div className="mb-3">
                  <span className="align-top text-sm text-gray-400">
                    {plan?.currency}
                  </span>
                  <span
                    className={`text- ml-1 text-4xl font-extrabold dark:text-white ${selectedIndex === index ? "text-white" : "text-black"}`}
                  >
                    {plan?.price}
                  </span>
                </div>
                <div className="border-border border-t pt-6">
                  <p
                    className={`text-muted-foreground mb-4 text-[10px] font-semibold tracking-wider uppercase dark:text-gray-500 ${selectedIndex === index ? "text-white" : "text-black"}`}
                  >
                    {plan.featuresTitle}
                  </p>
                  <div className="space-y-2.5">
                    {plan?.features
                      .filter((f) => f.included)
                      .map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          {feature?.included ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-check text-brand-500 mt-0.5 shrink-0"
                              aria-hidden="true"
                            >
                              <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-minus mt-0.5 shrink-0 text-red-500"
                              aria-hidden="true"
                            >
                              <path d="M5 12h14"></path>
                            </svg>
                          )}
                          <span
                            className={`text-[13px] ${selectedIndex === index ? "text-gray-200" : "text-muted"}`}
                          >
                            <span
                              className={`text-foreground font-medium ${!feature?.included ? "line-through opacity-40" : ""}`}
                            >
                              <span className="font-semibold">
                                {feature.highlightedText}
                              </span>{" "}
                              {feature.text}
                            </span>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-7">
              <div className="mb-0 flex flex-wrap gap-2">
                {[3, 6, 12].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setBillingPeriod(months)}
                    className={`rounded-t-lg border px-4 py-2 text-sm font-medium transition-colors ${billingPeriod === months
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-gray-200 text-gray-600 hover:border-brand-300 dark:border-gray-700 dark:text-gray-300"
                      }`}
                  >
                    {months === 3 ? "Quarterly" : months === 6 ? "6 Months" : "1 Year"}
                  </button>
                ))}
              </div>

              <div className="overflow-hidden rounded-b-xl border border-gray-200 dark:border-gray-800">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 pt-5 dark:border-gray-800 dark:bg-gray-800/40">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Invoice Summary</h4>
                  <p className="mt-1 text-xs text-gray-500">Minimum billing period is quarterly.</p>
                </div>
                <div className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
                  <div className="flex justify-between px-4 py-3 text-gray-600 dark:text-gray-300">
                    <span>{subscriptionPlans[selectedIndex].name} ({billingPeriod} months)</span>
                    <span>Ksh. {subtotalAmount.toLocaleString()}</span>
                  </div>

                  <div className="space-y-2.5 mx-4 p-3 rounded-lg border-brand-500/50 mt-2 border">
                    <p className="font font-semibold text-brand-500">What you get:</p>
                    {subscriptionPlans[selectedIndex]?.features
                      .filter((f) => f.included)
                      .map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          {feature?.included ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-check text-brand-500 mt-0.5 shrink-0"
                              aria-hidden="true"
                            >
                              <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-minus mt-0.5 shrink-0 text-red-500"
                              aria-hidden="true"
                            >
                              <path d="M5 12h14"></path>
                            </svg>
                          )}
                          <span
                            className={`text-[13px] text-gray-500 dark:text-gray-300`}
                          >
                            <span
                              className={`text-foreground font-medium ${!feature?.included ? "line-through opacity-40" : ""}`}
                            >
                              <span className="font-semibold">
                                {feature.highlightedText}
                              </span>{" "}
                              {feature.text}
                            </span>
                          </span>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-between px-4 py-3 text-gray-600 dark:text-gray-300">
                    <span>VAT (5%)</span>
                    <span>Ksh. {vatAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3 text-gray-600 dark:text-gray-300">
                    <span>Next Expiry</span>
                    <span>{(new Date(newExpiryTimestamp)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between bg-gray-50 px-4 py-4 font-bold text-gray-900 dark:bg-gray-800/40 dark:text-white">
                    <span>Total Due</span>
                    <span className="text-brand-500">Ksh. {grandTotalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5">
              {/* Billing Gateway Gateway Interface Config */}
              <h4 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">
                Choose Payment Method
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
                        defaultValue={company?.phone}
                        value={mpesaNumber || company?.phone}
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
                  message="Your payment was successful. A receipt and your subscription details have been sent to your email. If you have any questions, contact support."
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

              {/* Dynamic Call-To-Action Operations Routing Grid */}
              <div className="mt-4 space-y-3">
                <Button
                  onClick={createNewPayment}
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
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Operational Settings */}
        <ComponentCard title="Subscription History">
          <div className="grid grid-cols-1 gap-4">
            {subscriptionsList?.map((c, i) => (
              <DataPoint
                key={i}
                amount={c.amount}
                method={c.method}
                date={c.date}
                label={c.label}
                value={c.value}
              />
            ))}
          </div>
        </ComponentCard>
      </div>

      {/* Footer / About Section */}
      {company.about && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <p className="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            About
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {company.about}
          </p>
        </div>
      )}
    </div>
  );
}

function DataPoint({ label, value, amount, method, date }: Subscription) {
  return (
    <div className="flex flex-col rounded-lg bg-gray-50 p-3 dark:bg-gray-800/30">
      <span className="mb-2 text-[12px] font-bold tracking-widest text-gray-400 uppercase">
        {label}
      </span>
      <span className="text-brand-500 dark:text-brand-400 mb-2 flex items-center text-xs">
        {value}
      </span>
      <span className="flex items-center text-sm text-gray-900 dark:text-gray-100">
        Ksh. {amount.toLocaleString()} | {method} |{" "}
        {new Date(date).toLocaleString()}
      </span>
    </div>
  );
}
