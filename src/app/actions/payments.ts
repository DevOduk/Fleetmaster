"use server";
import { createClient } from "@/utils/supabase/server";

export async function createPayment(newPayment: any) {
  try {
    const supabase = await createClient();

    // Pass the number of rounds, NOT a string salt

    const { error, data } = await supabase
      .from("fleetmaster_payments")
      .insert(newPayment)
      .select('*')
      .single();

    return { data, success: !error, error };
  } catch (err: any) {
    console.error("Payment Creation failure:", err);
    return { success: false, error: err.message || "Failed to record payment." };
  }
}

export async function fetchAllPayments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_payments")
    .select(`*`)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function fetchPaymentDetails(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_payments")
    .select(`*`)
    .eq("id", id)
    .single();

  return { data, error, success: !error };
}


export async function fetchPaymentsForAdmin(tenantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_payments")
    .select(`*`)
    .eq("tenant_id", tenantId)
    .order('created_at', { ascending: false });

  return { data, success: !error, error };
}