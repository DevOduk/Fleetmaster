"use server";

import { createClient } from "@/utils/supabase/server";
import crypto from "crypto";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { retryDuration } from "@/data/globalExports";
import AfricasTalking from "africastalking";

// Initialize Africa's Talking SDK
const at = AfricasTalking({
    apiKey: process.env.AT_API_KEY!,
    username: process.env.AT_USERNAME || "sandbox",
});

const sms = at.SMS;


// 1. Initialize Upstash Redis Client with explicit env vars
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const otpValidityMinutes = retryDuration / 60;

// Rate Limit: Max 3 OTP requests per 10 minutes per IP/phone
const otpRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, `1 m`),
    analytics: true,
    prefix: "@upstash/ratelimit:phone-otp",
});

// Helper function to encode phone for URL/Client obfuscation
export async function encodePhone(phone: string): Promise<string> {
    return Buffer.from(phone).toString("base64");
}

// Helper function to decode phone on the server
export async function decodePhone(encodedPhone: string): Promise<string> {
    return Buffer.from(encodedPhone, "base64").toString("ascii");
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
 * Internal Helper: Enforce rate limits by combining IP and Phone
 */
async function checkRateLimit(identifier: string) {
    const ip = await getClientIp();
    const key = `${ip}:${identifier.replace(/\s+/g, "")}`;
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

async function sendOTPSMS(phone: string, otp: string) {
    const options = {
        to: [phone], // Must be in E.164 format, e.g., +254768927617
        message: `Your FleetMaster verification code is: ${otp}. Valid for ${otpValidityMinutes} minutes.`,
        // senderId: "FleetMaster"
    };

    try {
        const response = await sms.send(options);

        // Africa's Talking returns an array of recipients with their statuses
        const recipient = response.SMSMessageData?.Recipients?.[0];

        if (!recipient || recipient.statusCode !== 101) { // 101 usually means Success/Processed
            throw new Error(recipient?.status || "Failed to dispatch SMS via Africa's Talking.");
        }

        return { success: true, data: response };
    } catch (error: any) {
        console.error("Africa's Talking SMS error:", error);
        throw new Error(error.message || "SMS delivery failed.");
    }
}

/**
 * Sends initial phone verification OTP for an existing record
 */
export async function sendPhoneVerification(userId: string, userPhone: string, role?: string) {
    const tableSource = role === 'admin' ? 'fleetmaster_admins' : 'fleetmaster_clients';

    // using my own number to simulate sending to a different number eevrything else stays the same as if it were the actual number 
    const mobilePhone = (
        // userPhone 
        '+254768927617'
    );

    try {
        if (!mobilePhone || !userId) {
            return { success: false, error: { message: "Invalid user details." } };
        }

        // 1. Enforce Rate Limit
        const rateCheck = await checkRateLimit(userPhone);
        if (rateCheck.limited) {
            return { success: false, error: { message: rateCheck.error } };
        }

        const supabase = await createClient();
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiresAt = new Date(Date.now() + otpValidityMinutes * 60 * 1000).toISOString();

        // 2. Cache OTP in Redis
        const redisKey = `otp:phone:${userPhone.replace(/\s+/g, "")}`;
        await redis.set(redisKey, JSON.stringify({ otp, userId, expiresAt: otpExpiresAt }), {
            ex: otpValidityMinutes * 60,
        });

        // 3. Update Supabase record (Assumes columns like phone_otp_code / phone_otp_expires_at or adjust column names)
        const { data, error } = await supabase
            .from(tableSource)
            .update({
                phone_otp_code: otp,
                phone_otp_expires_at: otpExpiresAt,
            })
            .eq("id", userId)
            .select("*")
            .single();

        if (error) {
            console.error("Supabase update error:", error);
            return { success: false, error: { message: "Failed to set phone verification code.", error } };
        }

        // 4. Send SMS via Africa's Talking 
        try {
            await sendOTPSMS(mobilePhone, otp);
        } catch (smsErr: any) {
            console.error("Africa's Talking  delivery error:", smsErr);
            return {
                data,
                success: false,
                error: { message: `Verification SMS failed to send: ${smsErr.message}` },
            };
        }

        const encodedPhone = await encodePhone(userPhone);

        return {
            success: true,
            encodedPhone,
            message: "Verification SMS sent successfully.",
        };
    } catch (err: any) {
        return {
            success: false,
            error: { message: err.message || "A system connection error occurred." },
        };
    }
}

/**
 * Resends the phone verification OTP when requested by user
 */
export async function resendPhoneOTP(userId: string, encodedPhone: string, role?: string) {
    const userPhone = await decodePhone(encodedPhone);
    if (!userPhone) {
        return { success: false, error: { message: "Invalid verification token." } };
    }
    const mobilePhone = (
        // userPhone 
        '+254768927617'
    );
    try {

        // 1. Enforce Rate Limit
        const rateCheck = await checkRateLimit(userPhone);
        if (rateCheck.limited) {
            return { success: false, error: { message: rateCheck.error } };
        }

        const supabase = await createClient();
        const tableSource = role === 'admin' ? 'fleetmaster_admins' : 'fleetmaster_clients';

        // Check if user exists
        const { data: user, error: userError } = await supabase
            .from(tableSource)
            .select("id, phone")
            .eq("id", userId)
            .single();

        if (userError || !user) {
            return { success: false, error: { message: "Account not found." } };
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiresAt = new Date(Date.now() + otpValidityMinutes * 60 * 1000).toISOString();

        // 2. Cache new OTP in Redis
        const redisKey = `otp:phone:${userPhone.replace(/\s+/g, "")}`;
        await redis.set(redisKey, JSON.stringify({ otp, userId: user.id, expiresAt: otpExpiresAt }), {
            ex: otpValidityMinutes * 60,
        });

        // 3. Update Supabase record
        const { error: updateError } = await supabase
            .from(tableSource)
            .update({
                phone_otp_code: otp,
                phone_otp_expires_at: otpExpiresAt,
            })
            .eq("id", user.id);

        if (updateError) {
            return { success: false, error: { message: "Failed to generate new OTP." } };
        }

        // 4. Send SMS
        try {
            await sendOTPSMS(mobilePhone, otp);
        } catch (smsErr: any) {
            return { success: false, error: { message: smsErr.message || "Failed to resend SMS code." } };
        }

        return { success: true, message: "A new code has been sent to your phone." };
    } catch (err: any) {
        return {
            success: false,
            error: { message: err.message || "Failed to resend code." },
        };
    }
}

/**
 * Verifies the user's phone OTP code against Redis / DB
 */

export async function verifyPhoneOTP(encodedPayload: string, role?: string) {
    try {
        const supabase = await createClient();
        const { phone, id, otp } = JSON.parse(atob(encodedPayload));
        const userPhone = phone;
        if (!userPhone) {
            return { success: false, error: { message: "Invalid verification token." } };
        }

        // 1. Check Redis Cache First
        const redisKey = `otp:phone:${userPhone.replace(/\s+/g, "")}`;
        const cachedOtpData: { otp: string; userId: string; expiresAt: string } | null = await redis.get(redisKey);

        let userOtpCode: string | null = null;
        let userOtpExpiresAt: string | null = null;
        let user: any = null;
        const tableSource = role === 'admin' ? 'fleetmaster_admins' : 'fleetmaster_clients';
        const normalizedRole = role === 'admin' ? 'admin' : 'client';

        if (cachedOtpData) {
            userOtpCode = cachedOtpData.otp;
            userOtpExpiresAt = cachedOtpData.expiresAt;
        } else {
            // 2. Cache miss: Fall back to Supabase DB
            const { data: dbUser, error } = await supabase
                .from(tableSource)
                .select(`id, first_name, phone, phone_otp_code, phone_otp_expires_at, verification_status, fleetmaster_tenants(slug, name)`)
                .eq("id", id)
                .single();

            if (error || !dbUser) {
                return { success: false, error: { error, message: "Invalid phone number or account does not exist." } };
            }

            user = dbUser;
            userOtpCode = dbUser.phone_otp_code;
            userOtpExpiresAt = dbUser.phone_otp_expires_at;
        }

        if (!userOtpCode || userOtpCode !== otp) {
            return { success: false, error: { message: "Invalid verification code." } };
        }

        if (userOtpExpiresAt && new Date(userOtpExpiresAt) < new Date()) {
            return { success: false, error: { message: "Verification code has expired. Please request a new one." } };
        }

        // Fetch user full profile if executed from cached branch
        if (!user) {
            const { data: dbUser, error } = await supabase
                .from(tableSource)
                .select("id, first_name, phone, verification_status, fleetmaster_tenants(slug, name)")
                .eq("id", id)
                .single();

            if (error || !dbUser) {
                return { success: false, error: { error, message: "Account verification failed." } };
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

        const isFirstTimeVerification = !currentStatus.phone;

        const updatedVerificationStatus = {
            ...currentStatus,
            phone: true,
        };

        // Mark phone verified and clear codes, add new phone that has just been successfully verified together
        const { error: updateError } = await supabase
            .from(tableSource)
            .update({
                verification_status: updatedVerificationStatus,
                phone_otp_code: null,
                phone_otp_expires_at: null,
                phone: userPhone,
            })
            .eq("id", user.id);

        if (updateError) {
            console.error("Supabase update error:", updateError);

            // Gracefully handle PostgreSQL Unique Violation (23505)
            if (updateError.code === "23505") {
                return {
                    success: false,
                    error: { message: "This phone number is already registered to another account." }
                };
            }

            return {
                success: false,
                error: { message: updateError.message || "Failed to complete phone verification." }
            };
        }

        // 3. Clear OTP Redis key & INVALDIATE PROFILE CACHE
        const profileCacheKey = `user:profile:${user.id}:${normalizedRole}`;
        await Promise.all([
            redis.del(redisKey),
            redis.del(profileCacheKey),
        ]).catch((e) => console.error("Redis cache cleanup failure:", e));

        // 5. Send internal notification
        if (!isFirstTimeVerification) {
            const { error: notifError } = await supabase
                .from("fleetmaster_notifications")
                .insert({
                    user_id: user.id,
                    category: 'System',
                    title: 'Phone Change!',
                    notification: `Hello${user.first_name && ' ' + user.first_name}. Your phone was changed successfully on ${(new Date()).toLocaleString()}! If you did not initialise the change contact support now.\nAustine O. - CEO`,
                    seen: false
                });

            if (notifError) {
                console.error("Internal notification insert error:", notifError);
            }
        }

        return {
            success: true,
            isFirstTimeVerification,
            message: isFirstTimeVerification
                ? "Your phone number has been verified successfully!"
                : "Your phone number has been updated and re-verified successfully.",
        };
    } catch (err: any) {
        return {
            success: false,
            error: { err, message: err.message || "An error occurred during phone verification." },
        };
    }
}