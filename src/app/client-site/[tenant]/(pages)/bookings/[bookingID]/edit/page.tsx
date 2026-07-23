"use client";
import EditBookingForm from '@/components/client-components/EditBooking';
import SecondaryHero from '@/components/marketing-components/SecondaryHero';
import { use } from 'react';

interface VehiclePageProps {
  params: Promise<{ bookingID: string }>;
}


const EditBookingsPage = ({ params }: VehiclePageProps) => {
  const resolvedParams = use(params);
  const bookingID = resolvedParams.bookingID;



  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Bookings", href: "/bookings" },
    { label: "Booking " + bookingID, href: "/bookings/" + bookingID },
    { label: "Update Booking " + bookingID, href: "/bookings/" + bookingID + '/edit' },
  ];

  return (
    <main className="space-y-6">
      <SecondaryHero
        pages={breadcrumbItems}
        title="View and Manage"
        highlightedText={"Booking #" + bookingID}
        description="Monitor your fleet performance and track your active rentals."
      />
      <div className="space-y-6 container mx-auto">
        <EditBookingForm BookingID={parseInt(bookingID)} />
      </div>
    </main>
  );
};

export default EditBookingsPage;