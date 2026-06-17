import React, { useMemo, useState } from "react";
import Link from "next/link";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useUser } from "@/context/UserContext";

const VERIFICATION_STEPS = [
    { key: "email", message: "Please verify your email address.", link: "/account/verify-email" },
    { key: "phone", message: "Please verify your mobile phone number.", link: "/account/verify-phone" },
    { key: "kra_pin", message: "Please upload your National ID document.", link: "/account/verify-id" },
    { key: "national_id", message: "Please submit your KRA PIN tax documentation.", link: "/account/verify-kra" },
    { key: "driving_license", message: "Please provide a valid Driver's License image.", link: "/account/verify-dl" },
] as const;

export default function VerificationBanner({ profile }: { profile?: any }) {
    const [isDismissed, setIsDismissed] = useState(false);
    // Find the FIRST verification step that is currently false
    const activeWarningStep = useMemo(() => {
        if (!profile || profile.accountType !== "client" || !profile.verification_status) {
            return null;
        }

        const verificationState = profile.verification_status as Record<string, boolean>;

        // .find() loops in order and stops immediately at the first match
        return VERIFICATION_STEPS.find((step) => !verificationState[step.key]) || null;
    }, [profile]);

    // If everything is verified, user is logged out, or banner is dismissed, show nothing
    if (!activeWarningStep || isDismissed) return null;
console.log("Active verification warning step:", activeWarningStep.key);
    return (
        <div
            className="flex relative container m-auto items-center p-2 px-3 my-2 text-sm text-amber-900 dark:text-amber-400 shadow-sm rounded-lg bg-amber-600/30 dark:bg-amber-500/20"
            role="alert"
        >
            <svg className="inline w-4 h-4 me-3 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Warning</span>

            <div className="pr-6">
                <span className="font-medium">Finish setting up your Account!</span> {activeWarningStep.message}{" "}
                <Link href={activeWarningStep.link} className="text-amber-700 dark:text-amber-500 font-semibold hover:underline">
                    Verify Now
                </Link>
            </div>

            <span
                onClick={() => setIsDismissed(true)}
                className="absolute top-1/2 -translate-y-1/2 cursor-pointer right-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
            >
                <CloseOutlinedIcon style={{ width: 20 }} />
            </span>
        </div>
    );
}