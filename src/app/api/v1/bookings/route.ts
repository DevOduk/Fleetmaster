// src/app/api/vehicles/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch every single row and column from the vehicles table
    const { data, error } = await supabase
      .from("fleetmaster_bookings")
      .select("*")
      // exclude all reserved vehicles from bookings object
      .neq("booking_status", "Reserved");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const bookings = data.map((booking) => ({
      tenantId: booking.tenant_id,
      id: booking.id,
      date: booking.date,
      vehicleId: booking.vehicle_id,
      renterName: booking.renter_name,
      renterPhone: booking.renter_phone,
      renterID: booking.renter_id,
      pickupLocation: booking.pickup_location,
      dropoffLocation: booking.dropoff_location,
      rentalStart: booking.rental_start,
      rentalEnd: booking.rental_end,
      rentalTime: booking.rental_time,
      rentalDays: booking.rental_days,
      discount: booking.discount,
      total: booking.total,
      paymentMethod: booking.payment_method,
      paymentRef: booking.payment_ref,
      bookingStatus: booking.booking_status,
      priority: booking.priority,
    }));

    return NextResponse.json(bookings, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
