"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Avatar, Backdrop, CircularProgress } from "@mui/material";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { PencilIcon, TrashBinIcon } from "@/icons";
import { useUser } from "@/context/UserContext";
import Select from "../form/Select";
import { updatePassword } from "@/app/actions/client";
import { useToast } from "@/context/ToastContext";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { resendPhoneOTP, sendPhoneVerification, verifyPhoneOTP } from "@/app/actions/verification/phone";
import { allCountriesDB, retryDuration } from "@/data/globalExports";
import { usePathname, useSearchParams } from "next/navigation";
import { formatToE164 } from "../auth/SignUpForm";
import Link from "next/link";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined"




export default function AccountSettings() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const [isSaving, setIsSaving] = useState(false);
  const [confirmPhone, setConfirmPhone] = useState(false);
  const { profile, setProfile, loading } = useUser();
  const { showToast } = useToast();
  const [profileDetails, setProfileDetails] = useState(null);
  const [activeTab, setActiveTab] = useState<string>(
    "Change Phone"
    // "Two-Factor Authentification"
    // "Change Password"
    // "Change Email"
    // "Manage Your Account"
  );
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [sentCode, setSentCode] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState(0); // shorter for sms
  const [errorMessage, setErrorMessage] = useState('');
  const isNewEmail = profile?.email !== profileDetails?.email;
  const isAdmin = profile?.role !== 'Client';



  const clauses: any[] = [
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
    setIsSaving(true)
    const res = await updatePassword(profile?.id, profileDetails);

    if (res.success) {
      showToast('Your password was changed successfully! You will be logged out in all devices.', 'success');
      setProfile(res.data);
    }
    setIsSaving(false)
  }

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
    setErrorMessage('');

    const res = await verifyPhoneOTP(btoa(JSON.stringify({ phone: profileDetails?.new_phone, id: profile?.id, otp })), isAdmin && 'admin');

    if (res.success) {
      showToast(`Your phone number ${profileDetails?.new_phone} has been verified successfully!`, "success");

      setIsLoading(false);
      setProfile((prev) => ({
        ...prev,
        verification_status: ({
          ...prev.verification_status,
          phone: true
        }),
        phone: profileDetails?.new_phone
      }));

      setConfirmPhone(false)
    } else {
      showToast(`${res.error?.message || 'Failed to verify OTP'}`, "error");
      setErrorMessage(`${res.error?.message || 'Failed to verify OTP'}`);
      setIsLoading(false);

      if (res.error.message.includes('phone number is already registered')) {
        setConfirmPhone(false)
      }
    }
  };

  const handleSendCode = async () => {
    setSendingCode(true);
    setSentCode(true);
    setErrorMessage('');

    if (cooldown > 0 || !profileDetails?.new_phone) return;

    const res = await sendPhoneVerification(profile?.id, profileDetails?.new_phone, isAdmin && 'admin');

    if (res.success) {
      showToast(`A verification code has been sent to ${profileDetails?.new_phone}.`, "success");
      setCooldown(retryDuration);
    } else {
      showToast(`${res.error?.message || 'Failed to send code'}`, "error");
      setErrorMessage(`${res.error?.message || 'Failed to send code'}`);
      setSentCode(false);
    }

    setSendingCode(false);
  }

  const handleResendCode = () => {
    setSendingCode(true);
    setErrorMessage('');
    if (cooldown > 0 || !profileDetails?.new_phone) return;

    startTransition(async () => {
      const res = await resendPhoneOTP(profile?.id, btoa(profileDetails?.new_phone), isAdmin && 'admin');

      if (res.success) {
        showToast("A new verification code has been sent.", "success");
        setCooldown(retryDuration);
        setErrorMessage('');
      } else {
        showToast(`${res.error?.message || 'Failed to send code'}`, "error");
        setErrorMessage(`${res.error?.message || 'Failed to send code'}`);
      }

      setSendingCode(false);
    });
  };


  // Rebuild the accurate current page URL dynamically
  const currentPageUrl = encodeURIComponent(
    searchString ? btoa(`${pathname}?${searchString}`) : btoa(pathname)
  );

  if (loading) {
    return <div className="container min-h-[80vh] max-w-6xl mx-auto p-5 text-gray-400">Loading profile ...</div>
  } else if (!loading && !profile) {
    window.location.href = `/signin?r=${currentPageUrl}`;
    return <div className="container min-h-[80vh] max-w-6xl mx-auto p-5 text-gray-400">Redirecting to signin ...</div>
  }

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isSaving}
        onClick={() => null}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 space-y-5">
        {/* left side menu  */}
        <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-6 h-fit space-y-2">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-3">
              Settings
            </p>
            <nav className="space-y-1">
              {clauses.map((clause, i) => {
                const isActive = activeTab === clause.title;
                return (
                  <button
                    key={clause.title}
                    onClick={() => setActiveTab(clause.title)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs font-semibold transition-all ${isActive
                      ? "bg-green-800 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* <Icon className={`w-4! h-4! ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} /> */}
                      <span>{i + 1}. {clause.title}</span>
                    </div>
                    <ChevronRightIcon className="w-4! h-4! opacity-70" />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        {/* right side main content  */}
        <div className=" col-span-12 lg:col-span-8">

          {/* Security Section */}
          {activeTab === 'Two-Factor Authentification' &&
            <div className="relative w-full p-5 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 min-h-screen">
              <div className="space-y-4 lg:space-y-5">
                <div className="px-2 pr-14">
                  <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Two-Factor Authentification
                  </h4>
                  <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className={`w-full flex gap-2 flex-col p-3 rounded-xl text-left font-semibold transition-all text-slate-600 dark:text-slate-400`}>
                  {[
                    {
                      title: 'Email',
                      value: profile?.email
                    },
                    {
                      title: 'Phone',
                      value: profile?.phone
                    },
                    {
                      title: 'Google',
                      value: profile?.email
                    },
                    {
                      title: 'Third Party Authenticator',
                      value: 'Authenticator App'
                    },
                  ].map((a, i) => (
                    <div className="flex gap-2 rounded-lg p-2 mb-3 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/50">
                      {i + 1}.
                      <div>
                        <div className="text-sm">{a.title}</div>
                        <span className="text-xs text-slate-500">{a.value}</span>
                      </div>
                    </div>
                  ))}
                  <div>Phone</div>
                </div>

                <div className="p-3 rounded-xl mt-3 border border-green-500/50 w-full">
                  <p className="text-muted mb-3 text-gray-400 text-sm text-center p-4">No 2FA Added.</p>
                  <Button endIcon={<PencilIcon />} variant="success" size="sm">
                    Add 2FA
                  </Button>
                </div>
              </div>
            </div>
          }

          {activeTab === 'Change Password' &&
            <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11 min-h-screen">
              <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Change Password
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                  Update your details to keep your profile up-to-date.
                </p>
              </div>
              <form className="flex flex-col" onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();

                handlePasswordChange()
              }}>
                <div className="px-2 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <EditableInput placeholder="Enter old password" type="password" label="Old Password" value={profileDetails?.old_password} onChange={(v) => handleInputChange("old_password", v)} />
                    <EditableInput placeholder="Enter password" type="password" label="New Password" value={profileDetails?.password} onChange={(v) => handleInputChange("password", v)} />
                    <EditableInput placeholder="Confirm password" type="password" label="Confirm Password" value={profileDetails?.confirm_password} onChange={(v) => handleInputChange("confirm_password", v)} />
                  </div>
                </div>
              </form>

            </div>
          }

          {activeTab === 'Change Phone' &&
            <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11 min-h-screen">
              <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Change Phone
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                  Update your details to keep your profile up-to-date.
                </p>
              </div>

              {
                confirmPhone ? (
                  <div className="px-2">
                    <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                      We have sent a verification code to your mobile phone {(formatToE164(profileDetails?.new_phone, allCountriesDB.find(c => c.country === profile.country).code)).slice(0, 5)}*******{(formatToE164(profileDetails?.new_phone, allCountriesDB.find(c => c.country === profile.country).code)).slice(-3)}. Please check your inbox and enter the code below to verify your email.
                    </p>
                    {/* phone verification otp block  */}
                    <div>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (sentCode) {
                          handleVerifyOTP();
                        } else {
                          handleSendCode()
                        }
                      }}>
                        <div className="space-y-5">
                          {/* <!-- Enter OTP --> */}
                          <div className="w-full">
                            <Label>
                              Enter OTP<span className="text-error-500">*</span>
                            </Label>
                            <Input
                              error={!!errorMessage}
                              hint={errorMessage || "Enter the 6-digit code sent to your phone."}
                              type="tel"
                              id="otp"
                              className="mt-2 text-center w-full tracking-wide"
                              name="otp"
                              maxLength={6}
                              value={otp}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
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
                              className="px-4! py-3! w-full text-sm"
                            >
                              {!sentCode ? 'Send OTP' : isLoading ? "Verifying..." : sendingCode ? "Sending Code..." : "Verify OTP"}
                            </Button>
                          </div>
                        </div>
                      </form>

                      <div className="mt-5">
                        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                          Did not receive code? &nbsp;
                          {cooldown > 0 ? (
                            <span className="text-gray-400 dark:text-gray-500">
                              Resend in {cooldown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendCode}
                              disabled={isPending || sendingCode || !profileDetails?.new_phone.trim() || !sentCode}
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
                  <div className="px-2 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-4">

                      <div className="col-span-2 lg:col-span-1 space-y-1 flex flex-col">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{"Phone Number"}</Label>
                        <div className="w-full flex justify-between items-center py-2">
                          <span className="text-black dark:text-white">{profile?.phone}</span>
                          {profile?.verification_status?.phone ? <span className="text-success-500 flex gap-2 items-center"> <TaskAltOutlinedIcon fontSize="small" /> Verified</span> : <span className="text-error-500 flex gap-2 items-center"><CancelOutlinedIcon fontSize="small" /> Not Verified</span>}
                        </div >
                      </div >

                      <EditableInput error={!!errorMessage.includes("phone")} hint={errorMessage.includes("phone") ? errorMessage : undefined} placeholder="Enter Phone e.g +1234 5678 9012" type="tel" label="New Phone Number" value={profileDetails?.new_phone} onChange={(v) => handleInputChange("new_phone", v)} />
                    </div>
                    <button
                      type="button"
                      onClick={() => {

                        if (!profileDetails?.new_phone.trim()) {
                          showToast('Please enter a valid phone number!', 'error');
                          setErrorMessage('Please enter a phone number to change to!');
                          return;
                        }
                        const oldE164Phone = formatToE164(profile?.phone, allCountriesDB.find(c => c.country === profile.country).code);
                        const e164Phone = formatToE164(profileDetails?.new_phone, allCountriesDB.find(c => c.country === profile.country).code);
                        const isNewPhone = (oldE164Phone !== e164Phone);

                        if (e164Phone === null) {
                          showToast('Please enter a valid phone number!', 'error');
                          setErrorMessage('Please enter a valid phone number!');
                          return;
                        }

                        if (isNewPhone) {
                          setConfirmPhone(true);
                          setErrorMessage('')
                        } else {
                          showToast('Please enter a different phone number!', 'error')
                          setErrorMessage('Please enter a different phone number!')
                        }
                      }}
                      className="flex mt-3 w-full text-nowrap items-center justify-center p-2 px-4 font-medium text-white rounded-lg bg-brand-500 border border-brand-500 text-theme-sm hover:bg-brand-600"
                    >
                      Confirm Phone
                    </button>
                  </div>
                )
              }


            </div>
          }

          {activeTab === 'Change Email' &&
            <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11 min-h-screen">
              <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Change Password
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                  Update your details to keep your profile up-to-date.
                </p>
              </div>

              <div className="px-2 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <EditableInput placeholder="Enter old password" type="password" label="Old Password" value={profileDetails?.old_password} onChange={(v) => handleInputChange("old_password", v)} />
                  <EditableInput placeholder="Enter password" type="password" label="New Password" value={profileDetails?.password} onChange={(v) => handleInputChange("password", v)} />
                  <EditableInput placeholder="Confirm password" type="password" label="Confirm Password" value={profileDetails?.confirm_password} onChange={(v) => handleInputChange("confirm_password", v)} />
                </div>
              </div>

            </div>
          }

          {activeTab === 'Manage Your Account' &&
            <div className="relative w-full p-5 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 space-y-4 min-h-screen">
              {/* Danger Zone Section */}

              <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Account Management
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                  Manage your account state here. Delete, pause, unpause your account
                </p>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10 lg:p-5">
                <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-400">
                  Delete Account
                </h3>

                <div className="space-y-4">
                  <p className="mb-3 text-sm text-gray-700 dark:text-gray-400">
                    Permanently delete your account and all associated data. This action cannot be undone.
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
          }
        </div>

      </div>
    </>
  );
}


export function EditableInput({ label, value, onChange, type = "text", disabled, placeholder, options, error, hint }: { label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean; placeholder?: string; options?: any[]; error?: any; hint?: any; }) {
  return (
    <div className="col-span-2 lg:col-span-1 space-y-1 flex flex-col">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{label}</Label>
      {
        type === "select" ?
          <Select value={value || ""} defaultValue={value || ""} placeholder={placeholder} onChange={(e) => onChange(e)} options={(options || [])} />
          :
          <Input error={error} hint={hint} placeholder={placeholder} disabled={disabled} type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="h-9" />
      }
    </div >
  );
}