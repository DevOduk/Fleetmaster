"use server";
import { createClient } from "@/utils/supabase/server";


export async function fetchAllExpenses() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fleetmaster_expenses")
    .select(`*`)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function fetchExpenseDetails(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_expenses")
    .select(`*`)
    .eq("id", id)
    .single();

  return { data, error };
}

export async function updateExpensegDetails(id: number, expenseDetails) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_expenses")
    .update(expenseDetails)
    .eq("id", id)
    .single();

  return { data, error, success: !error };
}

export async function fetchExpensesForAdmin(tenantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fleetmaster_expenses")
    .select(`*`)
    .eq("tenant_id", tenantId)
    .order('created_at', { ascending: false });

  return { data, success: !error, error };
}

