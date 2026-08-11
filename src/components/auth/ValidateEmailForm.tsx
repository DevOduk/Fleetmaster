"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import React, { useState, useEffect, useCallback, useTransition } from "react";
import { useTenant } from "@/context/TenantContext";
import { useToast } from "@/context/ToastContext";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../ui/button/Button";
import { verifyOTP, resendOTP, sendEmailVerification } from "@/app/actions/verification/email";
import { retryDuration } from "@/data/globalExports";

export default function ValidateEmailForm({ params }: { params: { tenant: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState(retryDuration);
  const [errorMessage, setErrorMessage] = useState('');
  const verificationParam = searchParams.get('v');

  // Parse verification token safely on client mount
  useEffect(() => {
    if (verificationParam) {
      try {
        const decodedData = JSON.parse(atob(verificationParam));
        if (decodedData.email) setEmail(decodedData.email);
        if (decodedData.id) setId(decodedData.id);
        if (decodedData.role) setRole(decodedData.role);
      } catch (error) {
        console.error('Failed to decode verification parameter:', error);
      }
    }
  }, [searchParams]);

  // initial dispatch is handled immediately after signup so no need to rerun dispatch 

  // Countdown timer effect for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      showToast("Please enter the 6-digit verification code.", "error");
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    const res = await verifyOTP(btoa(JSON.stringify({ email, id, otp })), role);

    if (res.success) {
      showToast(`Email verification complete! You will be redirected to login in 5 sec.`, "success");

      setTimeout(() => {
        router.push("/signin");
        setIsLoading(false);
      }, 5000);
    } else {
      showToast(`${res.error?.message || 'Failed to verify OTP'}`, "error");
      setErrorMessage(`${res.error?.message || 'Failed to verify OTP'}`);
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    setSendingCode(true);
    if (cooldown > 0 || !email) return;

    startTransition(async () => {
      const res = await resendOTP(btoa(email), role);

      if (res.success) {
        showToast("A new verification code has been sent.", "success");
        setCooldown(retryDuration);
      } else {
        showToast(`${res.error?.message || 'Failed to send code'}`, "error");
        setErrorMessage(`${res.error?.message || 'Failed to send code'}`);
      }

      setSendingCode(false);
    });
  };

  // Safe email masking helper
  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(?=@)/, (_, start, middle) => {
      const maskedMiddle = middle.replace(/./g, '*').slice(0, 5);
      return `${start}${maskedMiddle}`;
    })
    : '';

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

        {/* email verification otp block  */}
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Verify email
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We have sent a verification code to your email address {maskedEmail}. Please check your inbox and enter the code below to verify your email.
            </p>
          </div>

          <div>
            <form onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();

              handleVerifyOTP();
            }}>
              <div className="space-y-5">
                {/* <!-- Enter OTP --> */}
                <div className="w-full">
                  <Label>
                    Enter OTP<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    error={!!errorMessage}
                    hint={errorMessage || "Enter the 6-digit code sent to your email."}
                    type="tel"
                    id="otp"
                    className="mt-2 text-center w-full tracking-wide"
                    name="otp"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setOtp(value);
                    }}
                    placeholder="000000"
                    disabled={isLoading || sendingCode}
                  />
                </div>
                {/* <!-- Button --> */}
                <div>
                  <Button type="submit" variant="primary" disabled={isLoading || sendingCode || !email.trim() || sendingCode || otp.trim().length < 6} className="px-4! py-3! w-full text-sm">
                    {isLoading ? "Verifying..." : sendingCode ? "Sending Code..." : "Verify OTP"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Did not receive code? &nbsp;
                {cooldown > 0 ? (
                  <span className="text-gray-400 dark:text-gray-500">
                    Resend in {cooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isPending || !email.trim()}
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium disabled:opacity-50"
                  >
                    {isPending ? "Resending..." : "Resend Code"}
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}