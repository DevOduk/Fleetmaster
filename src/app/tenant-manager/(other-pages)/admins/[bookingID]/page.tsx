"use client";
import ViewBooking from '@/components/bookings/ViewBooking';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { use } from 'react';

interface VehiclePageProps {
  params: Promise<{ bookingID: string }>;
}

const breadcrumbItems = [{ label: "Bookings", href: "/bookings" }];

const VehiclePage = ({ params }: VehiclePageProps) => {

  const resolvedParams = use(params);
  const bookingID = resolvedParams.bookingID;

  return (
    <main className="space-y-6 p-6">
      <PageBreadcrumb
        items={breadcrumbItems}
        pageTitle={`Booking ${bookingID}`}
      />

      <ViewBooking BookingID={Number(bookingID)}/>

    </main>
  );
};

export default VehiclePage;