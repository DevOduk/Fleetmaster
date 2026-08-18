"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useToast } from "@/context/ToastContext";

interface Tenant {
  tenant?: string;
}

export default function RequestDemo() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");

  const handleSendDemoEmail = async () => {
    if (!email || !email.includes(`@`)) return showToast("Please enter a valid email", "warning");
    setIsLoading(true);

    // Finalize registration
    setTimeout(() => {
      showToast("Demo has been sent to your email!", "success");

      setIsLoading(false)
    }, 1000);
  };
  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-start">
        <div className="mb-8">
          <h1 className="text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
            Request free demo
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Get a free product demo with clear instructions, documentations and
            view of the app.
          </p>
        </div>

        <div className="animate-in slide-in-from-right space-y-6 duration-500">
          <div>
            <Label>
              Email <span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g example@email.com"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSendDemoEmail}
            disabled={isLoading}
          >
            {isLoading ? "Sending ..." : "Get Demo"}
          </Button>
          <p className="text-center text-xs text-gray-400">
            A demo will be sent to your email with all the details.
          </p>
        </div>
      </div>
    </div>
  );
}
