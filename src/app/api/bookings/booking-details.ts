"use server";
import { createClient } from "@/utils/supabase/server";

export async function getBookingDetailsServer(bookingID: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("fleetmaster_bookings")
        .select("*, vehicle:fleetmaster_vehicles(*)")
        .eq("id", bookingID)
        .maybeSingle();

    return { data, error };
}
