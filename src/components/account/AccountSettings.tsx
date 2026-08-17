"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Avatar, Backdrop, CircularProgress } from "@mui/material";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { PencilIcon, TrashBinIcon } from "@/icons";
import Select from "../form/Select";
import { updatePassword } from "@/app/actions/client";
import { useToast } from "@/context/ToastContext";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  resendPhoneOTP,
  sendPhoneVerification,
  verifyPhoneOTP,
} from "@/app/actions/verification/phone";
import { allCountriesDB, retryDuration } from "@/data/globalExports";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatToE164 } from "../auth/SignUpForm";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import Alert from "../ui/alert/Alert";
import Preferences from "./preferences/Preferences";

export default function AccountSettings({
  profile,
  setProfile,
  loading,
  currentSetting,
}: {
  profile: any;
  setProfile: any;
  loading: boolean;
  currentSetting: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const [isSaving, setIsSaving] = useState(false);
  const [confirmPhone, setConfirmPhone] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const { showToast } = useToast();
  const [profileDetails, setProfileDetails] = useState(null);
  const [activeTab, setActiveTab] = useState<string>(
    currentSetting,
    // "Change Phone"
    // "Two-Factor Authentification"
    // "Change Password"
    // "Change Email"
    // "Manage Your Account"
  );
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [sentCode, setSentCode] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState(0); // shorter for sms
  const [errorMessage, setErrorMessage] = useState("");
  const isNewEmail = profile?.email !== profileDetails?.email;
  const isAdmin = profile?.role !== "Client";

  const clauses: any[] = [
    { title: "Accessibility" },
    { title: "Change Password" },
    { title: "Two-Factor Authentification" },
    { title: "Manage Your Account" },
    { title: "Change Phone" },
    { title: "Change Email" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfileDetails((prev: any) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = async () => {
    setIsSaving(true);
    const res = await updatePassword(profile?.id, profileDetails);

    if (res.success) {
      showToast(
        "Your password was changed successfully! You will be logged out in all devices.",
        "success",
      );
      setProfile(res.data);
    }
    setIsSaving(false);
  };

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
      btoa(
        JSON.stringify({
          phone: profileDetails?.new_phone,
          id: profile?.id,
          otp,
        }),
      ),
      isAdmin && "admin",
    );

    if (res.success) {
      showToast(
        `Your phone number ${profileDetails?.new_phone} has been verified successfully!`,
        "success",
      );

      setIsLoading(false);
      setProfile((prev) => ({
        ...prev,
        verification_status: {
          ...prev.verification_status,
          phone: true,
        },
        phone: profileDetails?.new_phone,
      }));

      setConfirmPhone(false);
    } else {
      showToast(`${res.error?.message || "Failed to verify OTP"}`, "error");
      setErrorMessage(`${res.error?.message || "Failed to verify OTP"}`);
      setIsLoading(false);

      if (res.error.message.includes("phone number is already registered")) {
        setConfirmPhone(false);
      }
    }
  };

  const handleSendCode = async () => {
    setSendingCode(true);
    setSentCode(true);
    setErrorMessage("");

    if (cooldown > 0 || !profileDetails?.new_phone) return;

    const res = await sendPhoneVerification(
      profile?.id,
      profileDetails?.new_phone,
      isAdmin && "admin",
    );

    if (res.success) {
      showToast(
        `A verification code has been sent to ${profileDetails?.new_phone}.`,
        "success",
      );
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
    setErrorMessage("");
    if (cooldown > 0 || !profileDetails?.new_phone) return;

    startTransition(async () => {
      const res = await resendPhoneOTP(
        profile?.id,
        btoa(profileDetails?.new_phone),
        isAdmin && "admin",
      );

      if (res.success) {
        showToast("A new verification code has been sent.", "success");
        setCooldown(retryDuration);
        setErrorMessage("");
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
    return (
      <div className="container mx-auto min-h-[80vh] max-w-6xl p-5 text-gray-400">
        Loading profile ...
      </div>
    );
  } else if (!loading && !profile) {
    window.location.href = `/signin?r=${currentPageUrl}`;
    return (
      <div className="container mx-auto min-h-[80vh] max-w-6xl p-5 text-gray-400">
        Redirecting to signin ...
      </div>
    );
  }


  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isSaving}
        onClick={() => null}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="grid w-full grid-cols-1 gap-8 space-y-5 lg:grid-cols-12">
        {/* left side menu  */}
        <div className="col-span-12 h-fit space-y-2 lg:sticky lg:top-6 lg:col-span-4">
          <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="mb-3 px-3 text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
              Settings
            </p>
            <nav className="space-y-1">
              {clauses.map((clause, i) => {
                const isActive = activeTab === clause.title;
                return (
                  <button
                    key={clause.title}
                    onClick={() => {
                      setActiveTab(clause.title);

                      router.replace(
                        `/profile/account-settings/${clause.title.toLowerCase().replaceAll(" ", "_")}`,
                      );
                    }}
                    className={`flex w-full items-center justify-between rounded-xl p-3 text-left text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-green-800 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* <Icon className={`w-4! h-4! ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} /> */}
                      <span>
                        {i + 1}. {clause.title}
                      </span>
                    </div>
                    <ChevronRightIcon className="h-4! w-4! opacity-70" />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        {/* right side main content  */}
        <div className="col-span-12 lg:col-span-8">
          {activeTab === "Accessibility" && (
            <Preferences profile={profile} loading={loading} />
          )}
          {/* Security Section */}
          {activeTab === "Two-Factor Authentification" && (
            <div className="no-scrollbar relative min-h-screen w-full overflow-y-auto rounded-3xl bg-white p-5 dark:bg-gray-900">
              <div className="space-y-4 lg:space-y-5">
                <div className="px-2 pr-14">
                  <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Two-Factor Authentification
                  </h4>
                  <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div
                  className={`flex w-full flex-col gap-2 rounded-xl p-3 text-left font-semibold text-slate-600 transition-all dark:text-slate-400`}
                >
                  {[
                    {
                      title: "Email",
                      value: profile?.email,
                    },
                    {
                      title: "Phone",
                      value: profile?.phone,
                    },
                    {
                      title: "Google",
                      value: profile?.email,
                    },
                    {
                      title: "Third Party Authenticator",
                      value: "Authenticator App",
                    },
                  ].map((a, i) => (
                    <div className="mb-3 flex cursor-pointer gap-2 rounded-lg p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50">
                      {i + 1}.
                      <div>
                        <div className="text-sm">{a.title}</div>
                        <span className="text-xs text-slate-500">
                          {a.value}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div>Phone</div>
                </div>

                <div className="mt-3 w-full rounded-xl border border-green-500/50 p-3">
                  <p className="text-muted mb-3 p-4 text-center text-sm text-gray-400">
                    No 2FA Added.
                  </p>
                  <button className="text-theme-sm mt-3 flex w-full items-center justify-center rounded-lg border border-green-600 bg-green-600 p-2 px-4 font-medium text-nowrap text-white hover:bg-green-700">
                    Add 2FA <PencilIcon />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Change Password" && (
            <div className="no-scrollbar relative min-h-screen w-full overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
              {profile?.is_otp && (
                <Alert
                  title="Password Change Recommended!"
                  message="Please change your password to continue securing your account."
                  variant="warning"
                />
              )}
              <div className="mt-4 px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Change Password
                </h4>
                <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
                  Update your details to keep your profile up-to-date.
                </p>
              </div>
              <form
                className="flex flex-col"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  handlePasswordChange();
                }}
              >
                <div className="custom-scrollbar overflow-y-auto px-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <EditableInput
                      placeholder="Enter old password"
                      type="password"
                      label="Old Password"
                      value={profileDetails?.old_password}
                      onChange={(v) => handleInputChange("old_password", v)}
                    />
                    <EditableInput
                      placeholder="Enter password"
                      type="password"
                      label="New Password"
                      value={profileDetails?.password}
                      onChange={(v) => handleInputChange("password", v)}
                    />
                    <EditableInput
                      placeholder="Confirm password"
                      type="password"
                      label="Confirm Password"
                      value={profileDetails?.confirm_password}
                      onChange={(v) => handleInputChange("confirm_password", v)}
                    />
                  </div>
                </div>
                <button className="bg-brand-600 border-brand-600 text-theme-sm hover:bg-brand-700 mt-3 flex w-full items-center justify-center rounded-lg border p-2 px-4 font-medium text-nowrap text-white">
                  Change Password
                  {/* <PencilIcon /> */}
                </button>
              </form>
            </div>
          )}

          {activeTab === "Change Phone" && (
            <div className="no-scrollbar relative min-h-screen w-full overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
              <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Change Phone
                </h4>
                <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
                  Update your details to keep your profile up-to-date.
                </p>
              </div>

              {confirmPhone ? (
                <div className="px-2">
                  <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                    We have sent a verification code to your mobile phone{" "}
                    {formatToE164(
                      profileDetails?.new_phone,
                      allCountriesDB.find((c) => c.country === profile.country)
                        .code,
                    ).slice(0, 5)}
                    *******
                    {formatToE164(
                      profileDetails?.new_phone,
                      allCountriesDB.find((c) => c.country === profile.country)
                        .code,
                    ).slice(-3)}
                    . Please check your inbox and enter the code below to verify
                    your email.
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
                              errorMessage ||
                              "Enter the 6-digit code sent to your phone."
                            }
                            type="tel"
                            id="otp"
                            className="mt-2 w-full text-center tracking-wide"
                            name="otp"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9]/g,
                                "",
                              );
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
                              !profileDetails?.new_phone.trim() ||
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
                            disabled={
                              isPending ||
                              sendingCode ||
                              !profileDetails?.new_phone.trim() ||
                              !sentCode
                            }
                            className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium disabled:opacity-50"
                          >
                            {isPending ? "Resending..." : "Resend Code"}
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="custom-scrollbar overflow-y-auto px-2">
                  <div className="flex flex-col gap-4">
                    <div className="col-span-2 flex flex-col space-y-1 lg:col-span-1">
                      <Label className="mb-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        {"Phone Number"}
                      </Label>
                      <div className="flex w-full items-center justify-between py-2">
                        <span className="text-black dark:text-white">
                          {profile?.phone}
                        </span>
                        {profile?.verification_status?.phone ? (
                          <span className="text-success-500 flex items-center gap-2">
                            {" "}
                            <TaskAltOutlinedIcon fontSize="small" /> Verified
                          </span>
                        ) : (
                          <span className="text-error-500 flex items-center gap-2">
                            <CancelOutlinedIcon fontSize="small" /> Not Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <EditableInput
                      error={!!errorMessage.includes("phone")}
                      hint={
                        errorMessage.includes("phone")
                          ? errorMessage
                          : undefined
                      }
                      placeholder="Enter Phone e.g +1234 5678 9012"
                      type="tel"
                      label="New Phone Number"
                      value={profileDetails?.new_phone}
                      onChange={(v) => handleInputChange("new_phone", v)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!profileDetails?.new_phone.trim()) {
                        showToast(
                          "Please enter a valid phone number!",
                          "error",
                        );
                        setErrorMessage(
                          "Please enter a phone number to change to!",
                        );
                        return;
                      }
                      const oldE164Phone = formatToE164(
                        profile?.phone,
                        allCountriesDB.find(
                          (c) => c.country === profile.country,
                        ).code,
                      );
                      const e164Phone = formatToE164(
                        profileDetails?.new_phone,
                        allCountriesDB.find(
                          (c) => c.country === profile.country,
                        ).code,
                      );
                      const isNewPhone = oldE164Phone !== e164Phone;

                      if (e164Phone === null) {
                        showToast(
                          "Please enter a valid phone number!",
                          "error",
                        );
                        setErrorMessage("Please enter a valid phone number!");
                        return;
                      }

                      if (isNewPhone) {
                        setConfirmPhone(true);
                        setErrorMessage("");
                      } else {
                        showToast(
                          "Please enter a different phone number!",
                          "error",
                        );
                        setErrorMessage(
                          "Please enter a different phone number!",
                        );
                      }
                    }}
                    className="bg-brand-500 border-brand-500 text-theme-sm hover:bg-brand-600 mt-3 flex w-full items-center justify-center rounded-lg border p-2 px-4 font-medium text-nowrap text-white"
                  >
                    Confirm Phone
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "Change Email" && (
            <div className="no-scrollbar relative min-h-screen w-full overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
              <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Change Email
                </h4>
                <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
                  Update your details to keep your profile up-to-date.
                </p>
              </div>

              {confirmEmail ? (
                <div className="px-2">
                  <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                    We have sent a verification code to your email{" "}
                    {profileDetails?.new_email}. Please check your inbox and
                    enter the code below to verify your email.
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
                              errorMessage ||
                              "Enter the 6-digit code sent to your email."
                            }
                            type="tel"
                            id="otp"
                            className="mt-2 w-full text-center tracking-wide"
                            name="otp"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9]/g,
                                "",
                              );
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
                              !profileDetails?.new_email.trim() ||
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
                            disabled={
                              isPending ||
                              sendingCode ||
                              !profileDetails?.new_email.trim() ||
                              !sentCode
                            }
                            className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium disabled:opacity-50"
                          >
                            {isPending ? "Resending..." : "Resend Code"}
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="custom-scrollbar overflow-y-auto px-2">
                  <div className="flex flex-col gap-4">
                    <div className="col-span-2 flex flex-col space-y-1 lg:col-span-1">
                      <Label className="mb-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        {"Email Address"}
                      </Label>
                      <div className="flex w-full items-center justify-between py-2">
                        <span className="text-black dark:text-white">
                          {profile?.email}
                        </span>
                        {profile?.verification_status?.email ? (
                          <span className="text-success-500 flex items-center gap-2">
                            {" "}
                            <TaskAltOutlinedIcon fontSize="small" /> Verified
                          </span>
                        ) : (
                          <span className="text-error-500 flex items-center gap-2">
                            <CancelOutlinedIcon fontSize="small" /> Not Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <EditableInput
                      error={!!errorMessage.includes("email")}
                      hint={
                        errorMessage.includes("email")
                          ? errorMessage
                          : undefined
                      }
                      placeholder="Enter Email e.g example@email.com"
                      type="email"
                      label="New Email Address"
                      value={profileDetails?.new_email}
                      onChange={(v) => handleInputChange("new_email", v)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage("");

                      if (!profileDetails?.new_email?.trim()) {
                        showToast(
                          "Please enter a valid email address!",
                          "error",
                        );
                        setErrorMessage(
                          "Please enter a email address to change to!",
                        );
                        return;
                      }
                      const oldEmail = profile.email?.trim();
                      const newEmail = profileDetails.new_email?.trim();
                      const isNewEmail = oldEmail !== newEmail;

                      if (isNewEmail) {
                        setConfirmEmail(true);
                        setErrorMessage("");
                      } else {
                        showToast(
                          "Please enter a different email address!",
                          "error",
                        );
                        setErrorMessage(
                          "Please enter a different email address!",
                        );
                      }
                    }}
                    className="bg-brand-500 border-brand-500 text-theme-sm hover:bg-brand-600 mt-3 flex w-full items-center justify-center rounded-lg border p-2 px-4 font-medium text-nowrap text-white"
                  >
                    Change Email
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "Manage Your Account" && (
            <div className="no-scrollbar relative min-h-screen w-full space-y-4 overflow-y-auto rounded-3xl bg-white p-5 dark:bg-gray-900">
              {/* Danger Zone Section */}

              <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Account Management
                </h4>
                <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
                  Manage your account state here. Delete, pause, unpause your
                  account
                </p>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 lg:p-5 dark:border-red-900/30 dark:bg-red-900/10">
                <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-400">
                  Delete Account
                </h3>

                <div className="space-y-4">
                  <p className="mb-3 text-sm text-gray-700 dark:text-gray-400">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <Button variant="danger-outline" size="sm">
                    Delete Account <TrashBinIcon />
                  </Button>
                </div>
              </div>
              {/* <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10 lg:p-5">
                <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-400">
                  Pause Account
                </h3>

                <div className="space-y-4">
                  <p className="mb-3 text-sm text-gray-700 dark:text-gray-400">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="danger-outline" size="sm">
                    Delete Account <TrashBinIcon />
                  </Button>
                </div>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function EditableInput({
  label,
  value,
  onChange,
  type = "text",
  disabled,
  placeholder,
  options,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: any;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  options?: any[];
  error?: any;
  hint?: any;
}) {
  return (
    <div className="col-span-2 flex flex-col space-y-1 lg:col-span-1">
      <Label className="mb-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        {label}
      </Label>
      {type === "select" ? (
        <Select
          value={value || ""}
          defaultValue={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e)}
          options={options || []}
        />
      ) : (
        <Input
          error={error}
          hint={hint}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-9"
        />
      )}
    </div>
  );
}
