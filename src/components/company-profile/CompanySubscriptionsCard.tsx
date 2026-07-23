"use client";

import { fetchTenantDetails, fetchTenantSubscriptions, updateTenantDetails } from "@/app/actions/tenant";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import ExpiryBanner, { getExpiryString } from "./ExpiryBanner";
import Input from "../form/input/InputField";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MobileScreenShareOutlinedIcon from "@mui/icons-material/MobileScreenShareOutlined"
import Button from "../ui/button/Button";
import { subscriptionPlans } from "@/data/globalExports";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/context/ToastContext";
import { createPayment } from "@/app/actions/payments";
import Alert from "../ui/alert/Alert";
import { Modal } from "../ui/modal";
import { ArrowRightIcon } from "@/icons";

export const mpesaPollingIterval = 22000;

interface Subscription {
  label: string;
  value: string;
  amount: number;
  method: string;
  date: string;
}


export default function CompanySubscriptionsCard() {
  const { profile } = useUser();
  const [company, setCompany] = useState<any>(null);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('m-pesa');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState(null);
  const successModal = useModal();
  const { showToast } = useToast();

  const defaultSubscription: Subscription = {
    label: 'Free Trial Plan',
    value: 'Welcome to fleetmaster crm dashboard where you can manage your rental fleet with ease!',
    amount: 0,
    method: 'M-PESA',
    date: company?.created_at || profile?.fleetmaster_tenants?.created_at
  };

  const [subscriptionsList, setSubScriptionsList] = useState<Subscription[]>([defaultSubscription]);

  useEffect(() => {
    const getTenantDetails = async () => {
      if (!profile?.tenant_id) {
        setLoadingCompany(false);
        return;
      }
      if (profile?.tenant_id) {
        const res = await fetchTenantDetails(profile.tenant_id);
        const subRes = await fetchTenantSubscriptions(profile.tenant_id);

        console.log(subRes)
        setCompany(res.data);
        setSubScriptionsList([...(subRes.data || []), defaultSubscription]);

        if (res) {
          setLoadingCompany(false);
        }
      }
    };

    getTenantDetails();
  }, [profile?.tenant_id]);

  const grandTotalAmount = parseInt(subscriptionPlans[selectedIndex].price);

  const createNewPayment = async () => {
    setError(null);

    if (!profile) {
      showToast('Please sign in to your account to renew subscription!', 'error');
      return;
    }
    if (paymentMethod === 'm-pesa' && !mpesaNumber) {
      showToast('Please enter a valid M-Pesa phone number!', 'error');
      return;
    }

    setIsPaying(true);

    if (paymentMethod === 'm-pesa') {
      showToast('Processing your security checks...', 'info');

      let sanitizedNumber = mpesaNumber.replace(/\D/g, '');
      if (sanitizedNumber.startsWith('0')) {
        sanitizedNumber = `254${sanitizedNumber.substring(1)}`;
      } else if (sanitizedNumber.startsWith('7') || sanitizedNumber.startsWith('1')) {
        sanitizedNumber = `254${sanitizedNumber}`;
      }

      if (sanitizedNumber.length !== 12) {
        showToast('Please enter a valid 9 or 10-digit M-Pesa phone number.', 'error');
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

        safetyTimeoutId = setTimeout(() => {
          clearPollingTimers();
          setIsPaying(false);
          setError({ message: 'Payment verification timed out. Please check your Phone and try again.' });
          showToast('Payment verification timed out. Please check your Phone and try again', 'error');
        }, 65000);

        // --- 2. POLL DARAJA STATUS ENDPOINT ---
        intervalId = setInterval(async () => {
          try {
            const statusRes = await fetch('/api/mpesa/status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ checkoutRequestID: targetCheckoutId })
            });

            const statusData = await statusRes.json();

            // Daraja returns ResultCode ('0' = Success, non-zero or user cancellation handles failure)
            const resultCode = statusData.ResultCode;
            const responseCode = statusData.ResponseCode;
            console.log('Daraja status check poll: ', resultCode, responseCode, statusData);

            // If ResultCode is 0, payment succeeded
            if (resultCode === "0") {
              clearPollingTimers();
              setIsPaying(false);
              showToast('Payment Confirmed! Your subscription renewal has been processed successfully.', 'success');
              successModal.openModal();
              setPaymentSuccess(true);

              const mpesaRef = statusData.MpesaReceiptNumber || targetCheckoutId;

              const newPayment = {
                tenant_id: profile?.tenant_id,
                intasend_invoice_id: targetCheckoutId,
                provider: 'M-PESA',
                provider_reference: mpesaRef,
                amount: Number(grandTotalAmount),
                currency: 'KES',
                account_number: sanitizedNumber,
                payment_ref: mpesaRef,
                user_id: profile.id,
                status: 'Success',
                message: `Subscription renewal for package: ${subscriptionPlans[selectedIndex]?.name}`,
              };

              await createPayment(newPayment);

              // 1. Determine the base date to add 30 days to
              const currentExpiry = company?.expiry_date ? new Date(company.expiry_date).getTime() : 0;
              const now = new Date().getTime();

              // If current expiry is in the future, add 30 days to it. Otherwise, add to today.
              const baseTime = currentExpiry > now ? currentExpiry : now;
              const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
              const newExpiryTimestamp = baseTime + thirtyDaysInMs;

              // 2. Convert to ISO string for Supabase timestamptz compatibility
              const newExpiryIsoString = new Date(newExpiryTimestamp).toISOString();

              await updateTenantDetails(
                profile?.tenant_id,
                {
                  ...company,
                  subscription_status: 'Active',
                  subscription_plan: subscriptionPlans[selectedIndex]?.name,
                  expiry_date: newExpiryIsoString
                }
              );

              const subRes = await fetchTenantSubscriptions(profile.tenant_id);
              setSubScriptionsList([...(subRes.data || []), defaultSubscription]);

            } else if (resultCode && resultCode !== "0" && resultCode !== "4999") {
              // ResultCode exists and is not 0 (User canceled, insufficient funds, etc.)
              clearPollingTimers();
              setIsPaying(false);
              const failReason = statusData.ResultDesc || 'Transaction was canceled or failed.';
              showToast(failReason, 'error');
              setError({ message: failReason });

              const newPayment = {
                tenant_id: profile.tenant_id,
                intasend_invoice_id: targetCheckoutId,
                provider: 'M-PESA',
                provider_reference: targetCheckoutId,
                amount: Number(grandTotalAmount),
                currency: 'KES',
                account_number: sanitizedNumber,
                payment_ref: targetCheckoutId,
                user_id: profile.id,
                status: 'Failed',
                message: 'Subscription renewal failure: ' + failReason,
              };

              await createPayment(newPayment);
            }
            // If ResultCode is undefined, it means transaction is still processing on Safaricom's side; keep polling.
          } catch (pollErr) {
            console.error("Error during background status poll checking:", pollErr);
          }
        }, mpesaPollingIterval);

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

  // const handleCheckoutSubmit = async () => {
  //   setError(null);

  //   if (!profile) {
  //     showToast('Please sign in to your account to place a booking!', 'error');
  //     return;
  //   }
  //   if (paymentMethod === 'm-pesa' && !mpesaNumber) {
  //     showToast('Please enter a valid M-Pesa phone number!', 'error');
  //     return;
  //   }

  //   setIsPaying(true);
  //   const firstName = profile?.first_name;
  //   const lastName = profile?.last_name;

  //   // --- BRANCH 1: ONE-CLICK DIRECT M-PESA STK PUSH (NO MODAL) ---
  //   if (paymentMethod === 'm-pesa') {
  //     showToast('Processing your security checks...', 'info');

  //     // --- SANITIZE AND NORMALIZE PHONE NUMBER INPUT ---
  //     let sanitizedNumber = mpesaNumber.replace(/\D/g, '');

  //     if (sanitizedNumber.startsWith('0')) {
  //       sanitizedNumber = `254${sanitizedNumber.substring(1)}`;
  //     } else if (sanitizedNumber.startsWith('7') || sanitizedNumber.startsWith('1')) {
  //       sanitizedNumber = `254${sanitizedNumber}`;
  //     } else if (sanitizedNumber.startsWith('254') && sanitizedNumber.length > 3) {
  //       // Already formatted
  //     } else {
  //       console.warn("Phone formatting fallback pattern encountered:", sanitizedNumber);
  //     }

  //     if (sanitizedNumber.length !== 12) {
  //       showToast('Please enter a valid 9 or 10-digit M-Pesa phone number.', 'error');
  //       setIsPaying(false);
  //       return;
  //     }

  //     let intervalId: NodeJS.Timeout | null = null;
  //     let safetyTimeoutId: NodeJS.Timeout | null = null;

  //     const clearPollingTimers = () => {
  //       if (intervalId) clearInterval(intervalId);
  //       if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
  //     };

  //     try {
  //       // --- ATOMIC BACKEND PIPELINE TRIGGER ---
  //       const res = await fetch('/api/intasend/stk', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           amount: Number(grandTotalAmount),
  //           phone: sanitizedNumber,
  //           email: profile?.email,
  //           firstName,
  //           lastName
  //         })
  //       });

  //       const data = await res.json();
  //       console.log('intasend stk response: ', res);

  //       if (!res.ok) {
  //         throw new Error(data.error || 'Failed to dispatch payment payload.');
  //       }

  //       const targetInvoiceId = data.invoice?.invoice_id || data.id;

  //       if (!targetInvoiceId) {
  //         throw new Error('No tracking invoice ID returned from billing gateway.');
  //       }

  //       showToast('STK Push Request Sent! Please enter your M-Pesa PIN', 'info');

  //       // Safety lifecycle fallback boundary loop limit (2 minutes)
  //       safetyTimeoutId = setTimeout(() => {
  //         clearPollingTimers();
  //         setIsPaying(false);
  //         setError({ message: 'Payment verification timed out. Please check your Phone and try gain.' })
  //         showToast('Payment verification timed out. Please check your Phone and try again', 'error');
  //       }, 60000);

  //       intervalId = setInterval(async () => {
  //         try {
  //           const statusRes = await fetch('/api/intasend/status', {
  //             method: 'POST',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify({ invoice_id: targetInvoiceId })
  //           });

  //           const statusData = await statusRes.json();
  //           console.log('status check poll: ', statusData);

  //           // Safely map nested or flat invoice properties
  //           const invoiceObj = statusData.data?.invoice || statusData.invoice || {};
  //           const paymentState = (statusData.state || invoiceObj.state || '').toUpperCase();

  //           const mpesaRef = invoiceObj.mpesa_reference ||
  //             invoiceObj.provider_ref ||
  //             `ST-${targetInvoiceId}`;

  //           if (paymentState === 'COMPLETE' || paymentState === 'SUCCESS') {
  //             clearPollingTimers();
  //             setIsPaying(false);
  //             showToast('Payment Confirmed! Your subscription renewal has been processed successfully.', 'success');
  //             successModal.openModal();
  //             setPaymentSuccess(true);

  //             const newPayment = {
  //               tenant_id: profile?.tenant_id,
  //               intasend_invoice_id: invoiceObj.invoice_id || targetInvoiceId,
  //               provider: invoiceObj.provider || 'M-PESA',
  //               provider_reference: invoiceObj.provider_ref || mpesaRef,
  //               amount: Number(grandTotalAmount),
  //               currency: invoiceObj.currency || 'KES',
  //               account_number: invoiceObj.account || profile?.tenant_id,
  //               payment_ref: mpesaRef,
  //               user_id: profile.id,
  //               status: 'Success',
  //               message: `Subscription renewal for package: ${subscriptionPlans[selectedIndex]?.name}`,
  //             };

  //             const paymentRes = await createPayment(newPayment);

  //             // Calculate 30 days from now in milliseconds
  //             const thirtyDaysFromNow = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);

  //             // FIXED: Pass only the primitive properties without spreading nested relations
  //             const updateTenantRes = await updateTenantDetails(
  //               profile?.tenant_id,
  //               {
  //                 subscription_status: 'Active',
  //                 subscription_plan: subscriptionPlans[selectedIndex]?.name,
  //                 expiry_date: thirtyDaysFromNow
  //               }
  //             );

  //             if (paymentRes.success) {
  //               // payment logged successfully
  //             }
  //             if (updateTenantRes.success) {
  //               // tenant updated successfully
  //             }
  //             console.log("Database tenant update response:", updateTenantRes);

  //           } else if (paymentState === 'FAILED') {
  //             clearPollingTimers();
  //             setIsPaying(false);
  //             const failReason = invoiceObj.failed_reason || 'Transaction was declined, canceled, or timed out.';
  //             showToast(failReason, 'error');
  //             setError({ message: failReason });

  //             const newPayment = {
  //               tenant_id: profile.tenant_id,
  //               intasend_invoice_id: invoiceObj.invoice_id || targetInvoiceId,
  //               provider: invoiceObj.provider || 'M-PESA',
  //               provider_reference: invoiceObj.provider_ref || `ST-${targetInvoiceId}`,
  //               amount: Number(grandTotalAmount),
  //               currency: invoiceObj.currency || 'KES',
  //               account_number: invoiceObj.account || profile?.tenant_id,
  //               payment_ref: targetInvoiceId,
  //               user_id: profile.id,
  //               status: 'Failed',
  //               message: 'Subscription renewal failure: ' + failReason,
  //             };

  //             await createPayment(newPayment);
  //           }
  //           // If state is 'PROCESSING', the loop simply waits for the next interval tick.
  //         } catch (pollErr) {
  //           console.error("Error during background status poll checking:", pollErr);
  //         }
  //       }, 5000);

  //     } catch (err: any) {
  //       setError(err);
  //       console.error("Direct STK Push Failed:", err);
  //       showToast(err.message || 'M-Pesa STK verification failed.', 'error');
  //       setIsPaying(false);
  //     }

  //     // --- BRANCH 2: SECURE CARD CHECKOUT via BACKEND INLINE MODAL ---
  //   } else {
  //     showToast('Card payment checkout not available! Consult support.', 'error');
  //     setIsPaying(false);
  //     return;
  //   }
  // };





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
    return (
      <div className="w-full mx-auto p-6 space-y-6 animate-pulse">
        {/* Header Section Placeholder */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded-md dark:bg-gray-600"></div>
            <div className="h-4 w-32 bg-gray-100 rounded-md dark:bg-gray-600"></div>
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5 border border-gray-100 dark:border-gray-700 rounded-xl space-y-3">
              <div className="h-4 w-34 bg-gray-100 rounded-md dark:bg-gray-600"></div>
              <div className="h-8 w-19 bg-gray-200 rounded-md dark:bg-gray-600"></div>
            </div>
          ))}
        </div>

        {/* Main Content Area / List Placeholder */}
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 space-y-4">
          <div className="h-5 w-36 bg-gray-200 dark:bg-gray-500 rounded-md mb-2"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-600 last:border-0">
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full shrink-0"></div>
                <div className="space-y-2 w-full max-w-[60%]">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded-md w-1/2"></div>
                </div>
              </div>
              <div className="h-4 w-12 bg-gray-100 rounded-md dark:bg-gray-600"></div>
            </div>
          ))}
        </div>

        {/* Subtle Loading Text Indicator */}
        <div className="flex items-center justify-center space-x-2 pt-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <span className="text-xs text-gray-400 font-medium pl-1">Syncing workspace...</span>
        </div>
      </div>

    );
  }
  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 min-h-[70vh]">
        <div className="text-4xl mb-4">🏢</div>
        <h3 className="text-lg font-semibold text-red-600">Company Not Found</h3>
        <p className="text-gray-500 max-w-sm mt-2">
          We couldn't locate a profile associated with your account. If you believe this is an error, please contact support.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <ExpiryBanner plan={company.subscription_plan} expiryDate={company.expiry_date} />


      <Modal
        isOpen={successModal.isOpen}
        onClose={successModal.closeModal}
        className="max-w-150 p-5 lg:p-10 z-99999"
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
            Your payment was successful. A receipt and your subscription details have been sent to your email. If you have any questions, contact support.                </p>

          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <a href="/">
              <Button size="sm" variant="outline" endIcon={<ArrowRightIcon />} >
                Go to Dashboard
              </Button>
            </a>
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

      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            {company.tenant_logo ? (
              <img src={company.tenant_logo} alt="Company Logo" className="h-full w-full object-contain p-1 bg-white" />
            ) : (
              <span className="text-xl font-bold text-gray-400">{company.name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{company.name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-gray-500">{company.slug}.fleetmaster.co.ke {company.website && ` - ${company.website}`}</p>
              <span className="text-xs text-gray-400">|</span>
              <p className="text-xs font-medium text-gray-500">{company.subscription_plan || "N/A"} Plan</p>
              <span className="text-xs text-gray-400">|</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${company.subscription_status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600'}`}>
                {company.subscription_status || "Inactive"}
              </span>
              <span className="text-xs text-gray-400">|</span>
              <p className="text-xs font-medium text-gray-500">{
                getExpiryString(company.expiry_date)
              }</p>

            </div>
          </div>
        </div>

      </div>

      <div className="p-6 space-y-8">
        {/* new  subscription */}
        <ComponentCard title="Contact Information">
          <div className="text-gray-400">New subscriptions are automatically added to existing ones and features will update within 1 day</div>
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {
              subscriptionPlans?.map((plan, index) => (
                <div key={index}
                  className={`relative cursor-pointer h-full flex flex-col rounded-2xl p-8 border border-brand-300 dark:border-brand-900 dark:text-white shadow-sm hover:-translate-y-5 ${selectedIndex === index ? '-translate-y-5 bg-brand-950' : 'bg-transparent'} transition-all`}
                  style={{ opacity: selectedIndex === index ? 1 : 0.85 }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <h3 className={`text-brand-500 uppercase ${selectedIndex === index ? 'text-white font-semibold' : ''}`}>{plan?.name}</h3>
                  <p className={`mt-1 mb-5 text-xs text-muted  ${selectedIndex === index ? 'text-gray-300' : 'text-muted'}`}> {plan?.tagline}</p>
                  <div className="mb-3">
                    <span className="align-top text-sm text-gray-400">{plan?.currency}</span>
                    <span className={`ml-1 text-4xl font-extrabold text- dark:text-white ${selectedIndex === index ? 'text-white' : 'text-black'}`}>{plan?.price}</span>
                  </div>
                  <div className="border-t pt-6 border-border">
                    <p className={`mb-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-gray-500  ${selectedIndex === index ? 'text-white' : 'text-black'}`}>{plan.featuresTitle}</p>
                    <div className="space-y-2.5">
                      {plan?.features.filter(f => f.included).map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          {feature?.included ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check mt-0.5 shrink-0 text-brand-500" aria-hidden="true">
                              <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus mt-0.5 shrink-0 text-red-500" aria-hidden="true">
                              <path d="M5 12h14"></path>
                            </svg>
                          )}
                          <span className={`text-[13px] ${selectedIndex === index ? 'text-gray-200' : 'text-muted'}`}>
                            <span
                              className={`font-medium text-foreground ${!feature?.included ? 'line-through opacity-40' : ''}`}                        ><span className="font-semibold">{feature.highlightedText}</span> {feature.text}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="max-w-4xl container mx-auto">


            {/* Billing Gateway Gateway Interface Config */}
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Choose Payment Method</h4>
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
                      defaultValue={company?.phone}
                      value={mpesaNumber || company?.phone}
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


            {
              isPaying && <Alert title='Payment Processing!' variant='info' message='Your payment is being processed. Check your phone.' />
            }
            {
              paymentSuccess && <Alert title='Payment Confirmed!' variant='success' message='Your payment was successful. A receipt and your subscription details have been sent to your email. If you have any questions, contact support.' />
            }

            {
              error && <Alert title='Payment Error!' variant='error' message={error?.message || 'An error occured. Please try again later!'} />
            }

            {/* Dynamic Call-To-Action Operations Routing Grid */}
            <div className="space-y-3 mt-4">
              <Button onClick={createNewPayment} className="w-full intaSendPayButton" data-amount="10" data-currency="KES" size='md' disabled={isPaying || paymentSuccess}>
                {isPaying
                  ? "Processing Transaction..."
                  : `Pay Now (Ksh. ${(grandTotalAmount).toLocaleString()})`
                }
              </Button>
            </div>
          </div>
        </ComponentCard>

        {/* Operational Settings */}
        <ComponentCard title="Subscription History">
          <div className="grid grid-cols-1 gap-4">
            {
              subscriptionsList?.map((c, i) => (
                <DataPoint key={i} amount={c.amount} method={c.method} date={c.date} label={c.label} value={c.value} />
              ))
            }
          </div>
        </ComponentCard>
      </div>

      {/* Footer / About Section */}
      {company.about && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">About</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{company.about}</p>
        </div>
      )}
    </div>
  );
}

function DataPoint({ label, value, amount, method, date }: Subscription) {
  return (
    <div className="flex flex-col rounded-lg bg-gray-50 p-3 dark:bg-gray-800/30">
      <span className="mb-2 text-[12px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
      <span className="text-xs text-brand-500 dark:text-brand-400 mb-2 flex items-center">
        {value}
      </span>
      <span className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
        Ksh. {amount.toLocaleString()} | {method} | {(new Date(date)).toLocaleString()}
      </span>
    </div>
  );
}