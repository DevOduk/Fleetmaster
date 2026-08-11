"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useUser } from "@/context/UserContext";
import { ArrowRightIcon, ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";
import GoogleIcon from "@mui/icons-material/Google"

interface Tenant {
  tenant?: string;
}

export default function SignInForm({ tenant }: Tenant) {
  const router = useRouter();
  const { login, profile } = useUser();
  const { login: adminLogin, adminProfile } = useAdmin();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [host, setHost] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [verifyData, setVerifyData] = useState({ email: '', id: null });

  useEffect(() => {
    // This code only runs in the browser
    if (typeof window !== 'undefined') {
      setHost(window.location.host);
    }
  }, []);

  const handleSubmit = async () => {
    setIsLoggingIn(true);
    setErrorMessage('');

    if (!email || !password) {
      showToast("Email and password are required!", "warning");
      setIsLoggingIn(false);
      return;
    }

    const isClient = () => {
      if (tenant?.trim()) return true;
      return false;
    }


    const isTenantManager = () => {
      if (typeof window === 'undefined') return false;
      const host = window?.location?.host || '';
      const pathname = window?.location?.pathname || '';
      if (host.includes('dashboard.') || pathname.includes('/tenant-manager')) return true;
      return false;
    }

    const result = isTenantManager() ?
      await adminLogin(email, password) :
      await login(isClient() ? 'client' : 'admin', email, password, tenant)

    if (result.success) {
      setIsLoggingIn(false);
      showToast("Success! Login successful, redirecting in 5 seconds...", "success");

      setIsRedirecting(true);

      if (!isTenantManager() && isClient()) {
        // check if email is verified before redirecting to dashboard
        if (!result.emailVerified) {
          showToast("Please verify your email to access your account.", "warning");
          setIsRedirecting(false);
          setErrorMessage("Please verify your email to access your account.");

          setVerifyData({ email, id: result.id });
          return;
        }
      }

      const searchParams = new URLSearchParams(window.location.search);
      const encodedRef = searchParams.get('r');

      setTimeout(() => {
        if (encodedRef) {
          try {
            // Decode the URL-encoded path safely
            const originalUrl = decodeURIComponent(atob(encodedRef));
            router.push(originalUrl);
            return; // CRITICAL: Stop execution so it doesn't run the fallback below!
          } catch (err) {
            // console.error("Failed to parse redirect URL:", err);
          }
        }

        // Fallback only if no encodedRef was found or decoding failed
        router.replace("/");
      }, 5000);

    } else {
      showToast(result.error || "Invalid credentials", "error");
      setErrorMessage(result.error || "Invalid credentials");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            {
              (profile || adminProfile) && <Link href={'/'} className="text-brand-500 flex gap-2 items-center mb-2">
                <ArrowRightIcon className='r rotate-180' /> Signed in as {profile?.first_name || adminProfile?.first_name}
              </Link>
            }

            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:gap-5">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <GoogleIcon color="inherit" />
                Sign in with Google
              </button>
              {/* <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <GitHubIcon color="inherit" />
                Sign in with GitHub
              </button>
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <XIcon color="inherit" />
                Sign in with X
              </button> */}
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <form onSubmit={e => { e.preventDefault() }}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input error={!!errorMessage.includes("email")} hint={errorMessage.includes("email") ? errorMessage : undefined} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@gmail.com" type="email" />
                  {
                    errorMessage.includes("Please verify your email to access your account.") && <a href={`/verify-email?v=${btoa(JSON.stringify(verifyData))}`} className="mt-1 text-xs text-blue-500 underline">Verify Now</a>
                  }
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      error={!!errorMessage.includes("password")}
                      hint={errorMessage.includes("password") ? errorMessage : undefined}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button disabled={isLoggingIn || isRedirecting} className="w-full disabled:text-black" size="sm" onClick={handleSubmit}>
                    {isLoggingIn ? 'Signing In...' : isRedirecting ? 'Redirecting ...' : 'Sign in'}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                {
                  tenant ?
                    <Link
                      href="/signup"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Signup
                    </Link> :
                    <Link
                      title="_blank"
                      href="/register"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Register a new company!
                    </Link>
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
