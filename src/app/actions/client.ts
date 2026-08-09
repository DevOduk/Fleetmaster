"use server";
import { createClient } from "@/utils/supabase/server";
import { hash } from "bcrypt-ts";
import { Resend } from "resend";
import crypto from "crypto";
import { redirect } from "next/navigation";

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
    const otpValidityMinutes = 5;
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
          friendlyMessage = "An account with this email address already exists.";
        } else if (error.message.includes("phone") || error.details?.includes("phone")) {
          friendlyMessage = "This phone number is already registered.";
        } else {
          friendlyMessage = "A user with these details already exists.";
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
      html: `
        <div style="font-family: sans-serif; padding: 24px; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-bottom: 16px;">Verify your identity</h2>
          <p style="color: #334155; font-size: 16px; line-height: 24px;">Use the following security code to complete your verification request. This code is active for ${otpValidityMinutes} minutes.</p>
          <div style="background-color: #f1f5f9; padding: 14px; text-align: center; border-radius: 6px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #0f172a;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 12px;">If you did not request this verification string, please ignore this email safely.</p>
        </div>
      `,
    });

    if (mailError) {
      console.error("Resend delivery error:", mailError);
      return {
        data: data,
        success: false,
        error: { message: `Account created, but verification email failed: ${mailError.message}` }
      };
    }

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
    .update({...profileDetails, updated_at: new Date()})
    .eq("id", id)
    .single();

  return { data, error, success: !error };
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
