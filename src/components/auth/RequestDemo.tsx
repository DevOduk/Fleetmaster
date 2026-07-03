"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useToast } from "@/context/ToastContext";



const user = [{ "idx": 0, "id": "67996b2b-4889-4e56-b876-46b6a72b822a", "tenant_id": "33429a1a-4c40-40e4-8f8f-3d2f58f2ed54", "first_name": "Matthew", "last_name": "Woodrow", "email": "m.woodrow@fleetmaster.com", "phone": "+254 700 111 222", "bio": "Head of Operations and System Architecture for the Oduk Fleet Master platform.", "role": "Super Admin", "language": "en", "timezone": "Africa/Nairobi", "buffer": 15, "newsletter": false, "notify": true, "two_factor": false, "created_at": "2026-06-06 17:09:51.612449+00", "updated_at": "2026-06-06 17:09:51.612449+00", "notifications": "[{\"id\": \"admin-n1\", \"read\": false, \"type\": \"info\", \"title\": \"System Alert\", \"message\": \"Toyota Prado TX (KDW-221F) shift change: Assigned to Chauffeured status.\", \"timestamp\": \"2026-06-06T10:15:00Z\"}, {\"id\": \"admin-n2\", \"read\": true, \"type\": \"success\", \"title\": \"New Booking Logged\", \"message\": \"Miriam Otieno has booked the Isuzu D-Max (KBY-555B).\", \"timestamp\": \"2026-06-05T14:30:00Z\"}]", "password": "$2b$12$aelQhrRTn/EkjGKTs6z9We6PwOPSjUwxnoFU8GWCOXN3jIA6YCzgG", "profile_pic": null, "county": "Nairobi", "country": "Kenya", "postal_code": "00100" }]

interface Tenant {
  tenant?: string;
}
const timezones = [
  { "timezone": "GMT-11:00", "regions": ["Samoa Standard Time", "Niue Time", "Midway Islands"] },
  { "timezone": "GMT-10:00", "regions": ["Hawaii-Aleutian Standard Time", "Tahiti Time", "Cook Islands"] },
  { "timezone": "GMT-09:00", "regions": ["Alaska Standard Time"] },
  { "timezone": "GMT-08:00", "regions": ["Pacific Standard Time (US & Canada)", "Baja California (Mexico)"] },
  { "timezone": "GMT-07:00", "regions": ["Mountain Standard Time (US & Canada)", "Mexican Pacific Standard Time"] },
  { "timezone": "GMT-06:00", "regions": ["Central Standard Time (US & Canada)", "Central America Time", "Mexico City"] },
  { "timezone": "GMT-05:00", "regions": ["Eastern Standard Time (US & Canada)", "Peru Time", "Colombia Time"] },
  { "timezone": "GMT-04:00", "regions": ["Atlantic Standard Time (Canada)", "Amazon Time (Brazil)", "Chile Time", "Venezuela Time"] },
  { "timezone": "GMT-03:00", "regions": ["Brasilia Time (Brazil)", "Argentina Time", "Uruguay Time"] },
  { "timezone": "GMT+0:00", "regions": ["Greenwich Mean Time", "Western European Time", "Coordinated Universal Time"] },
  { "timezone": "GMT+1:00", "regions": ["Central European Time", "West Africa Time", "British Summer Time"] },
  { "timezone": "GMT+2:00", "regions": ["Eastern European Time", "Central Africa Time", "South Africa Standard Time"] },
  { "timezone": "GMT+3:00", "regions": ["East African Timezone", "Moscow Standard Time", "Arabia Standard Time"] },
  { "timezone": "GMT+4:00", "regions": ["Gulf Standard Time", "Azerbaijan Time", "Georgia Time"] },
  { "timezone": "GMT+5:00", "regions": ["Pakistan Standard Time", "Yekaterinburg Time", "Maldives Time"] },
  { "timezone": "GMT+5:30", "regions": ["Indian Standard Time", "Sri Lanka Time"] },
  { "timezone": "GMT+7:00", "regions": ["Indochina Time", "Western Indonesia Time", "Krasnoyarsk Time"] },
  { "timezone": "GMT+8:00", "regions": ["China Standard Time", "Australian Western Standard Time", "Singapore Time"] },
  { "timezone": "GMT+9:00", "regions": ["Japan Standard Time", "Korea Standard Time", "Eastern Indonesia Time"] },
  { "timezone": "GMT+10:00", "regions": ["Australian Eastern Standard Time", "Vladivostok Time", "Chamorro Standard Time"] },
  { "timezone": "GMT+12:00", "regions": ["New Zealand Standard Time", "Fiji Time", "Gilbert Islands Time (Kiribati)"] }
];

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
