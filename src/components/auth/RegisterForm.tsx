"use client";

import React, { useState, useEffect, Suspense } from "react";
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
function RegisterFormInner() {
    const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  // State
  const [step, setStep] = useState<"company" | "admin">("company");
  const [isLoading, setIsLoading] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(searchParams.get("id"));

  // Company Form Fields
  const [companyName, setCompanyName] = useState("Company");
  const [slug, setSlug] = useState("slug");
  const [primaryEmail, setPrimaryEmail] = useState("company@gmail.com");
  const [primaryPhone, setPrimaryPhone] = useState("0768927611");
  
    // Admin Form Fields
  const [first, setFirst] = useState("First");
  const [last, setLast] = useState("Last");
  const [email, setEmail] = useState("admin@gmail.com");
  const [phone, setPhone] = useState("0734567890");
  const [password, setPassword] = useState("123456789");
  const [confirmPassword, setConfirmPassword] = useState("123456789");
  const [showPassword, setShowPassword] = useState(false);

  // If ID exists in URL, skip to Admin step
  useEffect(() => {
    if (searchParams.get("id")) {
      setStep("admin");
    }
  }, [searchParams]);

  const handleCreateCompany = async () => {
    if (!companyName?.trim()) return showToast("Company name is required", "warning");
    if (!slug?.trim()) return showToast("Your subdomain slug is required", "warning");
    if (!primaryEmail?.trim()) return showToast("Company primary email is required", "warning");
    if (!primaryPhone?.trim()) return showToast("Company primary phone is required", "warning");

    setIsLoading(true);

    // Simulate API call to create tenant
    // const res = await createTenant({ name: companyName });
    const mockId = "tenant-" + Math.random().toString(36).substr(2, 9);
    setTimeout(() => {
      setTenantId(mockId);
      setStep("admin");
      router.replace(`/register?id=${mockId}`);
      showToast("Company registered! Now setup your admin profile.", "success");
      setIsLoading(false);
    }, 2000);
  };

  const handleCreateAdmin = async () => {
    if (!email || !password) return showToast("All fields required", "warning");
    setIsLoading(true);

    // Finalize registration
    console.log("Creating admin for tenant:", tenantId);
    showToast("Registration Complete!", "success");
    router.push("/signin");
  };
  return (<div className="flex flex-col flex-1 lg:w-1/2 w-full">
    <div className="flex flex-col justify-center flex-1 w-full max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-md dark:text-white/90">
          {step === "company" ? "Register workspace" : "Complete Admin Setup"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {step === "company"
            ? "Start your 2-week free trial by registering your company this will take a second."
            : "Finalize your administrator account for your new workspace."}
        </p>
      </div>

      {step === "company" ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div>
            <Label>Rental Company Name <span className="text-error-500">*</span></Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Fleet Master Inc." />
          </div>

          <div>
            <Label>Subdomain Slug <span className="text-error-500">*</span></Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. mycompany" />

            {/* Slug Preview */}
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Workspace URL preview:</p>
              <p className="text-sm font-mono text-brand-500">
                {slug.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') ? slug.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') : "mycompany"}.fleetmaster.co.ke
              </p>
            </div>
          </div>
          <div>
            <Label>Company Email </Label>
            <Input type="email" value={primaryEmail} onChange={(e) => setPrimaryEmail(e.target.value)} placeholder="example@email.com" />
          </div>
          <div>
            <Label>Primary Phone </Label>
            <Input type="tel" value={primaryPhone} onChange={(e) => setPrimaryPhone(e.target.value)} placeholder="07123*****" />
          </div>

          <Button className="w-full" onClick={handleCreateCompany} disabled={isLoading}>
            {isLoading ? "Creating..." : "Continue to Admin Setup"}
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
          
          <div className="grid lg:grid-cols-2 gap-2 grid-cols-1">
          <div>
            <Label>First Name </Label>
            <Input type="tel" value={first} onChange={(e) => setFirst(e.target.value)} placeholder="07123*****" />
          </div>
          <div>
            <Label>Last Name </Label>
            <Input type="tel" value={last} onChange={(e) => setLast(e.target.value)} placeholder="07123*****" />
          </div>
          </div>
          <div>
            <Label>Email <span className="text-error-500">*</span></Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" />
          </div>
          
          <div>
            <Label>Primary Phone </Label>
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07123*****" />
          </div>

          <div>
            <Label>Password <span className="text-error-500">*</span></Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 cursor-pointer">
                {showPassword ? <EyeIcon className="fill-gray-500" /> : <EyeCloseIcon className="fill-gray-500" />}
              </span>
            </div>
          </div>
          <div>
            <Label>Confirm Password</Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 cursor-pointer">
                {showPassword ? <EyeIcon className="fill-gray-500" /> : <EyeCloseIcon className="fill-gray-500" />}
              </span>
            </div>
          </div>
          <Button className="w-full" onClick={handleCreateAdmin} disabled={isLoading}>
            {isLoading ? "Finalizing..." : "Complete Setup"}
          </Button>
          <p className="text-xs text-center text-gray-400">Tenant ID: {tenantId}</p>
        </div>
      )}
    </div>
  </div>
  );
}

export default function RegisterForm() {
  return (
    <Suspense fallback={
      <div className="w-full mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded-md dark:bg-gray-600"></div>
        <div className="h-10 w-full bg-gray-100 rounded-lg dark:bg-gray-600"></div>
      </div>
    }>
      <RegisterFormInner />
    </Suspense>
  );
}
