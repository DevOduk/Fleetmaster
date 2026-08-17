import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import VehicleNotFound from "@/components/vehicles/NotFound";
import Link from "next/link";
import isBetween from "dayjs/plugin/isBetween";
import dayjs from "dayjs";
import { Box, Chip } from "@mui/material";
dayjs.extend(isBetween);
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { AdminCalendarWrapper } from "@/components/calendar/AdminCalendarWrapper";
import { fetchVehicleDetails } from "@/app/actions/vehicles";
import type { Metadata } from "next";
import { fetchBookingsForVehicle } from "@/app/actions/bookings";
import { headers } from "next/headers";

interface VehiclePageProps {
  params: Promise<{ vehicleID: string }>;
}

export async function generateMetadata({
  params,
}: VehiclePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const vehicleID = resolvedParams.vehicleID;

  const response = await fetchVehicleDetails(Number(vehicleID));
  const vehicle = response?.data;

  if (!vehicle) {
    return {
      title: "Vehicle Not Found | Fleetmaster",
      description: "The requested vehicle could not be found.",
    };
  }

  return {
    title: `${vehicle.make} ${vehicle.model} ${vehicle.year} | Fleetmaster`,
    description:
      vehicle.description ||
      `Rent or manage the ${vehicle.year} ${vehicle.make} ${vehicle.model} on Fleetmaster.`,
  };
}

const breadcrumbItems = [{ label: "Vehicles", href: "/vehicles" }];

const VehiclePage = async ({ params }: VehiclePageProps) => {
  const resolvedParams = await params;
  const vehicleID = resolvedParams.vehicleID;
  let loading = true;
  let bookings = [];
  // Get the request headers to check the URL safely on the server
  const headersList = await headers();
  const referer = headersList.get("referer") || "";
  const xUrl = headersList.get("x-url") || ""; // Optional: if you set a custom header in middleware
  const isDashboard =
    referer.includes("dashboard") || xUrl.includes("dashboard");

  const response = await fetchVehicleDetails(Number(vehicleID));
  const VehicleDetails = response?.data;

  const bookingsResponse = await fetchBookingsForVehicle(vehicleID);

  if (bookingsResponse.success) {
    loading = false;
    bookings = bookingsResponse.data;
  } else {
    loading = false;
  }

  if (!VehicleDetails) {
    return <VehicleNotFound />;
  }

  return (
    <main className="space-y-6 p-6">
      <PageBreadcrumb
        items={breadcrumbItems}
        pageTitle={`${VehicleDetails.make} ${VehicleDetails.model}`}
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Calendar Section: col-span-5 */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <AdminCalendarWrapper
              bookings={bookings}
              loading={loading}
              isMarkedUnavailable={VehicleDetails.status === "Not Available"}
              vehicleId={parseInt(vehicleID)}
              dateString={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Details Section: col-span-7 */}
        <div className="col-span-12 space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {VehicleDetails.make} {VehicleDetails.model}
                </h2>
                <p className="text-gray-500">
                  Body Type: {VehicleDetails?.body_type} | Category:{" "}
                  {VehicleDetails?.category}{" "}
                </p>
              </div>
              <div>
                <span
                  className={`font-sm mt-2 mb-1 rounded-full px-3 py-1 text-xs ${
                    VehicleDetails.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {VehicleDetails.status}
                </span>
                <span className="font-sm ms-3 mt-2 mb-1 rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                  Self Driven
                </span>
              </div>
            </div>

            <div className="relative">
              <Box
                className="flex gap-2"
                sx={{ position: "absolute", top: 10, right: 10 }}
              >
                <Chip
                  sx={{ px: 1 }}
                  variant="filled"
                  color="primary"
                  icon={<LocalGasStationOutlinedIcon fontSize="small" />}
                  label={VehicleDetails.fuel_type}
                />
                <Chip
                  sx={{ px: 1 }}
                  variant="filled"
                  color="primary"
                  icon={<PeopleAltOutlinedIcon fontSize="small" />}
                  label={VehicleDetails.seats + " Seats"}
                />
              </Box>
              <img
                src={VehicleDetails.image_url}
                alt={`${VehicleDetails.make} ${VehicleDetails.model}`}
                className="mb-8 aspect-video w-full rounded-xl object-cover"
              />
            </div>

            <div>
              <p className="text-gray-400">Description</p>
              <p className="font-sm mt-3 text-gray-500 dark:text-white">
                {VehicleDetails.description}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-gray-400">Year</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails.year}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Seats</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails.seats}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Exterior Color</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails.color[0]}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Interior Color</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails.color[1]}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Transmission</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails.transmission}
                </p>
              </div>
              <div>
                <p className="text-gray-400">License Plate</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails.license_plate.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">VIN</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails.vin}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Daily Rate</p>
                <p className="font-sm mt-2 mb-1 text-blue-600">
                  Ksh. {VehicleDetails.daily_rate.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Location</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails.location}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Next Service Due</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails.next_service_due}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Minimum Rental Days</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {VehicleDetails.min_rental_days} days
                </p>
              </div>

              <div>
                <p className="text-gray-400">Luggages/Carry-on</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  {2} carry-ons
                </p>
              </div>

              <div>
                <p className="text-gray-400">Baby Seats</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">
                  Available on request
                </p>
              </div>
            </div>
            {!isDashboard && (
              <Link href={"/vehicles/" + vehicleID + "/edit"}>
                <Button className="mt-5 w-full" size="sm">
                  Manage Vehicle
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default VehiclePage;
