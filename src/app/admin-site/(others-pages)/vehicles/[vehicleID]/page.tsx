"use client"
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import VehicleNotFound from '@/components/vehicles/NotFound';
import Link from 'next/link';
import { use } from 'react';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Chip } from '@mui/material';
dayjs.extend(isBetween);
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { useAdminFleet } from '@/context/AdminFleetContext';
import { useAdminBooking } from '@/context/AdminBookingContext';
import { AdminCalendarWrapper } from '@/components/calendar/AdminCalendarWrapper';


interface VehiclePageProps {
  params: Promise<{ vehicleID: string }>;
}

const breadcrumbItems = [{ label: "Vehicles", href: "/vehicles" }];

const VehiclePage = ({ params }: VehiclePageProps) => {
  const resolvedParams = use(params);
    const { bookings } = useAdminBooking();

  const { vehicles } = useAdminFleet();
  const vehicleID = resolvedParams.vehicleID;
  const VehicleDetails = vehicles.find(v => v.id === parseInt(vehicleID));
  const allVehicleBookings = bookings.filter((booking) => booking.vehicleId === parseInt(vehicleID))

  const bookedDateStrings = allVehicleBookings.flatMap((booking) => {
    const start = dayjs(booking.rentalStart);
    const end = dayjs(booking.rentalEnd);
    const days = [];

    let current = start;
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      days.push(current.format('YYYY-MM-DD'));
      current = current.add(1, 'day');
    }
    return days;
  });

  if (!VehicleDetails) {
    return <VehicleNotFound />
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
                <span className='px-3 bg-green-100 text-green-700 ms-3 py-1 rounded-full text-xs font-sm mt-2 mb-1 ' color='success'>Self Driven</span>

              </div>
            </div>

            <div className='relative'>
              <Box className='flex gap-2' sx={{ position: 'absolute', top: 10, right: 10 }}>
                <Chip sx={{ px: 1 }} variant='filled' color='primary' icon={<LocalGasStationOutlinedIcon fontSize='small' />} label={VehicleDetails.fuelType} />
                <Chip sx={{ px: 1 }} variant='filled' color='primary' icon={<PeopleAltOutlinedIcon fontSize='small' />} label={VehicleDetails.seats + ' Seats'} />

              </Box>
              <img src={VehicleDetails.image_url} alt={`${VehicleDetails.make} ${VehicleDetails.model}`} className="w-full object-cover rounded-xl mb-8 aspect-video" />
            </div>

            <div>
              <p className="text-gray-400">Description</p>
              <TextArea readOnly value={VehicleDetails.description} className='mt-3' />
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
                <p className="text-gray-400">Exterrior Color</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.color[0]}</p>
              </div>
              <div>
                <p className="text-gray-400">Interrior Color</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.color[1]}</p>
              </div>
              <div>
                <p className="text-gray-400">Transmission</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.transmission}</p>
              </div>
              <div>
                <p className="text-gray-400">License Plate</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.license_plate}</p>
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
              <Button className='w-full mt-5' size='sm'>Edit Vehicle Details</Button></Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VehiclePage;