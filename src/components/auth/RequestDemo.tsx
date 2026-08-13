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

  const [email, setEmail] = useState("admin@gmail.com");


  const handleSendDemoEmail = async () => {
    if (!email) return showToast("Please enter a valid email", "warning");
    setIsLoading(true);

    // Finalize registration
    showToast("Demo has been sent to your email!", "success");
  };
  return (
  <div className="flex flex-col flex-1 lg:w-1/2 w-full">
    <div className="flex flex-col justify-start flex-1 w-full max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-md dark:text-white/90">
          Request free demo
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Get a free product demo with clear instructions, documentations and view of the app.</p>
      </div>

      <div className="space-y-6 animate-in slide-in-from-right duration-500">
        <div>
          <Label>Email <span className="text-error-500">*</span></Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g example@email.com" />
        </div>

        <Button className="w-full" onClick={handleSendDemoEmail} disabled={isLoading}>
          {isLoading ? "Sending ..." : "Get Demo"}
        </Button>
        <p className="text-xs text-center text-gray-400">A demo will be sent to your email with all the details.</p>
      </div>
    </div>
  </div>
  );
}
