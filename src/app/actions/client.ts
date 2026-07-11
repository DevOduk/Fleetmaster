"use server";
import { createClient } from "@/utils/supabase/server";
import { hash } from "bcrypt-ts";

// SALT_ROUNDS should be a number (e.g., 10 or 12)
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT || "12");

export async function createTenantClient(newTenantClient: any) {
  try {
    const supabase = await createClient();
    const hashedPassword = await hash(newTenantClient.password, SALT_ROUNDS);

    const { error, data } = await supabase
      .from("fleetmaster_clients")
      .insert({
        ...newTenantClient,
        password: hashedPassword
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

      // Return consistent error structure
      return {
        data: null,
        success: false,
        error: { message: friendlyMessage } // Now error has a .message property
      };
    }

    return { data, success: true, error: null };

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