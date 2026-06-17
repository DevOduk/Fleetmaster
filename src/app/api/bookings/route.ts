// src/app/api/vehicles/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch every single row and column from the vehicles table
    const { data, error } = await supabase
      .from('fleetmaster_bookings')
      .select('*')
      .eq('tenant_id', '33429a1a-4c40-40e4-8f8f-3d2f58f2ed54')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // convert back to normalised interface before sending to client 

// export interface Booking {
//   id: number;
//   date: string;
//   vehicleId: number;
//   renterName: string;
//   renterPhone: string;
//   renterID: string;
//   pickupLocation: string;
//   dropoffLocation: string;
//   rentalStart: string;
//   rentalEnd: string;
//   rentalTime: string;
//   rentalDays: number;
//   discount: number;
//   total: number;
//   paymentMethod: string;
//   paymentRef: string;
//   bookingStatus: "Active" | "Reserved" | "Completed" | "Cancelled";
//   priority?: "High Priority" | "Medium Priority" | "Low Priority";
// }
    const bookings = data.map((booking) => ({
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}