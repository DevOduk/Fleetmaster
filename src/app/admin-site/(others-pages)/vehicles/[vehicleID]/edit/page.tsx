"use client"
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import VehicleNotFound from '@/components/vehicles/NotFound';
import { ChevronLeftIcon } from '@/icons';
import { Backdrop, Box, Chip, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { fetchVehicleDetails, updateVehicleDetails } from '@/app/actions/vehicles';
import { useAdminFleet } from '@/context/AdminFleetContext';
import { useToast } from '@/context/ToastContext';
import { AdminCalendarWrapper } from '@/components/calendar/AdminCalendarWrapper';
import { useUser } from '@/context/UserContext';
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined"
import CarModelsByBrand from '@/data/carMakeModels';

interface VehiclePageProps {
  params: Promise<{ vehicleID: string }>;
}



const EditVehiclePage = ({ params }: VehiclePageProps) => {
  const { setVehicles } = useAdminFleet();
  const { showToast } = useToast();
  const resolvedParams = use(params);
  const vehicleID = resolvedParams.vehicleID;
  const { profile } = useUser();
  const [loadingVehicle, setLoadingVehicle] = useState(false);
  const [backDrop, setBackDrop] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [VehicleDetails, setVehicleDetails] = useState<any>(null);
  const [originalVehicleDetails, setOriginalVehicleDetails] = useState<any>(null);

  useEffect(() => {
    if (!vehicleID) return;
    setLoadingVehicle(true);

    async function fetchAllVehicles() {
      try {
        const response = await fetchVehicleDetails(Number(vehicleID));

        if (!response.error) {
          setVehicleDetails(response.data);
          setOriginalVehicleDetails(response.data);
        } else {
          console.error("API Error fetching vehicle detailss:", response.error);
        }
      } catch (err) {
        console.error("Network connection failure:", err);
      } finally {
        setLoadingVehicle(false);
      }
    }

    fetchAllVehicles();
  }, [vehicleID]);


  const breadcrumbItems = [
    { label: "Vehicles", href: "/vehicles" },
    { label: VehicleDetails?.make + ' ' + VehicleDetails?.model, href: "/vehicles/" + vehicleID }
  ];


  const updateVehicles = async () => {
    setDisableButton(true);
    setBackDrop(true);


    const res = await updateVehicleDetails(Number(vehicleID), VehicleDetails);

    if (res.success) {
      // Use .map to replace ONLY the vehicle that matches the ID
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) =>
          v.id === parseInt(vehicleID) ? { ...VehicleDetails } : v
        )
      );

      setVehicleDetails(VehicleDetails);
      setOriginalVehicleDetails(VehicleDetails);

      setTimeout(() => {
        showToast('Vehicle details updated successfully', 'success')
        setDisableButton(false);
        setBackDrop(false);
      }, 3000);
    } else {
      setTimeout(() => {
        showToast(res.error.message, 'error')
        setDisableButton(false);
        setBackDrop(false);
      }, 3000);
    }
  };


  const updateAvailability = async (status: string) => {
    setBackDrop(true);
    const res = await updateVehicleDetails(VehicleDetails?.id, { ...VehicleDetails, status: status });

    if (res.success) {
      showToast('Vehicle status updated successfully', 'success')
      setVehicleDetails((prev: any) => ({
        ...prev,
        status: status
      }));
      setOriginalVehicleDetails((prev: any) => ({
        ...prev,
        status: status
      }));
      setBackDrop(false);
    } else {
      showToast('An error ocuured while updating vehicle status!', 'error')
      setBackDrop(false);
    }
  }

  if (loadingVehicle) {
    return <div>Fetching vehicle details</div>
  }
  if (!VehicleDetails) {
    return <VehicleNotFound />
  }

  return (
    <main className="space-y-6 p-6">
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={backDrop}
        onClick={() => 2} ><CircularProgress color="inherit" /></Backdrop>
      <PageBreadcrumb
        items={breadcrumbItems}
        pageTitle={`Edit ${VehicleDetails?.make} ${VehicleDetails?.model}`}
      />

      <div className="flex gap-3 items-center mb-4">

        <Link href={"/vehicles/" + vehicleID} className="mr-2">
          <Button size="sm" variant="danger-outline">
            <ChevronLeftIcon />
            Back to Vehicle
          </Button>
        </Link>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Edit Vehicle {VehicleDetails?.licensePlate}
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
              {VehicleDetails?.status === 'Available' ? <Button size="sm" variant='danger' className='text-nowrap' onClick={() => updateAvailability("Not Available")}>Mark Unavailable</Button> : <Button size="sm" variant='success' className='text-nowrap' onClick={() => updateAvailability("Available")}>Mark Available</Button>}
            </div>
            <AdminCalendarWrapper isMarkedUnavailable={VehicleDetails?.status === "Not Available"} vehicleId={parseInt(vehicleID)} dateString={new Date().toISOString().split('T')[0]} />
            {
              VehicleDetails?.status === 'Available' ? <div className='text-sm text-green-500 mb-2 text-center'>This vehicle is now available for bookings!</div> : <div className='text-sm text-red-500 mb-2 text-center'>This vehicle will NOT be available for bookings!</div>
            }
          </div>
        </div>

        {/* Details Section: col-span-7 */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {VehicleDetails?.make} {VehicleDetails?.model} {VehicleDetails?.year}
                </h2>
                <p className="text-gray-500">Body Type: {VehicleDetails?.bofy_type} </p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-sm mt-2 mb-1 ${VehicleDetails?.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                  {VehicleDetails?.status}
                </span>
                <span className='px-3 bg-green-100 text-green-700 ms-3 py-1 rounded-full text-xs font-sm mt-2 mb-1 ' color='success'>{VehicleDetails?.driver_type}</span>

              </div>
            </div>

            <div className='relative'>
              <Box className='flex gap-2' sx={{ position: 'absolute', top: 10, right: 10 }}>
                <Chip sx={{ px: 1 }} variant='filled' color='primary' icon={<LocalGasStationOutlinedIcon fontSize='small' />} label={VehicleDetails?.fuel_type} />
                <Chip sx={{ px: 1 }} variant='filled' color='primary' icon={<PeopleAltOutlinedIcon fontSize='small' />} label={VehicleDetails?.seats + ' Seats'} />

              </Box>
              <button className='border-0 outline-0 text-sm flex items-center gap-2 cursor-pointer absolute bottom-3 right-3 bg-black/50 rounded-lg p-2 px-3 text-white'>
                <AddPhotoAlternateOutlinedIcon /> Change Photo
              </button>
              <img src={VehicleDetails?.image_url} alt={`${VehicleDetails?.make} ${VehicleDetails?.model}`} className="w-full object-cover rounded-xl mb-8 aspect-video" />
            </div>

            <div className='p-2'>
              <p className="text-gray-400">Description</p>
              <TextArea value={VehicleDetails?.description} className='mt-3'
                onChange={(e) => setVehicleDetails((prev: any) => ({
                  ...prev,
                  description: (e)
                }))} rows={4} />
            </div>


            <div className="grid grid-cols-2 gap-y-4 mt-6">

              <div className='p-2'>
                <p className="text-gray-400">Make</p>
                <Select
                  options={Object.keys(CarModelsByBrand || {}).map((brand) => ({
                    value: brand,
                    label: brand
                  }))}

                  defaultValue={VehicleDetails?.make}
                  value={VehicleDetails?.make}
                  placeholder="Change make"
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    make: (e)
                  }))}
                  className="dark:bg-dark-900 mt-3"
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Model</p>
                
                <Select
                  options={(CarModelsByBrand[VehicleDetails?.make]).map((model) => ({
                    value: model,
                    label: model
                  }))}

                  defaultValue={VehicleDetails?.model}
                  value={VehicleDetails?.model}
                  placeholder="Change model and trim"
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    model: (e)
                  }))}
                  className="dark:bg-dark-900 mt-3"
                />
              </div>
              
              <div className='p-2'>
                <p className="text-gray-400">Category</p>
                <Input
                  id='category'
                  list='categories-list' // Links to the datalist id
                  className='mt-3'
                  step={1}
                  value={VehicleDetails?.category} // Fixed bug (was .year)
                  type='text'
                  placeholder='e.g Economy'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    category: (e.target.value)
                  }))}
                />
                <datalist id='categories-list'>
                  {/* Standard Industry Categories */}
                  <option value="Mini" />
                  <option value="Economy" />
                  <option value="Compact" />
                  <option value="Intermediate / Midsize" />
                  <option value="Standard" />
                  <option value="Full-Size" />
                  <option value="Premium" />
                  <option value="Luxury / Exotic" />
                  <option value="Compact SUV" />
                  <option value="Intermediate SUV" />
                  <option value="Full-Size SUV" />
                  <option value="Minivan / Passenger Van" />
                  <option value="Pickup Truck" />
                  <option value="Convertible" />
                  <option value="Electric Vehicle (EV)" />
                </datalist>
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Body Type</p>
                <Input
                  id='body'
                  list='body-types-list' // Links to the datalist id
                  className='mt-3'
                  value={VehicleDetails?.body_type}
                  type='text'
                  placeholder='e.g Sedan'
                  onChange={(e) => setVehicleDetails((prev: any) => ({ ...prev, body_type: (e.target.value) }))}
                />
                <datalist id='body-types-list'>
                  <option value="Sedan" />
                  <option value="SUV" />
                  <option value="Hatchback" />
                  <option value="Coupe" />
                  <option value="Convertible" />
                  <option value="Station Wagon" />
                  <option value="Minivan" />
                  <option value="Pickup Truck" />
                  <option value="Van" />
                </datalist>
              </div>

              <div className='p-2'>
                <p className="text-gray-400">Year</p>
                <Input
                  id='minDays'
                  className='mt-3' step={1}
                  value={VehicleDetails?.year}
                  type='number'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    year: Number(e.target.value)
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Seats</p>
                <Input
                  id='minDays'
                  className='mt-3' step={1}
                  value={VehicleDetails?.seats}
                  type='number'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    seats: Number(e.target.value)
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Exterrior Color</p>
                <Input
                  id='license_plate'
                  className='mt-3' step={100}
                  value={VehicleDetails?.color?.[0]}
                  type='text'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    color: [(e.target.value), VehicleDetails.color?.[1],]
                  }))}
                />              </div>
              <div className='p-2'>
                <p className="text-gray-400">Interrior Color</p>
                <Input
                  id='license_plate'
                  className='mt-3' step={100}
                  value={VehicleDetails?.color?.[1]}
                  type='text'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    color: [VehicleDetails.color?.[0], (e.target.value)]
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Transmission</p>
                <div className="font-sm mt-2 mb-1 dark:text-white flex gap-3">
                  {
                    ['Automatic', 'Manual', 'Automatic/Manual'].map((t) => <span className={`py-2 text-sm px-4 rounded-lg cursor-pointer ${t === VehicleDetails?.transmission ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                      onClick={() => setVehicleDetails((prev: any) => ({
                        ...prev,
                        transmission: t
                      }))}>{t}</span>
                    )
                  }
                </div>
              </div>

              <div className='p-2'>
                <p className="text-gray-400">Driver Type</p>
                <div className="font-sm mt-2 mb-1 dark:text-white flex gap-3">
                  {
                    ["Self Drive", "Chauffeured"].map((t) => <span className={`py-2 text-sm px-4 rounded-lg cursor-pointer ${t === VehicleDetails?.driver_type ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                      onClick={() => setVehicleDetails((prev: any) => ({
                        ...prev,
                        driver_type: t
                      }))}>{t}</span>
                    )
                  }
                </div>
              </div>
              <div className='p-2'>
                <p className="text-gray-400">License Plate</p>
                <Input
                  id='license_plate'
                  className='mt-3' step={100}
                  value={VehicleDetails?.license_plate}
                  type='text'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    license_plate: (e.target.value)
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">VIN</p>

                <Input
                  id='vin'
                  className='mt-3' step={100}
                  value={VehicleDetails?.vin}
                  type='text'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    vin: (e.target.value)
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Change Daily Rate</p>
                <Input
                  id='minDays'
                  className='mt-3' step={100}
                  value={VehicleDetails?.daily_rate}
                  type='number'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    daily_rate: Number(e.target.value)
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Location</p>
                <Select
                  options={profile?.fleetmaster_tenants?.yards?.map((y) => `${y.title}`).map(l => {
                    return {
                      value: l,
                      label: l
                    }
                  })}

                  defaultValue={VehicleDetails?.location}
                  value={VehicleDetails?.location}
                  placeholder="Change location"
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
                  value={VehicleDetails?.next_service_due}
                  type='date'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    next_service_due: (e.target.value)
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Minimum Rental Days</p>

                <Input
                  id='minDays'
                  className='mt-3'
                  value={VehicleDetails?.min_rental_days}
                  type='number'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    min_rental_days: Number(e.target.value)
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
                  defaultValue={VehicleDetails?.tracker?.provider || ''}
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

            <div className={'mt-3 ' + (VehicleDetails?.tracker.provider !== null ? '' : 'hidden')}>
              <p className="text-gray-400">Tracking API</p>

              <Input
                id='minDays'
                className='mt-3'
                placeholder='https://example.cpm/api/v1'
                value={VehicleDetails?.tracker?.trackingApiUrl || ''}
                type='text'
                onChange={(e) => setVehicleDetails((prev: any) => ({
                  ...prev,
                  tracker: {
                    provider: VehicleDetails?.tracker?.provider,
                    trackingApiUrl: e.target.value,
                  }
                }))}
              />              </div>
            <Button onClick={updateVehicles} disabled={disableButton || (VehicleDetails === originalVehicleDetails)} className='w-full mt-5' size='sm'>Update Vehicle</Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditVehiclePage;