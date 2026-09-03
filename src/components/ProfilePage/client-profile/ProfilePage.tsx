"use client";

import { useUser } from "@/context/UserContext";
import { Avatar } from "@mui/material";
import Link from "next/link";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { DownloadIcon } from "@/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useEffect, useState, useTransition } from "react";
import { useToast } from "@/context/ToastContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import {
  resendPhoneOTP,
  sendPhoneVerification,
  verifyPhoneOTP,
} from "@/app/actions/verification/phone";
import { retryDuration } from "@/data/globalExports";
import LoadingInfo from "@/components/loading/LoadingInfo";
import Alert from "@/components/ui/alert/Alert";

export const hex = (id: string): string => {
  // 1. Cross-runtime conversion to standard hex format
  const encoder = new TextEncoder();
  const byteArray = encoder.encode(id);
  const rawHex = Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  // 2. Enforce exactly 8 characters (pad if too short, slice if too long)
  const standardizedHex = rawHex.padEnd(12, "0").slice(0, 12);

  // 3. Append the commercial FM suffix (e.g., FleetMaster telemetry flag)
  return `FM${standardizedHex}`;
};

export const getAge = (dob: string) => {
  try {
    const now = new Date().getFullYear();
    const date = new Date(dob).getFullYear();

    return Number(now - date);
  } catch {
    return 0;
  }
};

function ProfilePage() {
  const { profile, loading, setProfile } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const { isOpen, openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [sentCode, setSentCode] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState(0); // shorter for sms
  const [errorMessage, setErrorMessage] = useState("");

  const phone = profile?.phone || "";
  const verifyData = { email: profile?.email, id: profile?.id, role: profile?.role };

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
    setErrorMessage("");

    const res = await verifyPhoneOTP(
      btoa(JSON.stringify({ phone, id: profile?.id, otp })),
    );

    if (res.success) {
      showToast(
        `Your phone number ${phone} has been verified successfully!`,
        "success",
      );

      setIsLoading(false);
      closeModal();
      setProfile((prev) => ({
        ...prev,
        verification_status: {
          ...prev.verification_status,
          phone: true,
        },
      }));
    } else {
      showToast(`${res.error?.message || "Failed to verify OTP"}`, "error");
      setErrorMessage(`${res.error?.message || "Failed to verify OTP"}`);
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    setSendingCode(true);
    setSentCode(true);

    if (cooldown > 0 || !phone) return;

    const res = await sendPhoneVerification(profile?.id, phone);

    if (res.success) {
      showToast(`A verification code has been sent to ${phone}.`, "success");
      setCooldown(retryDuration);
    } else {
      showToast(`${res.error?.message || "Failed to send code"}`, "error");
      setErrorMessage(`${res.error?.message || "Failed to send code"}`);
      setSentCode(false);
    }

    setSendingCode(false);
  };

  const handleResendCode = () => {
    setSendingCode(true);
    if (cooldown > 0 || !phone) return;

    startTransition(async () => {
      const res = await resendPhoneOTP(profile?.id, btoa(phone));

      if (res.success) {
        showToast("A new verification code has been sent.", "success");
        setCooldown(retryDuration);
      } else {
        showToast(`${res.error?.message || "Failed to send code"}`, "error");
        setErrorMessage(`${res.error?.message || "Failed to send code"}`);
      }

      setSendingCode(false);
    });
  };

  // Rebuild the accurate current page URL dynamically
  const currentPageUrl = encodeURIComponent(
    searchString ? btoa(`${pathname}?${searchString}`) : btoa(pathname),
  );

  if (loading) {
    return (<LoadingInfo />);

  } else if (!loading && !profile) {
    window.location.href = `/signin?r=${currentPageUrl}`;
    return (
      <div className="container mx-auto min-h-[80vh] max-w-6xl p-5 text-gray-400">
        Redirecting to signin ...
      </div>
    );
  }

  return (
    <div className="container m-auto max-w-6xl">
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-150 p-5 lg:p-10"
      >
        <h4 className="text-title-sm mb-7 font-semibold text-gray-800 dark:text-white/90">
          Verify phone
        </h4>

        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
          We have sent a verification code to your mobile phone{" "}
          {phone.slice(0, 5)}*******{phone.slice(-3)}. Please check your inbox
          and enter the code below to verify your email.
        </p>
        {/* phone verification otp block  */}
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (sentCode) {
                handleVerifyOTP();
              } else {
                handleSendCode();
              }
            }}
          >
            <div className="space-y-5">
              {/* <!-- Enter OTP --> */}
              <div className="w-full">
                <Label>
                  Enter OTP<span className="text-error-500">*</span>
                </Label>
                <Input
                  error={!!errorMessage}
                  hint={
                    errorMessage || "Enter the 6-digit code sent to your phone."
                  }
                  type="tel"
                  id="otp"
                  className="mt-2 w-full text-center tracking-wide"
                  name="otp"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setOtp(value);
                  }}
                  placeholder="000000"
                  disabled={isLoading || sendingCode}
                />
              </div>
              {/* <!-- Button --> */}
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={
                    isLoading ||
                    sendingCode ||
                    !phone.trim() ||
                    (sentCode && otp.trim().length < 6)
                  }
                  className="w-full px-4! py-3! text-sm"
                >
                  {!sentCode
                    ? "Send OTP"
                    : isLoading
                      ? "Verifying..."
                      : sendingCode
                        ? "Sending Code..."
                        : "Verify OTP"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
              Did not receive code? &nbsp;
              {cooldown > 0 ? (
                <span className="text-gray-400 dark:text-gray-500">
                  Resend in {cooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isPending || !phone.trim()}
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium disabled:opacity-50"
                >
                  {isPending ? "Resending..." : "Resend Code"}
                </button>
              )}
            </p>
          </div>
        </div>
      </Modal>

      <div className="space-y-6" data-loading={loading}>
        <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex w-full flex-col items-center gap-6 xl:flex-row">
              <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800">
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                  }}
                  src={profile?.profile_pic}
                  alt="user"
                />
              </div>
              <div className="order-3 xl:order-2">
                <h4 className="mb-2 text-center text-lg font-semibold text-gray-800 xl:text-left dark:text-white/90">
                  {profile?.first_name || "First Nmae"}{" "}
                  {profile?.last_name || "Last Nmae"}
                </h4>
                <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile?.role || "Manager"}
                  </p>
                  <div className="hidden h-3.5 w-px bg-gray-300 xl:block dark:bg-gray-700"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile?.country || "United States"}
                  </p>
                  <div className="hidden h-3.5 w-px bg-gray-300 xl:block dark:bg-gray-700"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Joined{" "}
                    {profile?.created_at
                      ? new Date(profile?.created_at).toLocaleString()
                      : "Date Joined"}{" "}
                  </p>
                </div>
              </div>
              {/* socials  */}
              <div className="order-2 flex grow items-center gap-2 xl:order-3 xl:justify-end">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.facebook.com/PimjoHQ"
                  className="shadow-theme-xs flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z"
                      fill=""
                    />
                  </svg>
                </a>

                <a
                  href="https://x.com/PimjoHQ"
                  target="_blank"
                  rel="noreferrer"
                  className="shadow-theme-xs flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z"
                      fill=""
                    />
                  </svg>
                </a>

                <a
                  href="https://www.linkedin.com/company/pimjo"
                  target="_blank"
                  rel="noreferrer"
                  className="shadow-theme-xs flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"
                      fill=""
                    />
                  </svg>
                </a>

                <a
                  href="https://instagram.com/PimjoHQ"
                  target="_blank"
                  rel="noreferrer"
                  className="shadow-theme-xs flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z"
                      fill=""
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
              Personal Information
            </h4>

            <Link href="/profile/edit" className="text-nowrap">
              <button className="flex gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-nowrap text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                    fill=""
                  />
                </svg>
                Edit
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-10">
            <DataViewSchema
              label="First Name"
              value={profile?.first_name || "N/A"}
            />
            <DataViewSchema
              label="Last Name"
              value={profile?.last_name || "N/A"}
            />
            <DataViewSchema
              label="Email address"
              value={profile?.email || "N/A"}
              verified={profile?.verification_status?.email}
              action={
                <Link
                  target="_blank"
                  href={`/verify-email?v=${btoa(JSON.stringify(verifyData))}`}
                  className="text-theme-sm mt-3 flex w-full items-center justify-center rounded-lg border border-blue-500 bg-blue-500 p-2 px-4 font-medium text-nowrap text-white hover:bg-blue-600"
                >
                  Verify Email
                </Link>
              }
            />
            <DataViewSchema
              label="Phone"
              value={profile?.phone || "N/A"}
              verified={profile?.verification_status?.phone}
              action={
                <button
                  onClick={openModal}
                  className="text-theme-sm mt-3 flex w-full items-center justify-center rounded-lg border border-blue-500 bg-blue-500 p-2 px-4 font-medium text-nowrap text-white hover:bg-blue-600"
                >
                  Verify Phone
                </button>
              }
            />
            <DataViewSchema label="Bio" value={profile?.bio || "N/A"} />
            <DataViewSchema
              label="Date Of Birth"
              value={
                profile?.dob
                  ? new Date(profile?.dob).toLocaleDateString() +
                  ", " +
                  getAge(profile?.dob) +
                  " Yrs"
                  : "N/A"
              }
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
              Address
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-10">
            <DataViewSchema label="Country" value={profile?.country || "N/A"} />
            <DataViewSchema
              label="City/State"
              value={`${profile?.city || "N/A"}, ${profile?.country || "N/A"}`}
            />
            <DataViewSchema
              label="Postal Address"
              value={profile?.postal_code || "N/A"}
            />
            <DataViewSchema label="TAX ID" value={hex(profile?.id)} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
              Documents
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-10">
            <DataViewSchema
              label="National ID/Passport Number"
              value={profile?.national_id_number || "2791 ..."}
              verified={profile?.verification_status?.national_id}
            />
            <DataViewSchema
              label="Driving License Number"
              value={profile?.dl_number || "8345 ..."}
              verified={profile?.verification_status?.driving_license}
            />
          </div>
          
                    {
                      profile.verification_error && <Alert className='mt-3!' variant="error" title="Document verification failed!" message={profile.verification_error} /> 
                    }
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

export function DataViewSchema({
  label,
  value,
  verified,
  action,
}: {
  label: string;
  value: string;
  verified?: boolean;
  action?: any;
}) {
  return (
    <div className="col-span-2 flex flex-col space-y-1 p-2 lg:col-span-1">
      <Label className="mb-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        {label}
      </Label>
      {verified === undefined ? (
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          {value}
        </p>
      ) : (
        <>
          <p className="flex items-center justify-between gap-5 text-sm font-medium text-gray-800 dark:text-white/90">
            {label.includes("National") ||
              label.includes("License") ? (
              <span className="flex items-center gap-2">
                <DownloadIcon style={{ width: 28, height: 28 }} /> {value}
              </span>
            ) : (
              <>{value}</>
            )}

            {verified ? (
              <TaskAltOutlinedIcon
                fontSize="small"
                className="text-green-500"
              />
            ) : (
              <CancelOutlinedIcon fontSize="small" className="text-red-500" />
            )}
          </p>
          {!verified && action}
        </>
      )}
    </div>
  );
}
