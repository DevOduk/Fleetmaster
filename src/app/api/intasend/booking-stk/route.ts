// src/app/api/intasend/stk/route.ts
import { NextResponse } from "next/server";
import IntaSend from "intasend-node";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Destructure items required for validation and the IntaSend dispatch payload
    const {
      // amount,
      phone,
      email,
      firstName,
      lastName,
      vehicleID,
      rentalStart, // Format: YYYY-MM-DD
      rentalEnd, // Format: YYYY-MM-DD
      tenantID,
      userID,
    } = body;

    // --- 1. PARAMETER AND COLLISION VALIDATION ---
    if (!vehicleID || !rentalStart || !rentalEnd || !tenantID) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters for backend scheduling validation.",
        },
        { status: 400 },
      );
    }

    // --- 2. DYNAMIC 15-MINUTE EXPIRATION & OVERLAP CHECK ---
    const fifteenMinutesAgo = new Date(
      Date.now() - 15 * 60 * 1000,
    ).toISOString();

    // Step A: Fetch all potential calendar overlaps for this vehicle (Excluding Cancelled entries)
    const { data: potentialConflicts, error: overlapError } = await supabase
      .from("fleetmaster_bookings")
      .select("id, user_id, booking_status, payment_status, created_at")
      .eq("vehicle_id", Number(vehicleID))
      .neq("booking_status", "Cancelled") // Automatically handles filtering out 'Cancelled' rows
      .lte("rental_start", rentalEnd)
      .gte("rental_end", rentalStart);

    if (overlapError) {
      console.error("❌ Database overlap check crashed:", overlapError);
      return NextResponse.json(
        { error: "Failed to perform fleet calendar checks." },
        { status: 500 },
      );
    }

    // Step B: Filter conflicts locally in Node memory using your explicit status rules
    const activeOverlaps =
      potentialConflicts?.filter((booking) => {
        // 1. HARD BLOCKS: If a booking is explicitly confirmed, live, or settled, it's blocked for everyone
        if (
          booking.booking_status === "Booked" ||
          booking.booking_status === "Confirmed" ||
          booking.booking_status === "Active" ||
          booking.booking_status === "Completed"
        ) {
          return true;
        }

        // 2. TIMEOUT RESERVATIONS: Evaluate uncompleted pending holding states
        if (booking.booking_status === "Reserved") {
          // If it was already completed or paid for via webhook/polling thread, lock it immediately
          if (
            booking.payment_status === "PAID" ||
            booking.payment_status === "COMPLETE"
          ) {
            return true;
          }

          const bookingCreationTime = new Date(
            booking.created_at,
          ).toISOString();
          const isFreshReservation = bookingCreationTime > fifteenMinutesAgo;

          if (isFreshReservation) {
            // 💡 SECURED SELF-REBOOKING EXCLUSION:
            // If it belongs to the SAME user and isn't fully paid yet, let them retry payment.
            if (booking.user_id === userID) {
              return false;
            }
            // If a DIFFERENT client is holding this fresh 15-minute window, it's an active conflict.
            return true;
          }
        }

        return false;
      }) || [];

    // Step C: Reject transaction if a schedule conflict is present
    if (activeOverlaps.length > 0) {
      return NextResponse.json(
        {
          error:
            "This vehicle is occupied or reserved during your selected dates. Please try again after 15 minutes or choose a different date!",
        },
        { status: 409 },
      );
    }

    // --- 3. INTASEND SDK INITIALIZATION & DISPATCH ---
    const intasend = new IntaSend(
      process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY,
      process.env.INTASEND_SECRET_KEY,
      true, // true for sandbox environments
    );

    // Generate a unique API reference string since we no longer insert into database beforehand
    const paymentTrackingRef = `BK-${vehicleID}-${Date.now()}`;

    let intasendResponse;
    try {
      intasendResponse = await intasend.collection().mpesaStkPush({
        first_name: firstName || "Customer",
        last_name: lastName || "Renter",
        email: email || "customer@example.com",
        host: "http://localhost:3000",
        amount: Number(
          // amount ||
          1,
        ),
        phone_number: phone,
        api_ref: paymentTrackingRef,
      });
    } catch (intasendError: any) {
      console.error(
        "❌ IntaSend SDK Gateway Handshake Failure:",
        intasendError,
      );
      return NextResponse.json(
        {
          error: "Payment gateway handshake rejected parameters.",
          details: intasendError.toString(),
        },
        { status: 502 },
      );
    }

    // Return the clean handshake back to the client loop
    return NextResponse.json(intasendResponse);
  } catch (globalError: any) {
    console.error(
      "❌ Uncaught Critical Server Pipeline Exception:",
      globalError,
    );
    return NextResponse.json(
      {
        error: "Critical server pipeline runtime crash.",
        message: globalError.message,
      },
      { status: 500 },
    );
  }
}
