"use server";
import { createClient } from "@/utils/supabase/server";
import { hash, compare } from "bcrypt-ts";
import { Resend } from "resend";
import crypto from "crypto";
import { retryDuration } from "@/data/globalExports";
import { VerifyEmailNotification } from "@/utils/templates/email-templates";


const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT || "12");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function createTenantClient(newTenantClient: any) {
  let userEmail = "";

  try {
    const supabase = await createClient();
    const hashedPassword = await hash(newTenantClient.password, SALT_ROUNDS);

    userEmail = newTenantClient.email;

    // 1. Generate a secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpValidityMinutes = retryDuration / 60;
    const otpExpiresAt = new Date(Date.now() + otpValidityMinutes * 60 * 1000).toISOString();

    // 2. Insert user along with their active OTP credentials
    const { error, data } = await supabase
      .from("fleetmaster_clients")
      .insert({
        ...newTenantClient,
        password: hashedPassword,
        otp_code: otp,
        otp_expires_at: otpExpiresAt
      })
      .select('*')
      .single();

    if (error) {
      console.error("Supabase insert error:", error);

      let friendlyMessage = "An unexpected error occurred while creating the account. Please try again.";

      if (error.code === '23505') {
        if (error.message.includes("email") || error.details?.includes("email")) {
          friendlyMessage = "An account with this email address already exists. Sign in or use a different email.";
        } else if (error.message.includes("phone") || error.details?.includes("phone")) {
          friendlyMessage = "This phone number is already registered.";
        } else {
          friendlyMessage = "A user with these details already exists. Please check your information and try again.";
        }
      }

      return {
        data: null,
        success: false,
        error: { message: friendlyMessage }
      };
    }

    // 3. Dispatch the verification email via Resend
    const { error: mailError } = await resend.emails.send({
      from: "FleetMaster <onboarding@resend.dev>", // Replace with your domain when verified
      to: userEmail,
      subject: `${otp} is your verification code`,
      html: VerifyEmailNotification(otp, otpValidityMinutes),
    });

    return {
      data: data,
      success: true,
      error: { message: mailError ? `Account created successfully, verify you account to proceed:` : 'Account created successfully' }
    };


  } catch (err: any) {
    console.error("New Tenant Admin Creation failure:", err);
    return {
      data: null,
      success: false,
      error: { message: err.message || "A system connection error occurred." }
    };
  }

}

export async function updateProfileDetails({ id, profileDetails }: { id: string; profileDetails: any; }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_clients")
    .update({ ...profileDetails, updated_at: new Date() })
    .eq("id", id)
    .single();

  return { data, error, success: !error };
}

export async function updatePassword(id: string, profileDetails: any) {
  try {
    if (!id) {
      return { success: false, error: { message: "User ID is required." } };
    }

    const { old_password, confirm_password, ...restDetails } = profileDetails;

    if (!old_password || !confirm_password) {
      return {
        success: false,
        error: { message: "Both current and new passwords are required." },
      };
    }

    const supabase = await createClient();

    // 1. Fetch current stored password hash
    const { data: user, error: fetchError } = await supabase
      .from("fleetmaster_clients")
      .select("password_hash")
      .eq("id", id)
      .single();

    if (fetchError || !user) {
      return {
        success: false,
        error: { message: "User account not found." },
      };
    }

    // 2. Verify old password against stored hash
    const isPasswordValid = await compare(
      old_password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return {
        success: false,
        error: { message: "Incorrect current password." },
      };
    }

    // 3. Hash the new password
    const newPasswordHash = await hash(confirm_password, 10);

    // 4. Update password and profile details safely
    const { data, error: updateError } = await supabase
      .from("fleetmaster_clients")
      .update({
        ...restDetails,
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase update error (updatePassword):", updateError);
      return {
        success: false,
        error: { message: "Failed to update password. Please try again." },
      };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error("Unexpected error (updatePassword):", err);
    return {
      success: false,
      error: { message: err.message || "An unexpected error occurred." },
    };
  }
}

export async function fetchClientsForTenant(tenantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_clients")
    .select(`id, first_name, last_name, country, created_at`)
    .eq("tenant_id", tenantId)
    .order('created_at', { ascending: false });

  return { data, success: !error, error };
}
