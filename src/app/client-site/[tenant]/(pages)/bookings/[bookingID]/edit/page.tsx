"use client";
import EditBookingForm from '@/components/bookings/EditBooking';
import BookingNotFound from '@/components/bookings/NotFound';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import { useBooking } from '@/context/BookingContext';
import { useFleet } from '@/context/FleetContext';
import { ChevronLeftIcon } from '@/icons';
import Link from 'next/link';
import { use } from 'react';

interface VehiclePageProps {
  params: Promise<{ bookingID: string }>;
}


const EditBookingsPage = ({ params }: VehiclePageProps) => {
      const { bookings } = useBooking();
  
const resolvedParams = use(params);

  const bookingID = resolvedParams.bookingID;
    const bookingDetails = bookings.find(b => b.id === parseInt(bookingID));

  if (!bookingDetails) {
    return <BookingNotFound />
  }

  
const breadcrumbItems = [
  { label: "Bookings", href: "/bookings" },
  { label: "Booking "+bookingID, href: "/bookings/"+bookingID },
];

  return (
    <main className="space-y-6 p-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
      {/* this breadcrumb should show home / bookings / create new booking */}

            <PageBreadcrumb items={breadcrumbItems} pageTitle="Edit Booking" />

      <div className="flex gap-3 items-center mb-4">

       <Link href={"/bookings/"+bookingID} className="mr-2">
                <Button size="sm" variant="danger-outline">
                  <ChevronLeftIcon />
                  Back to Booking
                </Button>
              </Link>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Edit Booking {bookingID}
        </h3>
      </div>
        <div className="space-y-6">
<EditBookingForm id={parseInt(bookingID)} />
        </div>
      </div>
    </main>
  );
};

export default EditBookingsPage;