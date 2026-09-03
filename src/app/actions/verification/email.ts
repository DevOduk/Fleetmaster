"use server";

import { createClient } from "@/utils/supabase/server";
import crypto from "crypto";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { Resend } from "resend";
import { triggerPostVerificationNotification } from "@/utils/notifications/verification-notification";
import { VerifyEmailNotification } from "@/utils/templates/email-templates";
import { retryDuration } from "@/data/globalExports";

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Initialize Upstash Redis Client with explicit env vars
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const otpValidityMinutes = retryDuration / 60;

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
    html: VerifyEmailNotification(otp, otpValidityMinutes),
  });
}

/**
 * Sends initial verification email for an existing record
 */
export async function sendEmailVerification(
  userId: string,
  userEmail: string,
  role?: string,
) {
  const tableSource =
    role === "admin" ? "fleetmaster_admins" : "fleetmaster_clients";

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
    const otpExpiresAt = new Date(
      Date.now() + otpValidityMinutes * 60 * 1000,
    ).toISOString();

    // 2. Cache OTP in Redis (5-minute TTL)
    const redisKey = `otp:${userEmail.toLowerCase()}`;
    await redis.set(
      redisKey,
      JSON.stringify({ otp, userId, expiresAt: otpExpiresAt }),
      {
        ex: otpValidityMinutes * 60,
      },
    );

    // 3. Update Supabase record
    const { data, error } = await supabase
      .from(tableSource)
      .update({
        otp_code: otp,
        otp_expires_at: otpExpiresAt,
      })
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return {
        success: false,
        error: { message: "Failed to set verification code." },
      };
    }

    // 4. Send Email via Resend
    const { error: mailError } = await sendOTPEmail(
      // using my email here for testing purposes
      // userEmail
      "austine.oduk@gmail.com",
      otp,
    );

    if (mailError) {
      console.error("Resend delivery error:", mailError);
      return {
        data,
        success: false,
        error: {
          message: `Verification email failed to send: ${mailError.message}`,
        },
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
export async function resendOTP(encodedEmail: string, role?: string, tenant?: string | null) {
  try {
    const userEmail = await decodeEmail(encodedEmail);
    if (!userEmail) {
      return {
        success: false,
        error: { message: "Invalid verification token." },
      };
    }

    // 1. Enforce Rate Limit
    const rateCheck = await checkRateLimit(userEmail);
    if (rateCheck.limited) {
      return { success: false, error: { message: rateCheck.error } };
    }

    const supabase = await createClient();
    const tableSource =
      role.toLowerCase() === "client" ? "fleetmaster_clients" : "fleetmaster_admins";

    // Check if user exists
    let userQuery = supabase
      .from(tableSource)
      .select("id, email, fleetmaster_tenants!inner(*)")
      .eq("email", userEmail);

    if (role?.toLowerCase() === "client" && tenant) {
      userQuery = userQuery.eq("fleetmaster_tenants.slug", tenant);
    }

    if (role?.toLowerCase() === "client" && !tenant) {
      throw new Error("Tenant is required for client verification.");
    }

    const { data: user, error: userError } = await userQuery.single();

    if (userError || !user) {
      return {
        success: false,
        error: {
          message: userError.message || "Account not found for this address!",
        },
      };
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(
      Date.now() + otpValidityMinutes * 60 * 1000,
    ).toISOString();

    // 2. Cache new OTP in Redis (5-minute TTL)
    const redisKey = `otp:${userEmail.toLowerCase()}`;
    await redis.set(
      redisKey,
      JSON.stringify({ otp, userId: user.id, expiresAt: otpExpiresAt }),
      {
        ex: otpValidityMinutes * 60,
      },
    );

    // 3. Update Supabase record
    const { error: updateError } = await supabase
      .from(tableSource)
      .update({
        otp_code: otp,
        otp_expires_at: otpExpiresAt,
      })
      .eq("id", user.id);

    if (updateError) {
      return {
        success: false,
        error: { message: "Failed to generate new OTP." },
      };
    }

    // 4. Send Email
    const { error: mailError } = await sendOTPEmail(
      // using my email here for testing purposes
      // userEmail
      "austine.oduk@gmail.com",
      otp,
    );

    if (mailError) {
      return {
        success: false,
        error: { message: mailError.message || "Failed to resend email code." },
      };
    }

    return {
      success: true,
      message: "A new code has been sent to your email.",
    };
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
export async function verifyOTP(encodedEmail: string, role?: string) {
  try {
    const supabase = await createClient();
    const { email, id, otp } = JSON.parse(atob(encodedEmail));
    const userEmail = email;

    // 1. Check Redis Cache First
    const redisKey = `otp:${userEmail.toLowerCase()}`;
    const cachedOtpData: {
      otp: string;
      userId: string;
      expiresAt: string;
    } | null = await redis.get(redisKey);

    let userOtpCode: string | null = null;
    let userOtpExpiresAt: string | null = null;
    let user: any = null;
    const tableSource =
      role === "admin" ? "fleetmaster_admins" : "fleetmaster_clients";
    const normalizedRole = role === "admin" ? "admin" : "client";

    if (cachedOtpData) {
      userOtpCode = cachedOtpData.otp;
      userOtpExpiresAt = cachedOtpData.expiresAt;
    } else {
      // 2. Cache miss: Fall back to Supabase DB
      const { data: dbUser, error } = await supabase
        .from(tableSource)
        .select(
          `id, first_name, email, otp_code, otp_expires_at, verification_status, fleetmaster_tenants(slug, name)`,
        )
        .eq("email", userEmail)
        .eq("id", id)
        .single();

      if (error || !dbUser) {
        return {
          success: false,
          error: {
            message:
              error.message || "Invalid email or account does not exist.",
          },
        };
      }

      user = dbUser;
      userOtpCode = dbUser.otp_code;
      userOtpExpiresAt = dbUser.otp_expires_at;
    }

    if (!userOtpCode || userOtpCode !== otp) {
      return {
        success: false,
        error: { message: "Invalid verification code." },
      };
    }

    if (userOtpExpiresAt && new Date(userOtpExpiresAt) < new Date()) {
      return {
        success: false,
        error: {
          message: "Verification code has expired. Please request a new one.",
        },
      };
    }

    // Fetch user full profile if executed from cached branch
    if (!user) {
      const { data: dbUser, error } = await supabase
        .from(tableSource)
        .select(
          "id, first_name, email, verification_status, fleetmaster_tenants(slug, name)",
        )
        .eq("email", userEmail)
        .eq("id", id)
        .single();

      if (error || !dbUser) {
        return {
          success: false,
          error: { message: error.message || "Account verification failed." },
        };
      }
      user = dbUser;
    }

    const currentStatus = user.verification_status || {
      email: false,
      phone: false,
      national_id: false,
      driving_license: false,
    };

    // Determine if this is initial onboarding verification
    const isFirstTimeVerification = !currentStatus.email;

    const updatedVerificationStatus = {
      ...currentStatus,
      email: true,
    };

    // Mark user verified and clear code
    const { error: updateError } = await supabase
      .from(tableSource)
      .update({
        verification_status: updatedVerificationStatus,
        otp_code: null,
        otp_expires_at: null,
      })
      .eq("id", user.id);

    if (updateError) {
      return {
        success: false,
        error: {
          message: updateError.message || "Failed to complete verification.",
        },
      };
    }

    // 3. Clear Redis key & INVALIDATE PROFILE CACHE
    const profileCacheKey = `user:profile:${user.id}:${normalizedRole}`;
    await Promise.all([redis.del(redisKey), redis.del(profileCacheKey)]).catch(
      (e) => console.error("Redis cache cleanup failure:", e),
    );

    // 4. Trigger background email dispatcher with retry logic
    triggerPostVerificationNotification({
      isFirstTime: isFirstTimeVerification,
      userEmail: user.email,
      tenant: user.fleetmaster_tenants,
      firstName: user.first_name,
    }).catch((err) => console.error("Notification dispatch error:", err));

    // 5. Send internal notification
    if (isFirstTimeVerification) {
      const { error: notifError } = await supabase
        .from("fleetmaster_notifications")
        .insert({
          user_id: user.id,
          category: "System",
          title: "Welcome!",
          notification: `Hello${user.first_name && " " + user.first_name}, Welcome to ${user.fleetmaster_tenants?.name || "FleetMaster"}. Thank you for choosing us. Please read the terms & conditions and guide to get started!\nAustine O. - CEO`,
          seen: false,
        });

      if (notifError) {
        console.error("Internal notification insert error:", notifError);
      }
    } else {
      const { error: notifError } = await supabase
        .from("fleetmaster_notifications")
        .insert({
          user_id: user.id,
          category: "System",
          title: "Email Change!",
          notification: `Hello${user.first_name && " " + user.first_name}. Your email has been changed successfully on ${new Date().toLocaleString()}! If you did not initialise the change contact support now.\nAustine O. - CEO`,
          seen: false,
        });

      if (notifError) {
        console.error("Internal notification insert error:", notifError);
      }
    }

    return {
      success: true,
      isFirstTimeVerification,
      message: isFirstTimeVerification
        ? "Your email has been verified. Welcome to FleetMaster!"
        : "Your email address has been updated and re-verified successfully.",
    };
  } catch (err: any) {
    return {
      success: false,
      error: {
        message: err.message || "An error occurred during verification.",
      },
    };
  }
}
