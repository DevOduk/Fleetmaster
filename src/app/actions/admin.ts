"use server";
import { createClient } from "@/utils/supabase/server";
import { hash } from "bcrypt-ts";

// SALT_ROUNDS should be a number (e.g., 10 or 12)
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT || "12");

export async function createTenantAdmin(newTenantAdmin: any) {
  try {
    const supabase = await createClient();

    // Pass the number of rounds, NOT a string salt
    const hashedPassword = await hash(newTenantAdmin.password, SALT_ROUNDS);

    const { error, data } = await supabase
      .from("fleetmaster_admins")
      .insert({ 
        ...newTenantAdmin, 
        password: hashedPassword // Store the full hash
      })
      .select('*')
      .single();
      
    return { data, success: !error, error };
  } catch (err: any) {
    console.error("New Tenant Admin Creation failure:", err);
    return { success: false, error: err.message || "Failed to register admin." };
  }
}