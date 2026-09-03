"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useTenant } from "@/context/TenantContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { createTenantClient } from "@/app/actions/client";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { allCountriesDB } from "@/data/globalExports";

export const countries = allCountriesDB.map((country) => ({
  code: country.code,
  label: country.phone,
  country: country.country,
}));

export const formatToE164 = (phone: string, countryCode: string) => {
  const phoneNumber = parsePhoneNumberFromString(phone, countryCode as any);
  if (
    phoneNumber &&
    phoneNumber.isValid() &&
    phoneNumber.country === countryCode
  ) {
    return phoneNumber.format("E.164");
  }

  return null;
};

export default function SignUpForm() {
  const router = useRouter();
  const { tenant } = useTenant();
  const { showToast } = useToast();
  const [profileStep, setProfileStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("123456789");
  const [formData, setFormData] = useState({
    first_name: "Austine",
    last_name: "Oduk",
    email: "austine.oduk@gmail.com",
    phone: "768927629",
    password: "123456789",
    country: "Kenya",
    bio: "",
    dob: "2001-10-01",
    city: "Nairobi",
    address: "5th Park Av, House 6",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 3;


  const validateStep = (step: number) => {
    setErrorMessage("");

    if (step === 1) {
      if (
        !formData.first_name.trim() ||
        !formData.last_name.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim()
      ) {
        showToast("Please fill out all the required fields!", "error");
        return false;
      }

      const selectedCountry = countries.find(
        (c) => c.country === formData.country,
      );

      if (!selectedCountry) {
        showToast("Please select a valid country!", "error");
        return false;
      }

      const e164Phone = formatToE164(
        formData.phone,
        selectedCountry.code,
      );

      if (!e164Phone) {
        showToast("Please enter a valid phone number!", "error");
        setErrorMessage("Please enter a valid phone number!");
        setProfileStep(1)
        return false;
      }

      return true;
    }

    if (step === 2) {
      if (!formData.dob.trim() || !formData.city.trim()) {
        showToast("Please fill out all the required fields!", "error");
        return false;
      }

      return true;
    }

    if (step === 3) {
      if (
        !formData.password.trim() ||
        !confirmPassword.trim()
      ) {
        showToast("Please enter and confirm your password!", "error");
        return false;
      }

      if (formData.password !== confirmPassword) {
        showToast("Passwords do not match!", "error");
        setErrorMessage("Passwords do not match!");
        setProfileStep(totalSteps)
        return false;
      }

      if (!isChecked) {
        showToast(
          "Please read and agree to the Terms and Conditions!",
          "error",
        );
        setErrorMessage(
          "Please read and agree to the Terms and Conditions!",
        );
        setProfileStep(totalSteps)
        return false;
      }

      return true;
    }

    return true;
  };


  const handleCreateAccount = async () => {
    if (!tenant || !tenant?.id) {
      showToast("An error occured while finding destination!", "error");
      return;
    }

    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password.trim() ||
      !confirmPassword.trim()
    ) {
      showToast("Please fill out all the required fields!", "error");
      return;
    }

    if (formData.password.trim() !== confirmPassword.trim()) {
      showToast("Passwords do not match!", "error");
      setErrorMessage("Passwords do not match!");
      setProfileStep(totalSteps)
      return;
    }

    if (!isChecked) {
      showToast("Please read and agree to the Terms and Conditions!", "error");
      setErrorMessage("Please read and agree to the Terms and Conditions!");
      setProfileStep(totalSteps)
      return;
    }
    // 1. Find the country first
    const selectedCountry = countries.find(
      (c) => c.country === formData.country,
    );

    // 2. Defensive check
    if (!selectedCountry) {
      throw new Error("Invalid country selected");
    }

    // 3. Format with safety
    const e164Phone = formatToE164(formData.phone, selectedCountry.code);
    if (e164Phone === null) {
      showToast("Please enter a valid phone number!", "error");
      setErrorMessage("Please enter a valid phone number!");
      setProfileStep(1)
      return;
    }

    setIsLoading(true);
    const res = await createTenantClient({
      ...formData,
      tenant_id: tenant.id,
      phone: e164Phone,
    });

    if (res?.success && res?.data?.id) {
      showToast(
        `Registration successful! Please verify your email.`,
        "success",
      );

      window.open(
        `/verify-email?v=${btoa(JSON.stringify({ email: formData.email, id: res.data.id, role: 'Client', tenant: tenant.slug.trim() }))}`,
      )
      router.push('/signin');
    } else {
      showToast(
        `Failed to register details: ${res?.error?.message || "An error occurred"}`,
        "error",
      );
      setErrorMessage(res?.error?.message || "An error occurred");
      setIsLoading(false);
      setProfileStep(1)
    }
  };

  return (
    <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        {/* signup block  */}
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Step {profileStep}</strong> of <strong>{totalSteps}</strong> steps: Enter your details below to sign up!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button className="inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign up with Google
              </button>
              <button className="inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="21"
                  className="fill-current"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
                </svg>
                Sign up with X
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white p-2 text-gray-400 sm:px-5 sm:py-2 dark:bg-gray-900">
                  Or
                </span>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (!validateStep(profileStep)) {
                  return;
                }

                if (profileStep < totalSteps) {
                  setProfileStep((prev) => prev + 1);
                  return;
                }

                handleCreateAccount();
              }}
            >
              <div className="space-y-5">
                {
                  profileStep === 1 && (
                    <>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* <!-- First Name --> */}
                        <div className="sm:col-span-1">
                          <Label>
                            First Name<span className="text-error-500">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="fname"
                            name="fname"
                            value={formData.first_name}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                first_name: e.target.value,
                              }))
                            }
                            placeholder="Enter your first name"
                          />
                        </div>
                        {/* <!-- Last Name --> */}
                        <div className="sm:col-span-1">
                          <Label>Last Name</Label>
                          <Input
                            type="text"
                            id="lname"
                            name="lname"
                            value={formData.last_name}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                last_name: e.target.value,
                              }))
                            }

                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>

                      {/* <!-- Email --> */}
                      <div>
                        <Label>
                          Email<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="email"
                          error={!!errorMessage.includes("email")}
                          hint={
                            errorMessage.includes("email") ? errorMessage : undefined
                          }
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="Enter your email"
                        />
                      </div>

                      {/* <!-- Phone --> */}
                      <div>
                        <Label>
                          Phone<span className="text-error-500">*</span>
                        </Label>
                        <div className="relative grid grid-cols-1 gap-2 lg:grid-cols-2">
                          <Select
                            className="w-full"
                            defaultValue={"Kenya"}
                            value={formData.country}
                            options={countries.map((c) => {
                              return {
                                value: c.country,
                                label: `${c.country} (${c.label})`,
                              };
                            })}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, country: e }))
                            }
                          />

                          <Input
                            type="tel"
                            className="w-full"
                            id="phone"
                            error={!!errorMessage.includes("phone")}
                            hint={
                              errorMessage.includes("phone")
                                ? errorMessage
                                : undefined
                            }
                            name="phone"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }

                            placeholder="555 555-0199"
                          />
                        </div>
                      </div>
                    </>
                  )
                }
                {
                  profileStep === 2 && (
                    <>
                      {/* <!-- DOB --> */}
                      <div>
                        <Label>
                          Date of Birth<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="date"
                          error={!!errorMessage.includes("dob")}
                          hint={
                            errorMessage.includes("dob") ? errorMessage : undefined
                          }
                          id="dob"
                          name="dob"
                          value={formData.dob}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              dob: e.target.value,
                            }))
                          }
                          placeholder="Enter your dob"
                        />
                      </div>

                      {/* <!-- county --> */}
                      <div>
                        <Label>
                          City/County<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          error={!!errorMessage.includes("email")}
                          hint={
                            errorMessage.includes("email") ? errorMessage : undefined
                          }
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          placeholder="Enter your city e.g Westlands, NRB"
                        />
                      </div>

                      {/* <!-- adress --> */}
                      <div>
                        <Label>
                          Address 1
                        </Label>
                        <Input
                          type="text"
                          error={!!errorMessage.includes("address")}
                          hint={
                            errorMessage.includes("address") ? errorMessage : undefined
                          }
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          placeholder="5th Park Av, House 6"
                        />
                      </div>
                    </>
                  )
                }

                {
                  profileStep === 3 && (
                    <>
                      {/* <!-- About --> */}
                      <div>
                        <Label>
                          About<span className="text-gray-500"> (Optional)</span>
                        </Label>
                        <Input
                          type="text"
                          error={!!errorMessage.includes("email")}
                          hint={
                            errorMessage.includes("email") ? errorMessage : undefined
                          }
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          placeholder="Enter an about"
                        />
                      </div>

                      {/* <!-- Password --> */}
                      <div>
                        <Label>Password</Label>
                        <div className="relative">
                          <Input
                            placeholder="Enter your password"
                            value={formData.password}
                            type={showPassword ? "text" : "password"}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            error={!!errorMessage.includes("password")}
                            hint={
                              errorMessage.includes("password")
                                ? errorMessage
                                : undefined
                            }
                          />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                          >
                            {showPassword ? (
                              <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                            ) : (
                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                            )}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label>Confirm Password</Label>
                        <div className="relative">
                          <Input
                            placeholder="Enter your password"
                            value={confirmPassword}
                            type={showPassword ? "text" : "password"}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={!!errorMessage.includes("password")}
                            hint={
                              errorMessage.includes("password")
                                ? errorMessage
                                : undefined
                            }
                          />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                          >
                            {showPassword ? (
                              <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                            ) : (
                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                            )}
                          </span>
                        </div>
                      </div>


                      {/* <!-- Checkbox --> */}
                      <div className="flex cursor-pointer items-center gap-3">
                        <Checkbox
                          className="h-5 w-5"
                          checked={isChecked}
                          onChange={setIsChecked}
                        />
                        <p
                          onClick={() => setIsChecked(!isChecked)}
                          className="inline-block text-sm font-normal text-gray-500 dark:text-gray-400"
                        >
                          By creating an account means you agree to the{" "}
                          {/* open in popup window  */}
                          <a target="_blank" href="/terms" className="text-blue-500">
                            Terms and Conditions,
                          </a>{" "}
                          and our{" "}
                          <a
                            target="_blank"
                            href="/privacy"
                            className="text-blue-500"
                          >
                            Privacy Policy
                          </a>
                        </p>
                      </div>
                    </>
                  )
                }

                {/* <!-- Button --> */}
                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="w-full px-4! py-2.5! text-sm"
                  >
                    {isLoading
                      ? "Signing Up..."
                      : profileStep < totalSteps
                        ? "Next"
                        : "Sign Up"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
                Already have an account? &nbsp;
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In Here.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}
