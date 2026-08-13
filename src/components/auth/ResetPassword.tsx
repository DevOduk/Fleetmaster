"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "../ui/button/Button";
import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordForm({ isClient, isAdmin, isTenantManager, tenantId }: { isClient?: boolean; isAdmin?: boolean; isTenantManager?: boolean; tenantId?: string; }) {
  const [email, setEmail] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // a clientInformation, admin must have a tenant id for crosscheckng in db 
  // tenant manager is elevated and will only check email against db 
  // if all are availableMemory, proceed to send resnd password reset link 

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
              Reset password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the email address linked to your FleetMaster account below to get a reset link.
            </p>
          </div>

          <div>
            <form onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();

              // handle sendiing reset link 
            }}>
              <div className="space-y-5">
                {/* <!-- Enter OTP --> */}
                <div className="w-full">
                  <Label>
                    Enter email address<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    error={!!errorMessage}
                    hint={errorMessage}
                    type="email"
                    className="mt-2 w-full tracking-wide"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="example@email.com"
                    disabled={sendingCode}
                  />
                </div>
                {/* <!-- Button --> */}
                <div>
                  <Button type="submit" variant="primary" disabled={!email.trim() || sendingCode} className="px-4! py-3! w-full text-sm">
                    {sendingCode ? "Sending Link..." : "Reset Password"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? &nbsp;
                <Link href={'/signin'} className="text-blue-400 dark:text-blue-500">
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