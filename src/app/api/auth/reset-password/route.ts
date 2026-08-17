import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import { hash } from "bcrypt-ts";
import { createPublicClient } from "@/utils/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to generate a secure random temporary password
const generateSecureOtpPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$!";
  let password = "";
  // Generate a 12-character secure random password
  const randomBytes = crypto.randomBytes(12);
  for (let i = 0; i < 12; i++) {
    password += chars[randomBytes[i] % chars.length];
  }
  return password;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, tenantId, isClient, isAdmin, isTenantManager } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "A valid email address is required." },
        { status: 400 },
      );
    }

    let tableName = "";
    let requiresTenantCheck = false;

    if (isClient) {
      tableName = "fleetmaster_clients";
      requiresTenantCheck = true;
    } else if (isAdmin) {
      tableName = "fleetmaster_admins";
      requiresTenantCheck = true;
    } else if (isTenantManager) {
      tableName = "fleetmaster_main_admins";
      requiresTenantCheck = false;
    } else {
      return NextResponse.json(
        { message: "Invalid role context provided." },
        { status: 400 },
      );
    }

    if (requiresTenantCheck && !tenantId) {
      return NextResponse.json(
        { message: "Tenant ID is required for this user category." },
        { status: 400 },
      );
    }

    const supabase = createPublicClient();

    // 1. Query the corresponding database table to verify user existence and fetch first_name
    let query = supabase
      .from(tableName)
      .select("id, email, first_name, tenant_id")
      .eq("email", email);

    if (requiresTenantCheck && tenantId) {
      query = query.eq("tenant_id", tenantId);
    }

    const { data: userRecord, error: dbError } = await query.maybeSingle();

    if (dbError || !userRecord) {
      // Secure response to avoid user enumeration leaks
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a temporary password has been dispatched.",
        },
        { status: 200 },
      );
    }

    // 2. Generate temporary one-time password and hash it for custom auth storage
    const tempPassword = generateSecureOtpPassword();
    const saltRounds = 10;
    const hashedPassword = await hash(tempPassword, saltRounds);

    // 3. Update the database record with the new temporary hashed password
    // (Optional: add a flag like `must_change_password: true` in your table schema if available)
    const { error: updateError } = await supabase
      .from(tableName)
      .update({
        password: hashedPassword,
        is_otp: true,
      })
      .eq("id", userRecord.id);

    if (updateError) {
      console.error("Database password update failure:", updateError);
      return NextResponse.json(
        { message: "Unable to process temporary password generation." },
        { status: 500 },
      );
    }

    const firstName = userRecord.first_name || "Valued User";

    // 4. Send email containing the One-Time Password using Resend
    const { error: emailError } = await resend.emails.send({
      from: "FleetMaster <onboarding@resend.dev>",
      to: [
        "austine.oduk@gmail.com",
        // userRecord.email
      ],
      subject: "Your FleetMaster Temporary Password",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #1f2937;">Password Reset Request</h2>
          <p>Hello ${firstName},</p>
          <p>We received a request to reset your FleetMaster account password. Your temporary one-time password is:</p>
          
          <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #2563eb; border-radius: 6px; margin: 20px 0;">
            ${tempPassword}
          </div>

          <p>Please use this temporary password to log in. You will be prompted to change your password immediately upon signing in.</p>
          <p>If you didn't request this, please secure your account immediately.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280;">Thanks,<br/>The FleetMaster Team</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend email delivery failure:", emailError);
      return NextResponse.json(
        {
          message:
            "Failed to send temporary password email. Please try again later.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Temporary password sent successfully." },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Reset password endpoint error:", error);
    return NextResponse.json(
      { error, message: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
