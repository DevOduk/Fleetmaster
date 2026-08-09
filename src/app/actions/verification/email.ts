"use server";

import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";
import crypto from "crypto";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Initialize Upstash Redis Client with explicit env vars
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const OTP_VALIDITY_MINUTES = 5;

// Rate Limit: Max 3 OTP requests per 10 minutes per IP/email
const otpRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "10 m"),
    analytics: true,
    prefix: "@upstash/ratelimit:otp",
});

// Helper function to encode email for URL/Client obfuscation
export async function encodeEmail(email: string): Promise<string> {
    return Buffer.from(email).toString("base64");
}

// Helper function to decode email on the server
export async function decodeEmail(encodedEmail: string): Promise<string> {
    return Buffer.from(encodedEmail, "base64").toString("ascii");
}

/**
 * Internal Helper: Get client IP address for server actions
 */
async function getClientIp(): Promise<string> {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }
    return headerList.get("x-real-ip") || "127.0.0.1";
}

/**
 * Internal Helper: Enforce rate limits by combining IP and Email
 */
async function checkRateLimit(identifier: string) {
    const ip = await getClientIp();
    const key = `${ip}:${identifier.toLowerCase()}`;
    const { success, reset } = await otpRateLimiter.limit(key);

    if (!success) {
        const secondsRemaining = Math.ceil((reset - Date.now()) / 1000);
        return {
            limited: true,
            error: `Too many requests. Please wait ${secondsRemaining} seconds before trying again.`,
        };
    }
    return { limited: false };
}

// Internal Helper to send OTP email via Resend
async function sendOTPEmail(email: string, otp: string) {
    return await resend.emails.send({
        from: "FleetMaster <onboarding@resend.dev>", // Update with your custom verified domain
        to: email,
        subject: `${otp} is your verification code`,
        html: `
      <div style="font-family: sans-serif; padding: 24px; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Verify your identity</h2>
        <p style="color: #334155; font-size: 16px; line-height: 24px;">
          Use the following security code to complete your verification request. This code is active for ${OTP_VALIDITY_MINUTES} minutes.
        </p>
        <div style="background-color: #f1f5f9; padding: 14px; text-align: center; border-radius: 6px; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #0f172a;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 12px;">If you did not request this verification code, please ignore this email.</p>
      </div>
    `,
    });
}

/**
 * Sends initial verification email for an existing record
 */
export async function sendEmailVerification(userId: string, userEmail: string) {
    try {
        if (!userEmail || !userId) {
            return { success: false, error: { message: "Invalid user details." } };
        }

        // 1. Enforce Rate Limit
        const rateCheck = await checkRateLimit(userEmail);
        if (rateCheck.limited) {
            return { success: false, error: { message: rateCheck.error } };
        }

        const supabase = await createClient();
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiresAt = new Date(Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000).toISOString();

        // 2. Cache OTP in Redis (5-minute TTL)
        const redisKey = `otp:${userEmail.toLowerCase()}`;
        await redis.set(redisKey, JSON.stringify({ otp, userId, expiresAt: otpExpiresAt }), {
            ex: OTP_VALIDITY_MINUTES * 60,
        });

        // 3. Update Supabase record
        const { data, error } = await supabase
            .from("fleetmaster_clients")
            .update({
                otp_code: otp,
                otp_expires_at: otpExpiresAt,
            })
            .eq("id", userId)
            .select("*")
            .single();

        if (error) {
            console.error("Supabase update error:", error);
            return { success: false, error: { message: "Failed to set verification code." } };
        }

        // 4. Send Email via Resend
        const { error: mailError } = await sendOTPEmail(userEmail, otp);

        if (mailError) {
            console.error("Resend delivery error:", mailError);
            return {
                data,
                success: false,
                error: { message: `Verification email failed to send: ${mailError.message}` },
            };
        }

        const encodedEmail = await encodeEmail(userEmail);

        return {
            success: true,
            encodedEmail,
            message: "Verification email sent successfully.",
        };
    } catch (err: any) {
        console.error("Send verification failure:", err);
        return {
            success: false,
            error: { message: err.message || "A system connection error occurred." },
        };
    }
}

/**
 * Resends the verification OTP when requested by user
 */
