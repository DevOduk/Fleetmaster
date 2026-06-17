"use client";
import BookingNotFound from '@/components/bookings/NotFound';
import ViewBooking from '@/components/bookings/ViewBooking';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useBooking } from '@/context/BookingContext';
import { useFleet } from '@/context/FleetContext';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import { use } from 'react';

interface VehiclePageProps {
  params: Promise<{ bookingID: string }>;
}

const breadcrumbItems = [{ label: "Bookings", href: "/bookings" }];

const VehiclePage = ({ params }: VehiclePageProps) => {
  const { bookings, loading } = useBooking();

  const resolvedParams = use(params);
  const bookingID = resolvedParams.bookingID;

  const bookingDetails = bookings.find(b => b.id === parseInt(bookingID));

  if (loading) {
    return (
      <div className="py-6 flex flex-col items-center my-8">
        <CircularProgress color="primary" size={30} />

        <h4 className="mb-2 mt-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-xl">
          Just a moment!
        </h4>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Geting booking's details! Please bear with us for a moment ...
        </p>
      </div>
    );
  }

  if (!bookingDetails) {
    return <BookingNotFound />
  }

  return (
    <main className="space-y-6 p-6">
      <PageBreadcrumb
        items={breadcrumbItems}
        pageTitle={`Booking ${bookingID}`}
      />

      <ViewBooking BookingDetails={bookingDetails} />

    </main>
  );
};

export default VehiclePage;