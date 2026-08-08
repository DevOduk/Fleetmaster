"use client";

import ViewBooking from '@/components/bookings/ViewBooking';
import SecondaryHero from '@/components/marketing-components/SecondaryHero';
import { use } from 'react';

interface VehiclePageProps {
  params: Promise<{ bookingID: string }>;
}


const VehiclePage = async ({ params }: VehiclePageProps) => {
  const resolvedParams = use(params);
  const bookingID = resolvedParams.bookingID;

  const pages = [
    { label: 'Home', href: '/' },
    { label: 'My Bookings', href: '/bookings' },
    { label: 'Booking #' + bookingID, href: '/bookings/' + bookingID }
  ];



  return (
    <main className="space-y-7">
      <SecondaryHero
        pages={pages}
        title="View and Manage"
        highlightedText={"Booking #" + bookingID}
        description="Monitor your fleet performance and track your active rentals."
      />

      <ViewBooking BookingID={Number(bookingID)} />

    </main>
  );
};

export default VehiclePage;