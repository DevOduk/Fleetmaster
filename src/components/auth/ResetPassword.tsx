"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "../ui/button/Button";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

export default function ResetPasswordForm({
  isClient,
  isAdmin,
  isTenantManager,
  tenantId,
}: {
  isClient?: boolean;
  isAdmin?: boolean;
  isTenantManager?: boolean;
  tenantId?: string;
}) {
  const [email, setEmail] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [sendingCodeSuccess, setSendingCodeSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { showToast } = useToast();

  // Safe email masking helper
  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(?=@)/, (_, start, middle) => {
        const maskedMiddle = middle.replace(/./g, "*").slice(0, 5);
        return `${start}${maskedMiddle}`;
      })
    : "";

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setErrorMessage("");
    setSuccessMessage("");

    // Role-based validation matching the specs
    if ((isClient || isAdmin) && !tenantId) {
      setErrorMessage(
        "Tenant ID is required for client or admin password reset.",
      );
      return;
    }

    if (!isClient && !isAdmin && !isTenantManager) {
      setErrorMessage("Invalid user role context specified.");
      return;
    }

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      setSendingCode(true);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          tenantId,
          isClient,
          isAdmin,
          isTenantManager,
        }),
      });

      const data = await response.json();
      console.log("reset response: ", data);

      if (!response.ok) {
        showToast(
          data.message || "Failed to send password reset link.",
          "error",
        );
      }

      showToast(
        `Password reset link sent successfully to ${maskedEmail}. Please check your email`,
        "success",
      );
      setSuccessMessage(
        `Password reset link sent successfully to ${maskedEmail}.`,
      );
      setSendingCodeSuccess(true);
      setEmail("");
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      showToast(
        err.message || "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      setSendingCode(false);
    }
  };

  return (
    <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        {/* email verification otp block  */}
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Reset password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the email address linked to your FleetMaster account below
              to get a reset link.
            </p>
          </div>

          <div>
            <form onSubmit={handleResetPassword}>
              <div className="space-y-5">
                {/* Success Message Banner */}
                {sendingCodeSuccess ? (
                  <div className="rounded-lg bg-green-100 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {successMessage}
                  </div>
                ) : (
                  <>
                    {/* <!-- Enter Email --> */}
                    <div className="w-full">
                      <Label>
                        Enter email address
                        <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        error={!!errorMessage}
                        hint={errorMessage}
                        type="email"
                        className="mt-2 w-full tracking-wide"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMessage) setErrorMessage("");
                        }}
                        placeholder="example@email.com"
                        disabled={sendingCode}
                      />
                    </div>
                    {/* <!-- Button --> */}
                    <div>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={!email.trim() || sendingCode}
                        className="w-full px-4! py-3! text-sm"
                      >
                        {sendingCode ? "Sending Link..." : "Reset Password"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </form>

            <div className="mt-5">
              <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
                Already have an account? &nbsp;
                <Link
                  href={"/signin"}
                  className="text-blue-400 dark:text-blue-500"
                >
                  Sign in.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
