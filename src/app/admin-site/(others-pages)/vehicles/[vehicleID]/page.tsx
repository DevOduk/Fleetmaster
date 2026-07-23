import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import VehicleNotFound from '@/components/vehicles/NotFound';
import Link from 'next/link';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import { Box, Chip } from '@mui/material';
dayjs.extend(isBetween);
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { AdminCalendarWrapper } from '@/components/calendar/AdminCalendarWrapper';
import { fetchVehicleDetails } from '@/app/actions/vehicles';
import type { Metadata } from 'next';

interface VehiclePageProps {
  params: Promise<{ vehicleID: string }>;
}

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const vehicleID = resolvedParams.vehicleID;

  const response = await fetchVehicleDetails(Number(vehicleID));
  const vehicle = response?.data;

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found | Fleetmaster',
      description: 'The requested vehicle could not be found.',
    };
  }

  return {
    title: `${vehicle.make} ${vehicle.model} ${vehicle.year} | Fleetmaster`,
    description: vehicle.description || `Rent or manage the ${vehicle.year} ${vehicle.make} ${vehicle.model} on Fleetmaster.`,
  };
}

const breadcrumbItems = [{ label: "Vehicles", href: "/vehicles" }];

const VehiclePage = async ({ params }: VehiclePageProps) => {
  const resolvedParams = await params;
  const vehicleID = resolvedParams.vehicleID;

  const response = await fetchVehicleDetails(Number(vehicleID));
  const VehicleDetails = response?.data;

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
          <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <AdminCalendarWrapper isMarkedUnavailable={VehicleDetails.status === "Not Available"} vehicleId={parseInt(vehicleID)} dateString={new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        {/* Details Section: col-span-7 */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {VehicleDetails.make} {VehicleDetails.model}
                </h2>
                <p className="text-gray-500">Body Type: {VehicleDetails.body_type} </p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-sm mt-2 mb-1 ${VehicleDetails.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                  {VehicleDetails.status}
                </span>
                <span className='px-3 bg-green-100 text-green-700 ms-3 py-1 rounded-full text-xs font-sm mt-2 mb-1'>Self Driven</span>
              </div>
            </div>

            <div className='relative'>
              <Box className='flex gap-2' sx={{ position: 'absolute', top: 10, right: 10 }}>
                <Chip sx={{ px: 1 }} variant='filled' color='primary' icon={<LocalGasStationOutlinedIcon fontSize='small' />} label={VehicleDetails.fuel_type} />
                <Chip sx={{ px: 1 }} variant='filled' color='primary' icon={<PeopleAltOutlinedIcon fontSize='small' />} label={VehicleDetails.seats + ' Seats'} />
              </Box>
              <img src={VehicleDetails.image_url} alt={`${VehicleDetails.make} ${VehicleDetails.model}`} className="w-full object-cover rounded-xl mb-8 aspect-video" />
            </div>

            <div>
              <p className="text-gray-400">Description</p>
              <p className='mt-3 text-gray-500 dark:text-white font-sm' >{VehicleDetails.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-y-4 mt-6">
              <div>
                <p className="text-gray-400">Year</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.year}</p>
              </div>
              <div>
                <p className="text-gray-400">Seats</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.seats}</p>
              </div>
              <div>
                <p className="text-gray-400">Exterior Color</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.color[0]}</p>
              </div>
              <div>
                <p className="text-gray-400">Interior Color</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.color[1]}</p>
              </div>
              <div>
                <p className="text-gray-400">Transmission</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.transmission}</p>
              </div>
              <div>
                <p className="text-gray-400">License Plate</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.license_plate.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-400">VIN</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.vin}</p>
              </div>
              <div>
                <p className="text-gray-400">Daily Rate</p>
                <p className="font-sm mt-2 mb-1 text-blue-600">Ksh. {VehicleDetails.daily_rate.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Location</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.location}</p>
              </div>
              <div>
                <p className="text-gray-400">Next Service Due</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.next_service_due}</p>
              </div>
              <div>
                <p className="text-gray-400">Minimum Rental Days</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.min_rental_days} days</p>
              </div>
            </div>
            <Link href={'/vehicles/' + vehicleID + '/edit'}>
              <Button className='w-full mt-5' size='sm'>Edit Vehicle Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VehiclePage;