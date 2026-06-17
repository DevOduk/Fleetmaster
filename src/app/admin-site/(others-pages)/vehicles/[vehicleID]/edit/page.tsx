"use client"
import { CalendarWrapper } from '@/components/calendar/CalendarWrapper';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import VehicleNotFound from '@/components/vehicles/NotFound';
import { useFleet } from '@/context/FleetContext';
import { ChevronLeftIcon } from '@/icons';
import { Backdrop, Box, Chip, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { use, useState } from 'react';
import { toast, Toaster } from 'sonner';
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';


interface VehiclePageProps {
  params: Promise<{ vehicleID: string }>;
}



const EditVehiclePage = ({ params }: VehiclePageProps) => {
  const { vehicles, setVehicles, updateVehicle } = useFleet();
  const resolvedParams = use(params);
  const vehicleID = resolvedParams.vehicleID;

  const [backDrop, setBackDrop] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [VehicleDetails, setVehicleDetails] = useState<any>(vehicles.find(v => v.id === parseInt(vehicleID)) || {});

  if (!VehicleDetails) {
    return <VehicleNotFound />
  }
  const breadcrumbItems = [
    { label: "Vehicles", href: "/vehicles" },
    { label: VehicleDetails.make + ' ' + VehicleDetails.model, href: "/vehicles/" + vehicleID }
  ];


  const updateVehicles = () => {
    setDisableButton(true);
    setBackDrop(true);
    // Use .map to replace ONLY the vehicle that matches the ID
    setVehicles((prevVehicles) =>
      prevVehicles.map((v) =>
        v.id === parseInt(vehicleID) ? { ...VehicleDetails } : v
      )
    );

    setTimeout(() => {
      toast.success('Vehicle details updated successfully', { style: { color: 'green' } })
      setDisableButton(false);
      setBackDrop(false);
    }, 3000);

    // Optional: Add a success toast or redirect here
  };


  const updateAvailability = (status: string) => {
    setBackDrop(true);
    setTimeout(() => {
      updateVehicle(VehicleDetails.id, { ...VehicleDetails, status: status });
      setVehicleDetails((prev: any) => ({
        ...prev,
        status: status
      }))
      setBackDrop(false);
    }, 1000);
  }

  return (
    <main className="space-y-6 p-6">
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={backDrop}
        onClick={() => 2} ><CircularProgress color="inherit" /></Backdrop>
      <PageBreadcrumb
        items={breadcrumbItems}
        pageTitle={`Edit ${VehicleDetails.make} ${VehicleDetails.model}`}
      />

      <div className="flex gap-3 items-center mb-4">

        <Link href={"/vehicles/" + vehicleID} className="mr-2">
          <Button size="sm" variant="danger-outline">
            <ChevronLeftIcon />
            Back to Vehicle
          </Button>
        </Link>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Edit Vehicle {VehicleDetails.licensePlate}
        </h3>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* Calendar Section: col-span-5 */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <div className='flex justify-between items-center'>
              <div className='px-4 pt-4 '>
                <h3 className="font-semibold text-gray-800 dark:text-white">Service Schedule</h3>
                <p className="font-small text-sm text-gray-600 dark:text-gray-400">Find a snapshot of vehicles calendar booking status.</p>
              </div>
              {VehicleDetails.status === 'Available' ? <Button size="sm" variant='danger' className='text-nowrap' onClick={() => updateAvailability("Not Available")}>Mark Unavailable</Button> : <Button size="sm" variant='success' className='text-nowrap' onClick={() => updateAvailability("Available")}>Mark Available</Button>}
            </div>
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
                <p className="text-gray-500">Body Type: {VehicleDetails.category} </p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-sm mt-2 mb-1 ${VehicleDetails.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                  {VehicleDetails.status}
                </span>
                <span className='px-3 bg-green-100 text-green-700 ms-3 py-1 rounded-full text-xs font-sm mt-2 mb-1 ' color='success'>{VehicleDetails.driverType}</span>

              </div>
            </div>

            <div className='relative'>
              <Box className='flex gap-2' sx={{ position: 'absolute', top: 10, right: 10 }}>
                <Chip sx={{ px: 1 }} variant='filled' color='primary' icon={<LocalGasStationOutlinedIcon fontSize='small' />} label={VehicleDetails.fuelType} />
                <Chip sx={{ px: 1 }} variant='filled' color='primary' icon={<PeopleAltOutlinedIcon fontSize='small' />} label={VehicleDetails.seats + ' Seats'} />

              </Box>
              <img src={VehicleDetails.imageUrl} alt={`${VehicleDetails.make} ${VehicleDetails.model}`} className="w-full object-cover rounded-xl mb-8 aspect-video" />
            </div>

            <div className='p-2'>
              <p className="text-gray-400">Description</p>
              <TextArea value={VehicleDetails.description} className='mt-3'
                onChange={(e) => setVehicleDetails((prev: any) => ({
                  ...prev,
                  description: (e)
                }))} rows={4} />
            </div>


            <div className="grid grid-cols-2 gap-y-4 mt-6">
              <div className='p-2'>
                <p className="text-gray-400">Year</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.year}</p>
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Seats</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.seats}</p>
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Exterrior Color</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.color[0]}</p>
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Interrior Color</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.color[1]}</p>
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Transmission</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.transmission}</p>
              </div>
              <div className='p-2'>
                <p className="text-gray-400">License Plate</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.licensePlate}</p>
              </div>
              <div className='p-2'>
                <p className="text-gray-400">VIN</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.vin}</p>
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Daily Rate</p>
                <Input
                  id='minDays'
                  className='mt-3' step={100}
                  value={VehicleDetails.dailyRate}
                  type='number'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    dailyRate: Number(e.target.value)
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Location</p>
                <Select
                  options={[
                    { value: 'Nairobi Depot', label: 'Nairobi Depot' },
                    { value: 'Malindi Branch', label: 'Malindi Branch' },
                    { value: 'Nairobi Central', label: 'Nairobi Central' },
                    { value: 'Kisumu Branch', label: 'Kisumu Branch' },
                    { value: 'Nairobi Premium Garage', label: 'Nairobi Premium Garage' },
                    { value: 'Nakuru Warehouse', label: 'Nakuru Warehouse' }
                  ]}

                  defaultValue={VehicleDetails.location}
                  placeholder="Select an option"
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    location: (e)
                  }))}
                  className="dark:bg-dark-900 mt-3"
                />
              </div>

              <div className='p-2'>
                <p className="text-gray-400">Next Service Due</p>
                <Input
                  id='nextService'
                  className='mt-3'
                  value={VehicleDetails.nextServiceDue}
                  type='date'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    nextServiceDue: (e.target.value)
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Minimum Rental Days</p>

                <Input
                  id='minDays'
                  className='mt-3'
                  value={VehicleDetails.minRentalDays}
                  type='number'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    minRentalDays: Number(e.target.value)
                  }))}
                />              </div>

              <div className='p-2'>
                <p className="text-gray-400">Tracking Provider</p>
                <Select
                  options={[
                    {
                      value: 'Tramigo',
                      label: 'Tramigo'
                    },
                    {
                      value: 'Karooooo',
                      label: 'Karooooo'
                    },
                  ]}
                  placeholder="Select a provider"
                  defaultValue={VehicleDetails.tracker?.provider || ''}
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    tracker: {
                      provider: (e),
                      trackingApiUrl: null,
                    }
                  }))}
                  className="dark:bg-dark-900 mt-3"
                />            </div>
            </div>

            <div className={'mt-3 ' + (VehicleDetails.tracker.provider !== null ? '' : 'hidden')}>
              <p className="text-gray-400">Tracking API</p>

              <Input
                id='minDays'
                className='mt-3'
                placeholder='https://example.cpm/api/v1'
                value={VehicleDetails.tracker?.trackingApiUrl || ''}
                type='text'
                onChange={(e) => setVehicleDetails((prev: any) => ({
                  ...prev,
                  tracker: {
                    provider: VehicleDetails.tracker?.provider,
                    trackingApiUrl: e.target.value,
                  }
                }))}
              />              </div>
            <Button onClick={updateVehicles} disabled={disableButton} className='w-full mt-5' size='sm'>Update Vehicle</Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditVehiclePage;