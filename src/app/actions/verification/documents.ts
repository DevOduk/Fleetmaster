"use server";

import { createClient } from "@/utils/supabase/server";
import { GoogleGenAI, Part } from '@google/genai';
import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { dispatchSystemNotification } from "../notifications";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const resend = new Resend(process.env.RESEND_API_KEY);

const responseSchema = {
  photoClarity: true,
  namesMatch: true,
  isNotExpired: true,
  idNumberMatch: true,
  licenseNumberMatch: true,
};

function fileToGenerativePart(data: string, mimeType: string): Part {
  return {
    inlineData: { data, mimeType },
  };
}

// Helper function to match your cache key pattern
function getUserCacheKey(id: string, role: string) {
  return `user:${role}:${id}`;
}

export async function submitAndVerifyDocument(
  userDetails: {
    id: string;
    first_name: string;
    last_name: string;
    national_id_number: string;
    dl_number: string;
    dob: string;
    email: string;
  },
  file: File,
  role = "client"
) {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("A valid image file is required.");
  }

  const imageData = Buffer.from(await file.arrayBuffer()).toString("base64");
  const imagePart = fileToGenerativePart(imageData, file.type);

  const response = await genAI.models.generateContent({
    model: 'gemini-3.6-flash', // Updated to a stable/standard model version if needed
    contents: [
      imagePart,
      `You are in charge of driving license document verification for FleetMaster. 
      Verify the attached driving license by checking the individual's photo and comparing its values with these user details: ${JSON.stringify(userDetails)}. 
      Criteria: the user's name having first and last name, at least one name must match i.e if license photo has 3 names first, surname, last, atleast one of these names must be equal to at least one of the user's names either first or last name, second the national id number in image must be equal to the number in profile, expiry must be in a future Date. 
      Return only JSON matching this schema: ${JSON.stringify(responseSchema)}.`,
    ],
    config: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("No response received from verification model.");
  }

  const res = JSON.parse(responseText);


  // 1. Build a clean list of errors skipping any true flags
  const errors: string[] = [];
  if (!res.photoClarity) errors.push("- Photo clarity is poor or unreadable.");
  if (!res.namesMatch) errors.push("- The name on the license does not match your profile name.");
  if (!res.isNotExpired) errors.push("- The driving license has expired.");
  if (!res.idNumberMatch) errors.push("- The National ID number does not match your profile details.");
  if (!res.licenseNumberMatch) errors.push("- The Driving License number does not match your profile details.");

  const allPassed = errors.length === 0;
  let verificationErrorText = null;

  if (!allPassed) {
    verificationErrorText = `Dear user, your verification process failed due to the following reasons:\n${errors.join("\n")}`;
  }

  const supabase = await createClient();

  // 2. Fetch current record to preserve existing verification_status flags safely
  const { data: existingUser } = await supabase
    .from("fleetmaster_clients")
    .select("verification_status")
    .eq("id", userDetails.id)
    .single();

  const currentStatus = existingUser?.verification_status || {
    email: false,
    phone: false,
    national_id: false,
    driving_license: false,
  };

  // If passed, set both national_id and driving_license to true. Otherwise, keep current statuses.
  const updatedVerificationStatus = {
    ...currentStatus,
    national_id: allPassed ? true : currentStatus.national_id,
    driving_license: allPassed ? true : currentStatus.driving_license,
  };

  // 3. Update ONLY verification_error and verification_status columns in database
  const { data, error } = await supabase
    .from("fleetmaster_clients")
    .update({
      verification_error: verificationErrorText,
      verification_status: updatedVerificationStatus,
      updated_at: new Date(),
    })
    .eq("id", userDetails.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update verification database record: ${error.message}`);
  }

  // 4. Update/Set Redis Cache with fresh profile data
  if (data) {
    const cacheKey = getUserCacheKey(userDetails.id, role);
    await redis
      .set(cacheKey, JSON.stringify(data), { ex: 900 })
      .catch((e) => console.error("Redis cache update failure:", e));
  }
  const email = 'austine.oduk@gmail.com'
  // 5. Send Notification Email via Resend
  if (userDetails.email) {
    const emailSubject = allPassed
      ? "Verification Successful"
      : "Action Required: Verification Failed";

    const emailHtml = allPassed
      ? `<p>Dear ${userDetails.first_name},</p><p>Your driving license document have been successfully verified!</p>`
      : `<p>Dear ${userDetails.first_name},</p><p>Your verification process failed due to the following reasons:</p><pre style="font-family:inherit;">${errors.join("\n")}</pre><p>Please update your profile details and re-upload clear documents.</p>`;
    const notificationBody = allPassed
      ? `Dear ${userDetails.first_name},\nYour driving license document have been successfully verified!`
      : `Dear ${userDetails.first_name},\nYour verification process failed due to the following reasons:\n${errors.join("\n")}\nPlease update your profile details and re-upload clear documents.`;

    await Promise.all([
      resend.emails.send({
        from: "FleetMaster <onboarding@resend.dev>", // Update with your custom verified domain
        to: email,
        subject: emailSubject,
        html: emailHtml,
      }).catch((emailErr) => {
        console.error("Resend email delivery failure:", emailErr);
      }),
      dispatchSystemNotification(emailSubject, userDetails.id, "System", notificationBody),
    ]);
  }

  return { success: allPassed, data, error: null };
}