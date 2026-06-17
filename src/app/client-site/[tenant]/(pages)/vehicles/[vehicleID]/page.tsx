"use client"
import { CalendarWrapper } from '@/components/calendar/CalendarWrapper';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import VehicleNotFound from '@/components/vehicles/NotFound';
import { useFleet } from '@/context/FleetContext';
import Link from 'next/link';
import { use } from 'react';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs, { Dayjs } from 'dayjs';
import { bookings } from '@/data/mockFleetData';
import Badge from '@/components/ui/badge/Badge';
import { Box, Chip, useAutocomplete } from '@mui/material';
dayjs.extend(isBetween);
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined"
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import { useUser } from '@/context/UserContext';

interface VehiclePageProps {
  params: Promise<{ vehicleID: string }>;
}

const breadcrumbItems = [{ label: "Vehicles", href: "/vehicles" }];

const VehiclePage = ({ params }: VehiclePageProps) => {
  const resolvedParams = use(params);
  const { vehicles } = useFleet();
  const { profile } = useUser();

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
    <main className="space-y-6 p-6 container m-auto">
      <PageBreadcrumb
        items={breadcrumbItems}
        pageTitle={`${VehicleDetails.make} ${VehicleDetails.model}`}
      />
      <div className="col-span-full bg-gray-200 dark:bg-gray-800 items-center flex gap-3 border dark:border-gray-500 rounded-xl mb-5 p-3">
        <img className="w-50" src={'https://indigocarhire.co.uk/wp-content/uploads/header_22-768x281.png'} alt="" /> <div>
          <h5 className="text-black dark:text-white font-semibold">Delivery & Airport Dropoffs</h5>
          <p className="text-gray-400">We offer Affordable delivery services and airport dropoffs</p>
          <p className="text-gray-500 text-xs mt-1">1,000 Ksh Within Nairobi | 1,500 Ksh Airport Dropoffs</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Calendar Section: col-span-5 */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <CalendarWrapper isMarkedUnavailable={VehicleDetails.status === "Not Available"} vehicleId={parseInt(vehicleID)} dateString={new Date().toISOString().split('T')[0]} />
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
                <p className="text-gray-500">Category: {VehicleDetails.category} | Body Type: {VehicleDetails.group}</p>
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
              <img src={VehicleDetails.imageUrl} alt={`${VehicleDetails.make} ${VehicleDetails.model}`} className="w-full object-cover object-center rounded-xl mb-8 aspect-video" />
            </div>

            <div>
              <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.description}</p>
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
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.licensePlate}</p>
              </div>
              <div>
                <p className="text-gray-400">Daily Rate</p>
                <p className="font-sm mt-2 mb-1 text-blue-600">Ksh. {VehicleDetails.dailyRate.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Location</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.location}</p>
              </div>

              <div>
                <p className="text-gray-400">Minimum Rental Days</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.minRentalDays} days</p>
              </div>

              <div>
                <p className="text-gray-400">Luggages/Carry-on</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{2} carry-ons</p>
              </div>
            </div>
            {
              profile ? 
            <Link href={'/vehicles/' + vehicleID + '/book'}>
              <Button className='w-full mt-5' size='sm'>Continue to Book</Button>
            </Link>: 
            <Link target='_blank' href={'/signin'}>
              <Button className='w-full mt-5' size='sm'>Continue to Book</Button>
            </Link>
            }
            <div className='flex items-center gap-3'>

              <Link className='w-full' href={'tel:+254768927617'}>
                <Button className='w-full mt-5' size='sm' variant='danger'>Call to Book <PhoneOutlinedIcon fontSize='small' /> </Button>
              </Link>
              <Link className='w-full' href={'https://wa.me/254768927617?text=I%20am%20interested%20in%20booking%20the%20' + VehicleDetails.make + '%20' + VehicleDetails.model + '%20' + location.origin + '/vehicles/' + vehicleID}>
                <Button className='w-full mt-5' size='sm' variant='success'>Book on WhatsApp <SmsOutlinedIcon fontSize='small' /> </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VehiclePage;