export async function resendOTP(encodedEmail: string) {
    try {
        const userEmail = await decodeEmail(encodedEmail);
        if (!userEmail) {
            return { success: false, error: { message: "Invalid verification token." } };
        }

        // 1. Enforce Rate Limit
        const rateCheck = await checkRateLimit(userEmail);
        if (rateCheck.limited) {
            return { success: false, error: { message: rateCheck.error } };
        }

        const supabase = await createClient();

        // Check if user exists
        const { data: user, error: userError } = await supabase
            .from("fleetmaster_clients")
            .select("id, email")
            .eq("email", userEmail)
            .single();

        if (userError || !user) {
            return { success: false, error: { message: "Account not found." } };
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiresAt = new Date(Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000).toISOString();

        // 2. Cache new OTP in Redis (5-minute TTL)
        const redisKey = `otp:${userEmail.toLowerCase()}`;
        await redis.set(redisKey, JSON.stringify({ otp, userId: user.id, expiresAt: otpExpiresAt }), {
            ex: OTP_VALIDITY_MINUTES * 60,
        });

        // 3. Update Supabase record
        const { error: updateError } = await supabase
            .from("fleetmaster_clients")
            .update({
                otp_code: otp,
                otp_expires_at: otpExpiresAt,
            })
            .eq("id", user.id);

        if (updateError) {
            return { success: false, error: { message: "Failed to generate new OTP." } };
        }

        // 4. Send Email
        const { error: mailError } = await sendOTPEmail(userEmail, otp);

        if (mailError) {
            return { success: false, error: { message: "Failed to resend email code." } };
        }

        return { success: true, message: "A new code has been sent to your email." };
    } catch (err: any) {
        return {
            success: false,
            error: { message: err.message || "Failed to resend code." },
        };
    }
}

/**
 * Verifies the user's OTP code against Redis / DB
 */
export async function verifyOTP(encodedEmail: string) {
    try {
        const supabase = await createClient();
        const { email, id, otp } = JSON.parse(atob(encodedEmail));
        const userEmail = email;

        // 1. Check Redis Cache First
        const redisKey = `otp:${userEmail.toLowerCase()}`;
        const cachedOtpData: { otp: string; userId: string; expiresAt: string } | null = await redis.get(redisKey);

        let userOtpCode: string | null = null;
        let userOtpExpiresAt: string | null = null;
        let user: any = null;

        if (cachedOtpData) {
            userOtpCode = cachedOtpData.otp;
            userOtpExpiresAt = cachedOtpData.expiresAt;
        } else {
            // 2. Cache miss: Fall back to Supabase DB
            const { data: dbUser, error } = await supabase
                .from("fleetmaster_clients")
                .select("id, otp_code, otp_expires_at, verification_status")
                .eq("email", userEmail)
                .eq("id", id)
                .single();

            if (error || !dbUser) {
                return { success: false, error: { message: "Invalid email or account does not exist." } };
            }

            user = dbUser;
            userOtpCode = dbUser.otp_code;
            userOtpExpiresAt = dbUser.otp_expires_at;
        }

        if (!userOtpCode || userOtpCode !== otp) {
            return { success: false, error: { message: "Invalid verification code." } };
        }

        if (userOtpExpiresAt && new Date(userOtpExpiresAt) < new Date()) {
            return { success: false, error: { message: "Verification code has expired. Please request a new one." } };
        }

        // Fetch user status if cached branch was executed
        if (!user) {
            const { data: dbUser, error } = await supabase
                .from("fleetmaster_clients")
                .select("id, verification_status")
                .eq("email", userEmail)
                .eq("id", id)
                .single();

            if (error || !dbUser) {
                return { success: false, error: { message: "Account verification failed." } };
            }
            user = dbUser;
        }

        const currentStatus = user.verification_status || {
            email: false,
            phone: false,
            kra_pin: false,
            national_id: false,
            driving_license: false,
        };

        const updatedVerificationStatus = {
            ...currentStatus,
            email: true,
        };

        // Mark user verified and clear code
        const { error: updateError } = await supabase
            .from("fleetmaster_clients")
            .update({
                verification_status: updatedVerificationStatus,
                otp_code: null,
                otp_expires_at: null,
            })
            .eq("id", user.id);

        if (updateError) {
            return { success: false, error: { message: "Failed to complete verification." } };
        }

        // 3. Clear Redis key after successful verification
        await redis.del(redisKey);

        return { success: true, message: "Your Email has been verified successfully." };
    } catch (err: any) {
        return {
            success: false,
            error: { message: err.message || "An error occurred during verification." },
        };
    }
}