import ViewBooking from "@/components/bookings/ViewBooking";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { getAdminTenant } from "@/utils/getAdminTenant";

interface VehiclePageProps {
  params: Promise<{ bookingID: string }>;
}

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const { tenantData } = await getAdminTenant();
  const bookingID = (await params).bookingID;


  let title;
  const tenantName = tenantData?.name;
  let tenantDescription = tenantData?.about;

  // Fallback to DB query if header data isn't present
  if (tenantName) {
    title = `View Booking #${bookingID} | ${tenantName}: FleetMaster - Premium Car Rental & Fleet Solutions Software`;
    tenantDescription =
      tenantDescription ||
      `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;
  } else {
    title = `View Booking #${bookingID} | FleetMaster - Premium Car Rental & Fleet Solutions Software`;
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



const VehiclePage = async ({ params }: VehiclePageProps) => {
  const resolvedParams = await params;
  const bookingID = resolvedParams.bookingID;
  const breadcrumbItems = [{ label: "Bookings", href: "/bookings" }];

  return (
    <main className="space-y-6 p-6">
      <PageBreadcrumb
        items={breadcrumbItems}
        pageTitle={`Booking #${bookingID}`}
      />

      <ViewBooking BookingID={Number(bookingID)} />
    </main>
  );
};

export default VehiclePage;
