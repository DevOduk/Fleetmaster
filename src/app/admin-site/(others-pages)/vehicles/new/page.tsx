"use client"
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { ChevronLeftIcon } from '@/icons';
import { Backdrop, Box, Chip, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { createVehicleForTenant } from '@/app/actions/vehicles';
import { useAdminFleet } from '@/context/AdminFleetContext';
import { useToast } from '@/context/ToastContext';
import { useUser } from '@/context/UserContext';
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined"
import CarModelsByBrand from '@/data/carMakeModels';
import { createClient } from '@/utils/supabase/client';

interface VehiclePageProps {
  params: Promise<{ vehicleID: string }>;
}



const NewVehiclePage = ({ params }: VehiclePageProps) => {
  const supabase = createClient();
  const { setVehicles } = useAdminFleet();
  const { showToast } = useToast();
  const resolvedParams = use(params);
  const vehicleID = resolvedParams.vehicleID;
  const { profile } = useUser();
  const [backDrop, setBackDrop] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [VehicleDetails, setVehicleDetails] = useState<any>({ driver_type: 'Self Drive', transmission: 'Automatic' });

  const validateVehicleDetails = (details) => {
    const fields = [
      { key: 'make', label: 'Make' },
      { key: 'model', label: 'Model' },
      { key: 'year', label: 'Year', validate: (v) => v > 0 },
      { key: 'license_plate', label: 'License Plate' },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description' },
      { key: 'transmission', label: 'Transmission' },
      { key: 'fuel_type', label: 'Fuel Type' },
      { key: 'driver_type', label: 'Driver Type' },
      { key: 'location', label: 'Location' },
      { key: 'next_service_due', label: 'Service Due Date' },
      { key: 'seats', label: 'Seats', validate: (v) => v > 0 },
      { key: 'image_url', label: 'Image' },
      { key: 'body_type', label: 'Body Type' }
    ];

    for (const field of fields) {
      const value = details?.[field.key];
      const isInvalid = field.validate ? !field.validate(value) : !value?.toString().trim();

      if (isInvalid) {
        showToast(`${field.label} is missing or invalid!`, 'error');
        return false;
      }
    }
    return true;
  };

  const breadcrumbItems = [
    { label: "Vehicles", href: "/vehicles" },
  ];


  const handleCreateVehicle = async () => {
    // if any of these key items are missing return and showerror toast tenant_id, make, model, year, license_place
    if (!validateVehicleDetails(VehicleDetails)) return;

    setDisableButton(true);
    setBackDrop(true);


    const res = await createVehicleForTenant({ ...VehicleDetails, tenant_id: profile?.tenant_id, owner: profile?.fleetmaster_tenants?.name });

    if (res.success) {
      setVehicles((prevVehicles) => [...prevVehicles, res.data]);

      setTimeout(() => {
        showToast('New Vehicle has been created successfully', 'success')
        setDisableButton(false);
        setBackDrop(false);
        setVehicleDetails(null);
      }, 3000);
    } else {
      setTimeout(() => {
        showToast(res.error.message, 'error')
        setDisableButton(false);
        setBackDrop(false);
      }, 3000);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if ((file.size / (1024 * 1024)) > 20) {
      showToast('Image file (PNG, WEBP, JPEG) must be 20MB or below!', 'error');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    console.log(VehicleDetails)
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      showToast('Please select a valid image file (PNG, WEBP, JPEG)!', 'error');
      return;
    }

    try {
      // 1. Upload file to Supabase bucket (replace 'your-bucket-name' with yours)
      const fileExt = file.name.split('.').pop();
      const fileName = `Images/${Math.random()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('fleetmaster_files')
        .upload(fileName, file);
      if (error) throw error;

      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fleetmaster_files')
        .getPublicUrl(fileName);

      console.log(publicUrl)
      // 3. Update state
      setVehicleDetails({ ...VehicleDetails, image_url: publicUrl });

    } catch (error) {
      showToast(error.message, 'error')
      console.error('Error uploading image:', error.message);
    }
  };

  return (
    <main className="space-y-6 p-6">
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={backDrop}
        onClick={() => 2} ><CircularProgress color="inherit" /></Backdrop>
      <PageBreadcrumb
        items={breadcrumbItems}
        pageTitle={`Create New Vehicle`}
      />

      <div className="flex gap-3 items-center mb-4">

        <Link href={"/vehicles"} className="mr-2">
          <Button size="sm" variant="danger-outline">
            <ChevronLeftIcon />
            Back to Vehicles
          </Button>
        </Link>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          New Vehicle
        </h3>
      </div>
      <div className="">

        {/* Details Section: col-span-7 */}
        <div className="max-w-5xl mx-auto lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {VehicleDetails?.make} {VehicleDetails?.model} {VehicleDetails?.year}
                </h2>
                <p className="text-gray-500">Body Type: {VehicleDetails?.category || 'Enter body type'} </p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-sm mt-2 mb-1 ${VehicleDetails?.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                  {VehicleDetails?.status || 'Default'}
                </span>
                <span className='px-3 bg-green-100 text-green-700 ms-3 py-1 rounded-full text-xs font-sm mt-2 mb-1 ' color='success'>{VehicleDetails?.driver_type}</span>

              </div>
            </div>

            <div className='relative'>
              <Box className='flex gap-2' sx={{ position: 'absolute', top: 10, right: 10 }}>
                <Chip sx={{ px: 1 }} variant='filled' color='primary' icon={<LocalGasStationOutlinedIcon fontSize='small' />} label={VehicleDetails?.fuel_type || 'Petrol'} />
                <Chip sx={{ px: 1 }} variant='filled' color='primary' icon={<PeopleAltOutlinedIcon fontSize='small' />} label={VehicleDetails?.seats || 0 + ' Seats'} />

              </Box>
              <label className='border-0 outline-0 text-sm flex items-center gap-2 cursor-pointer absolute bottom-3 right-3 bg-black/50 rounded-lg p-2 px-3 text-white'>
                <input
                  type='file'
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <AddPhotoAlternateOutlinedIcon /> Upload Photo
              </label>
              <img src={VehicleDetails?.image_url || '/images/default-yard.png'} alt={``} className="w-full object-cover rounded-xl mb-8 aspect-video" />
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
                  placeholder="Select vehicle make"
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
                  options={(CarModelsByBrand[VehicleDetails?.make] || [])?.map((model) => ({
                    value: model,
                    label: model
                  }))}

                  defaultValue={VehicleDetails?.model}
                  value={VehicleDetails?.model}
                  placeholder="Select model and trim"
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
                  step={1}
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
                <p className="text-gray-400">Fuel Type</p>
                <div className="font-sm mt-2 mb-1 dark:text-white flex flex-wrap gap-3">
                  {
                    ["Petrol/Gasoline", "Diesel", "Hybrid", "Electric", "Petrol/Hybrid"].map((t) => <span className={`py-2 text-sm px-4 rounded-lg cursor-pointer ${t === VehicleDetails?.fuel_type ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                      onClick={() => setVehicleDetails((prev: any) => ({
                        ...prev,
                        fuel_type: t
                      }))}>{t}</span>
                    )
                  }
                </div>
              </div>

              <div className='p-2'>
                <p className="text-gray-400">Year</p>
                <Input
                  id='year'
                  className='mt-3' step={1}
                  value={VehicleDetails?.year}
                  type='number'
                  placeholder='e.g 2020'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    year: Number(e.target.value)
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Seats</p>
                <Input
                  id='seats'
                  className='mt-3' step={1}
                  value={VehicleDetails?.seats || 0}
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
                  id='color0'
                  className='mt-3' step={100}
                  value={VehicleDetails?.color?.[0]}
                  type='text'
                  placeholder='e.g White'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    color: [(e.target.value), VehicleDetails.color?.[1],]
                  }))}
                />              </div>
              <div className='p-2'>
                <p className="text-gray-400">Interrior Color</p>
                <Input
                  id='color1'
                  className='mt-3' step={100}
                  value={VehicleDetails?.color?.[1]}
                  type='text'
                  placeholder='e.g Brown'
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
                  placeholder='e.g KAA 123A'
                  value={VehicleDetails?.license_plate?.toUpperCase()}
                  type='text'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    license_plate: (e.target.value)?.toUpperCase()
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">VIN</p>

                <Input
                  id='vin'
                  className='mt-3' step={100}
                  placeholder='e.g 1HGCR2F8XHA000001'
                  value={VehicleDetails?.vin?.toUpperCase()}
                  type='text'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    vin: (e.target.value)?.toUpperCase()
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Set Daily Rate</p>
                <Input
                  id='minDays'
                  className='mt-3' step={100}
                  value={VehicleDetails?.daily_rate}
                  type='number'
                  placeholder='e.g 4,500'
                  onChange={(e) => setVehicleDetails((prev: any) => ({
                    ...prev,
                    daily_rate: Number(e.target.value)
                  }))}
                />
              </div>
              <div className='p-2'>
                <p className="text-gray-400">Location (Cant't find location? Create one <Link target='_blank' href={'/yards'} className='text-brand-500'>Here</Link>)</p>
                <Select
                  options={profile?.fleetmaster_tenants?.yards?.map((y) => `${y.title}`).map(l => {
                    return {
                      value: l,
                      label: l
                    }
                  })}

                  defaultValue={VehicleDetails?.location}
                  value={VehicleDetails?.location}
                  placeholder="Select a location"
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
                />
              </div>

              <div className='p-2 hidden'>
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
                />
              </div>
            </div>

            <div className={'mt-3 ' + (!VehicleDetails?.tracker?.provider?.trim() ? 'hidden' : 'block')}>
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
              />
            </div>

            <div className='p-2'>
              <p className="text-gray-400">Description</p>
              <TextArea value={VehicleDetails?.description} className='mt-3'
                onChange={(e) => setVehicleDetails((prev: any) => ({
                  ...prev,
                  description: (e)
                }))} rows={4} />
            </div>

            <Button onClick={handleCreateVehicle} disabled={disableButton} className='w-full mt-5' size='sm'>Update Vehicle</Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewVehiclePage;