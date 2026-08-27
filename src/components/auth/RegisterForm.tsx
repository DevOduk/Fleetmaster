"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ArrowRightIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { useToast } from "@/context/ToastContext";
import { createNewTenant } from "@/app/actions/tenant";
import { createTenantAdmin } from "@/app/actions/admin";
import Link from "next/link";
import Select from "../form/Select";
import { allCountriesDB, timezones } from "@/data/globalExports";
import { allTimezones } from "../company-profile/EditCompanyInfoCard";

interface Tenant {
  tenant?: string;
}

const industries = [
  "Rental Company",
  "Leasing Company",
  "Private Rental Agency",
];
const employees = ["1-10", "11-30", "31-50", "51-100", "> 100"];

function RegisterFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  // State
  const [step, setStep] = useState<"company" | "admin">("company");
  const [isLoading, setIsLoading] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(
    searchParams.get("id"),
  );

  const [first, setFirst] = useState("First");
  const [last, setLast] = useState("Last");
  const [email, setEmail] = useState("admin@gmail.com");
  const [phone, setPhone] = useState("0734567890");
  const [password, setPassword] = useState("123456789");
  const [confirmPassword, setConfirmPassword] = useState("123456789");
  const [showPassword, setShowPassword] = useState(false);

  const [companyStep, setCompanyStep] = useState(1);
  const [companyDetils, setCompanyDetails] = useState({
    name: "Test Company",
    email: "company@gmail.com",
    phone: "0768927611",
    country: "Kenya",
    timezone: "(UTC+3:00) East African Timezone",
    industry: "Private Rental Agency",
    address: "7th Parklands Av., Nairobi",
    slug: "slug",
    employees: "1-10",
    subscription_status: "Active",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // If ID exists in URL, skip to Admin step
  useEffect(() => {
    if (searchParams.get("id")) {
      setStep("admin");
    }
  }, [searchParams]);

  const handleCreateCompany = async () => {
    if (!companyDetils.name?.trim())
      return showToast("Company name is required", "warning");
    if (!companyDetils.slug?.trim())
      return showToast("Your subdomain slug is required", "warning");
    if (!companyDetils.email?.trim())
      return showToast("Company primary email is required", "warning");
    if (!companyDetils.phone?.trim())
      return showToast("Company primary phone is required", "warning");

    if (
      !companyDetils.country?.trim() ||
      !companyDetils.address?.trim() ||
      !companyDetils.timezone?.trim() ||
      !companyDetils.industry?.trim()
    )
      return showToast(
        "Missing required items! Check and try again",
        "warning",
      );

    setIsLoading(true);

    const res = await createNewTenant(companyDetils);
    if (res.success) {
      setTenantId(res.data.id);
      setStep("admin");
      router.replace(`/register?id=${res.data.id}`);
      showToast(
        `Registration of company "${companyDetils.name}" Complete! Now setup primary admin details.`,
        "success",
      );

      setIsLoading(false);
    } else {
      showToast(`${res.error.message}`, "error");
      setErrorMessage(res.error.message);
      setCompanyStep(1);

      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim())
      return showToast("Please fill out all the required fields!", "warning");
    if (password.trim() !== confirmPassword.trim()) {
      showToast(
        "Passwords do not match! Please check your password and try again.",
        "error",
      );
      return;
    }
    setIsLoading(true);

    const adminDetils = {
      tenant_id: tenantId,
      first_name: first,
      last_name: last,
      email: email,
      phone: phone,
      password: confirmPassword,
      role: "Super Admin",
    };
    const res = await createTenantAdmin(adminDetils);

    if (res.success) {
      showToast(
        `Registration successful! Please verify your email.`,
        "success",
      );

      router.push(
        `/verify-email?v=${btoa(JSON.stringify({ email, id: res.data.id, role: "admin" }))}`,
      );
    } else {
      showToast(`Failed to register details: ${res.error.message}`, "error");
      setIsLoading(false);
    }
  };
  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
        <div className="mb-8">
          <Link
            href={"/signin"}
            className="text-brand-500 mb-2 flex items-center gap-2"
          >
            <ArrowRightIcon className="r rotate-180" /> Signin instead.
          </Link>
          <h1 className="text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
            {step === "company" ? "Register workspace" : "Complete Admin Setup"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {step === "company"
              ? "Start your 2-week free trial by registering your company this will take a second."
              : "Finalize your administrator account for your new workspace."}
          </p>
        </div>

        {step === "company" ? (
          <div className="animate-in fade-in space-y-6 duration-500">
            {companyStep === 1 ? (
              <>
                <div>
                  <Label>
                    Rental Company Name{" "}
                    <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    error={!!errorMessage.includes("name")}
                    hint={
                      errorMessage.includes("name") ? errorMessage : undefined
                    }
                    value={companyDetils.name}
                    onChange={(e) =>
                      setCompanyDetails((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g. Fleet Master Inc."
                  />
                </div>

                <div>
                  <Label>
                    Subdomain Slug <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    error={!!errorMessage.includes("slug")}
                    hint={
                      errorMessage.includes("slug") ? errorMessage : undefined
                    }
                    value={companyDetils.slug}
                    onChange={(e) =>
                      setCompanyDetails((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    placeholder="e.g. mycompany"
                  />

                  {/* Slug Preview */}
                  <div className="mt-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                    <p className="mb-1 text-xs text-gray-400">
                      Workspace URL preview:
                    </p>
                    <p className="text-brand-500 font-mono text-sm">
                      {companyDetils.slug
                        .trim()
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-")
                        ? companyDetils.slug
                          .trim()
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                        : "mycompany"}
                      .fleetmaster.co.ke
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Company Email </Label>
                  <Input
                    error={!!errorMessage.includes("email")}
                    hint={
                      errorMessage.includes("email") ? errorMessage : undefined
                    }
                    type="email"
                    value={companyDetils.email}
                    onChange={(e) =>
                      setCompanyDetails((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <Label>Primary Phone </Label>
                  <Input
                    error={!!errorMessage.includes("phone")}
                    hint={
                      errorMessage.includes("phone") ? errorMessage : undefined
                    }
                    type="tel"
                    value={companyDetils.phone}
                    onChange={(e) =>
                      setCompanyDetails((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="07123*****"
                  />
                </div>
              </>
            ) : companyStep === 2 ? (
              <>
                <div>
                  <Label>Country </Label>
                  <Select
                    options={allCountriesDB.map((c) => {
                      return {
                        value: c.country,
                        label: c.country,
                      };
                    })}
                    defaultValue={companyDetils.country}
                    value={companyDetils.country}
                    onChange={(e) =>
                      setCompanyDetails((prev) => ({ ...prev, country: e }))
                    }
                  />
                </div>

                <div>
                  <Label>Head Office Address </Label>
                  <Input
                    type="email"
                    value={companyDetils.address}
                    onChange={(e) =>
                      setCompanyDetails((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <Label>Timezone </Label>
                  <Select
                    options={allTimezones()}
                    defaultValue={companyDetils.timezone}
                    value={companyDetils.timezone}
                    onChange={(e) =>
                      setCompanyDetails((prev) => ({ ...prev, timezone: e }))
                    }
                  />
                </div>
                <div>
                  <Label>Industry Type </Label>
                  <Select
                    options={industries.map((c) => {
                      return {
                        value: c,
                        label: c,
                      };
                    })}
                    defaultValue={companyDetils.industry}
                    value={companyDetils.industry}
                    onChange={(e) =>
                      setCompanyDetails((prev) => ({ ...prev, industry: e }))
                    }
                  />
                </div>
                <div>
                  <Label>Number of Employees </Label>
                  <Select
                    options={employees.map((c) => {
                      return {
                        value: c,
                        label: c + " Employees",
                      };
                    })}
                    defaultValue={companyDetils.employees}
                    value={companyDetils.employees}
                    onChange={(e) =>
                      setCompanyDetails((prev) => ({ ...prev, employees: e }))
                    }
                  />
                </div>
              </>
            ) : null}

            <Button
              className="w-full"
              onClick={() => {
                companyStep === 2
                  ? handleCreateCompany()
                  : setCompanyStep((prev) => prev + 1);
              }}
              endIcon={<ArrowRightIcon />}
              disabled={isLoading}
            >
              {isLoading
                ? "Creating..."
                : companyStep === 1
                  ? "Next"
                  : "Continue"}
            </Button>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right space-y-6 duration-500">
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <div>
                <Label>First Name </Label>
                <Input
                  type="tel"
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  placeholder="07123*****"
                />
              </div>
              <div>
                <Label>Last Name </Label>
                <Input
                  type="tel"
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                  placeholder="07123*****"
                />
              </div>
            </div>
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
              />
            </div>

            <div>
              <Label>Phone </Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07123*****"
              />
            </div>

            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-4 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500" />
                  )}
                </span>
              </div>
            </div>
            <div>
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-4 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500" />
                  )}
                </span>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleCreateAdmin}
              disabled={isLoading}
            >
              {isLoading ? "Finalizing..." : "Complete Setup"}
            </Button>
            <p className="text-center text-xs text-gray-400">
              Tenant ID: {tenantId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegisterForm() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full animate-pulse space-y-6 p-6">
          <div className="h-6 w-48 rounded-md bg-gray-200 dark:bg-gray-600"></div>
          <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-gray-600"></div>
        </div>
      }
    >
      <RegisterFormInner />
    </Suspense>
  );
}
