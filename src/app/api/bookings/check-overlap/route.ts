// src/app/api/bookings/check-overlap/route.ts

import { NextResponse } from "next/server";
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
      vehicleID,
      rentalStart, // Format: YYYY-MM-DD
      rentalEnd, // Format: YYYY-MM-DD
      rentalTime, // Format: string (e.g., "11:35" or "11:35:00")
      tenantID,
      userID,
      buffer = 6, // Buffer in hours (defaults to 6)
      isAdmin = false,
    } = body;

    // --- 1. PARAMETER AND COLLISION VALIDATION ---
    if (
      !vehicleID ||
      !rentalStart ||
      !rentalEnd ||
      !rentalTime ||
      !tenantID ||
      !userID
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters for backend scheduling validation, including rentalTime and userID.",
          success: false,
        },
        { status: 400 },
      );
    }

    // Clean and handle time string safely whether it comes as "11:35" or "11:35:00"
    let cleanTime =
      typeof rentalTime === "string" ? rentalTime.trim() : String(rentalTime);
    if (cleanTime.split(":").length === 2) {
      cleanTime = `${cleanTime}:00`;
    }

    // Combine Date and Time into absolute ISO timestamps safely
    const startString = `${rentalStart.toString().trim()}T${cleanTime}`;
    const endString = `${rentalEnd.toString().trim()}T${cleanTime}`;

    const startDateObj = new Date(startString);
    const endDateObj = new Date(endString);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return NextResponse.json(
        {
          error: `Invalid date or time format provided. Received start: ${rentalStart}, end: ${rentalEnd}, time: ${rentalTime}`,
          success: false,
        },
        { status: 400 },
      );
    }

    // --- 2. DYNAMIC 15-MINUTE EXPIRATION & BUFFERED OVERLAP CHECK ---
    const fifteenMinutesAgo = new Date(
      Date.now() - 15 * 60 * 1000,
    ).toISOString();
    const bufferMs = Number(buffer) * 60 * 60 * 1000;

    // Step A: Fetch all potential calendar overlaps for this vehicle (Excluding Cancelled entries)
    const { data: potentialConflicts, error: overlapError } = await supabase
      .from("fleetmaster_bookings")
      .select(
        "id, user_id, booking_status, payment_status, created_at, rental_start, rental_end, rental_time",
      )
      .eq("vehicle_id", Number(vehicleID))
      .neq("booking_status", "Cancelled");

    if (overlapError) {
      console.error("❌ Database overlap check crashed:", overlapError);
      return NextResponse.json(
        { error: "Failed to perform fleet calendar checks.", success: false },
        { status: 500 },
      );
    }

    let conflictingBookingInfo: {
      rental_start: string;
      rental_end: string;
      rental_time: string;
    } | null = null;

    // Step B: Filter conflicts locally in Node memory including extension exception & buffer rules
    const activeOverlaps =
      potentialConflicts?.filter((booking) => {
        if (!booking.rental_start || !booking.rental_end) return false;

        const bookingTime = booking.rental_time || rentalTime;
        let cleanBookingTime =
          typeof bookingTime === "string"
            ? bookingTime.trim()
            : String(bookingTime);
        if (cleanBookingTime.split(":").length === 2) {
          cleanBookingTime = `${cleanBookingTime}:00`;
        }

        const existingStartObj = new Date(
          `${booking.rental_start}T${cleanBookingTime}`,
        );
        const existingEndObj = new Date(
          `${booking.rental_end}T${cleanBookingTime}`,
        );

        if (
          isNaN(existingStartObj.getTime()) ||
          isNaN(existingEndObj.getTime())
        ) {
          return false;
        }

        const existingBaseStartMS = existingStartObj.getTime();
        const existingBaseEndMS = existingEndObj.getTime();

        // 💡 EXTENSION EXCEPTION LOGIC:
        if (booking.user_id === userID || isAdmin) {
          return false;
        }

        // Apply buffer times: Add turnaround buffer between bookings for other users
        const bufferedExistingStartMS = existingBaseStartMS - bufferMs;
        const bufferedExistingEndMS = existingBaseEndMS + bufferMs;

        const requestedStartMS = startDateObj.getTime();
        const requestedEndMS = endDateObj.getTime();

        // Buffered Overlap Condition: (StartA < BufferedEndB) and (EndA > BufferedStartB)
        const hasTimeOverlap =
          requestedStartMS < bufferedExistingEndMS &&
          requestedEndMS > bufferedExistingStartMS;

        if (!hasTimeOverlap) {
          return false;
        }

        // 1. HARD BLOCKS: If a booking is explicitly confirmed, live, or settled
        const isHardBlocked =
          booking.booking_status === "Booked" ||
          booking.booking_status === "Confirmed" ||
          booking.booking_status === "Active" ||
          booking.booking_status === "Completed";

        // 2. TIMEOUT RESERVATIONS: Evaluate uncompleted pending holding states
        let isReservedBlocked = false;
        if (booking.booking_status === "Reserved") {
          if (
            booking.payment_status === "PAID" ||
            booking.payment_status === "COMPLETE"
          ) {
            isReservedBlocked = true;
          } else {
            const bookingCreationTime = new Date(
              booking.created_at,
            ).toISOString();
            const isFreshReservation = bookingCreationTime > fifteenMinutesAgo;
            if (isFreshReservation) {
              isReservedBlocked = true;
            }
          }
        }

        if (isHardBlocked || isReservedBlocked) {
          conflictingBookingInfo = {
            rental_start: booking.rental_start,
            rental_end: booking.rental_end,
            rental_time: booking.rental_time || rentalTime,
          };
          return true;
        }

        return false;
      }) || [];

    // Step C: Reject transaction if a schedule conflict with buffer is present
    if (activeOverlaps.length > 0 && conflictingBookingInfo) {
      const conflictEndReadable = `${conflictingBookingInfo.rental_end} at ${conflictingBookingInfo.rental_time}`;
      const conflictStartReadable = `${conflictingBookingInfo.rental_start} at ${conflictingBookingInfo.rental_time}`;

      return NextResponse.json(
        {
          error: `This vehicle is only available from ${conflictEndReadable} (due to prior booking ending and required maintenance/buffer) or until ${conflictStartReadable}. Please choose a different schedule!`,
          success: false,
          conflictingBooking: conflictingBookingInfo,
        },
        { status: 409 },
      );
    }

    // Return the clean handshake back to the client loop
    return NextResponse.json(
      {
        message: "This vehicle is available for the selected date and time!",
        success: true,
      },
      { status: 201 },
    );
  } catch (globalError: any) {
    console.error(
      "❌ Uncaught Critical Server Pipeline Exception:",
      globalError,
    );
    return NextResponse.json(
      {
        error: "Critical server pipeline runtime crash.",
        message: globalError.message,
        success: false,
      },
      { status: 500 },
    );
  }
}
