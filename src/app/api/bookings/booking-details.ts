"use server";
import { createClient } from "@/utils/supabase/server";

export async function getBookingDetailsServer(bookingID: number, tenantID: string) {
    // Strict guard: Prevent the network/database query entirely if tenantID is missing, invalid, or falsy
    if (!tenantID || typeof tenantID !== 'string' || !tenantID.trim() || !bookingID || isNaN(Number(bookingID))) {
        return { 
            data: null, 
            error: { message: "Unauthorized: Invalid or missing tenant credentials." } 
        };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("fleetmaster_bookings")
        .select("*, vehicle:fleetmaster_vehicles(*)")
        .eq("id", Number(bookingID))
        .eq("tenant_id", tenantID.trim())
        .maybeSingle();

        return { data, error };
}