// src/app/api/bookings/update/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Change UPDATE to POST
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      amount,
      phone,
      firstName,
      lastName,
      vehicleID,
      rentalStart,
      rentalEnd,
      rentalTime,
      rentalDays,
      tenantID,
      userID,
      nationalID,
      pickupLocation,
      dropoffLocation,
      payment_method,
      booking_status,
      payment_status,
      payment_ref,
      intasend_invoice_id,
    } = body;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("fleetmaster_bookings")
      .insert({
        user_id: userID,
        tenant_id: tenantID,
        vehicle_id: Number(vehicleID),
        renter_name: `${firstName} ${lastName}`.trim(),
        renter_phone: phone,
        renter_id: nationalID,
        rental_start: rentalStart,
        rental_end: rentalEnd,
        rental_time: rentalTime,
        rental_days: Number(rentalDays),
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        total: amount,
        payment_method,
        booking_status,
        payment_status,
        payment_ref,
        intasend_invoice_id,
      })
      .select("id");

    if (error) {
      console.error("Supabase Insertion Error:", error); // Helpful for tracking internal errors
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
