import EditBookingForm from "@/components/bookings/EditBooking";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import { Metadata } from "next";
import { getAdminTenant } from "@/utils/getAdminTenant";

interface VehiclePageProps {
  params: Promise<{ bookingID: string }>;
}

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const [{ tenantData }, { bookingID }] = await Promise.all([
    getAdminTenant(),
    params,
  ]);


  let title;
  const tenantName = tenantData?.name;
  let tenantDescription = tenantData?.about;

  // Fallback to DB query if header data isn't present
  if (tenantName) {
    title = `Edit Booking #${bookingID} | ${tenantName}: FleetMaster - Premium Car Rental & Fleet Solutions Software`;
    tenantDescription =
      tenantDescription ||
      `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;
  } else {
    title = `Edit Booking #${bookingID} | FleetMaster - Premium Car Rental & Fleet Solutions Software`;
  }

  return {
    title: title,
    description: tenantDescription,
    openGraph: {
      title: `${tenantName || "FleetMaster"} - Official Admin Website`,
      description: tenantDescription,
    },
  };
}


const EditBookingsPage = async ({ params }: VehiclePageProps) => {
  const bookingID = (await params).bookingID;

  const breadcrumbItems = [
    { label: "Bookings", href: "/bookings" },
    { label: "Booking " + bookingID, href: "/bookings/" + bookingID },
  ];

  return (
    <main className="space-y-6 p-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
        {/* this breadcrumb should show home / bookings / create new booking */}

        <PageBreadcrumb items={breadcrumbItems} pageTitle="Edit Booking" />

        <div className="mb-4 flex items-center gap-3">
          <Link href={"/bookings/" + bookingID} className="mr-2">
            <Button size="sm" variant="danger-outline">
              <ChevronLeftIcon />
              Back to Booking
            </Button>
          </Link>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Edit Booking #{bookingID}
          </h3>
        </div>
        <div className="space-y-6">
          <EditBookingForm BookingID={Number(bookingID)} />
        </div>
      </div>
    </main>
  );
};

export default EditBookingsPage;
