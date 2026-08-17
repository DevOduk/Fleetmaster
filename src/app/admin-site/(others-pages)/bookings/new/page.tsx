import CreateNewBookingForm from "@/components/bookings/CreateBooking";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import { Metadata } from "next";
import { getAdminTenant } from "@/utils/getAdminTenant";

export async function generateMetadata(): Promise<Metadata> {
  const { tenantData } = await getAdminTenant();

  let title;
  const tenantName = tenantData?.name;
  let tenantDescription = tenantData?.about;

  // Fallback to DB query if header data isn't present
  if (tenantName) {
    title = `New Booking | ${tenantName}: FleetMaster - Premium Car Rental & Fleet Solutions Software`;
    tenantDescription =
      tenantDescription ||
      `${tenantName} offers top-tier vehicle rentals. Book reliable vehicles across multiple locations easily.`;
  } else {
    title = `New Booking | FleetMaster - Premium Car Rental & Fleet Solutions Software`;
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

export default function NewBooking() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="mb-4 flex items-center gap-3">
          <Link href="/bookings" className="mr-2">
            <Button size="sm" variant="danger-outline">
              <ChevronLeftIcon />
              Back to Bookings
            </Button>
          </Link>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Create Booking
          </h3>
        </div>
        <div className="space-y-6">
          <CreateNewBookingForm />
        </div>
      </div>
    </div>
  );
}
