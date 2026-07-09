"use client"
import { CalendarWrapper } from '@/components/calendar/CalendarWrapper';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import VehicleNotFound from '@/components/vehicles/NotFound';
import { useFleet } from '@/context/FleetContext';
import Link from 'next/link';
import { use, useMemo, useState } from 'react';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs, { Dayjs } from 'dayjs';
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"
import ScheduleIcon from "@mui/icons-material/Schedule"
import { Box, Chip } from '@mui/material';
dayjs.extend(isBetween);
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined"
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import { useUser } from '@/context/UserContext';
import { useTenant } from '@/context/TenantContext';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { useBooking } from '@/context/BookingContext';
import DeliveryBanner from '@/components/client-components/DeliveryBanner';

interface VehiclePageProps {
  params: Promise<{ vehicleID: string }>;
}

const breadcrumbItems = [{ label: "Vehicles", href: "/vehicles" }];

const syncTimeToDateString = (dateTarget: string, sourceDateTime: string): string => {
  if (!sourceDateTime || !dateTarget) return dateTarget;

  // Extract the time portion (everything after the 'T')
  const [, timeComponent] = sourceDateTime.split("T");
  // Extract the date portion of the target string
  const [dateComponent] = dateTarget.split("T");

  if (!timeComponent || !dateComponent) return dateTarget;

  return `${dateComponent}T${timeComponent}`;
};

const VehiclePage = ({ params }: VehiclePageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const { vehicles, loading } = useFleet();
  const { showToast } = useToast();
  const { profile } = useUser();
  const { tenant } = useTenant();
  const { bookings } = useBooking();

  const fallbackStart = dayjs().add(1, 'day').format('YYYY-MM-DD[T]HH:mm');

  // 2 days after tomorrow (3 days total) at the exact same hour and minute
  const fallbackEnd = dayjs().add(3, 'day').format('YYYY-MM-DD[T]HH:mm');

  const [start, setStart] = useState(searchParams.get('start') ? searchParams.get('start') : fallbackStart);
  const [end, setEnd] = useState(searchParams.get('end') ? searchParams.get('end') : fallbackEnd);
  const [expandBreakdown, setExpandBreakdown] = useState(false);

  const vehicleID = resolvedParams.vehicleID;
  const VehicleDetails = vehicles.find(v => v.id === parseInt(vehicleID));


  // Calculate all booked date strings for this vehicle
  const bookedDates = useMemo(() => {
    if (loading) return;

    const vehicleBookings = bookings?.filter((b) => b.vehicleId === Number(vehicleID));
    const vehicleBookedDates = vehicleBookings.filter((b) => b.booking_status === "Booked");

    return vehicleBookedDates.flatMap((booking) => {
      const start = dayjs(booking.rentalStart);
      const end = dayjs(booking.rentalEnd);
      const days = [];
      let current = start;

      while (current.isBefore(end) || current.isSame(end, "day")) {
        days.push(current.format("YYYY-MM-DD"));
        current = current.add(1, "day");
      }
      return days;
    });
  }, [vehicleID, bookings]);




  const totalDays = useMemo(() => {
    const startDay = dayjs(start);
    const endDay = dayjs(end);

    const dayGap = startDay.isValid() && endDay.isValid() ? endDay.diff(start, "day") : 0;

    return dayGap <= 0 ? 1 : dayGap;
  }, [start, end]);

  if (loading) {
    return (
      <main className="space-y-6 p-6 container m-auto animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-6" />

        {/* Banner Alert Promos Skeleton */}
        <div className="col-span-full h-24 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl mb-5" />

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel: Calendar Skeleton (col-span-5) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm h-80 flex flex-col justify-between">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto" />
              <div className="grid grid-cols-7 gap-2 mt-4">
                {Array.from({ length: 28 }).map((_, idx) => (
                  <div key={idx} className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Date Inputs Form Fields Skeletons */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
              <div className="h-11 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
              <div className="h-11 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
            </div>
          </div>

          {/* Right Panel: Specifications View Skeleton (col-span-7) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm space-y-6">

              {/* Header Title Information */}
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-1/2">
                  <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-16" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20" />
                </div>
              </div>

              {/* Main Vector Image Area */}
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-xl aspect-video" />

              {/* Description Paragraph Blocks */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              </div>

              {/* Specifications Matrix Metadata Grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  </div>
                ))}
              </div>

              {/* Action Buttons Layer */}
              <div className="space-y-3 pt-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
                <div className="flex gap-3">
                  <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!VehicleDetails) {
    return <VehicleNotFound />
  }

  // --- DYNAMIC FINANCIAL CALCULATIONS ---
  const dynamicDays = totalDays <= 0 ? 1 : totalDays;
  const baseRateTotal = dynamicDays * VehicleDetails.daily_rate;
  const rescuePlanFee = 200;
  const subTotalBeforeVat = baseRateTotal + rescuePlanFee;
  const vatAmount = Math.round(subTotalBeforeVat * 0.16);
  const grandTotalAmount = subTotalBeforeVat + vatAmount;

  return (
    <main className="p-6 container m-auto">
      <PageBreadcrumb
        items={breadcrumbItems}
        pageTitle={`${VehicleDetails.make} ${VehicleDetails.model}`}
      />
      <DeliveryBanner />

      <div className="grid grid-cols-[1fr_auto_1fr] border items-center border-gray-300 dark:border-gray-700 rounded gap-x-4 gap-y-3 text-sm mt-3 mb-2 p-2">
        {/* Row 1 */}
        <h4 className="font-semibold text-gray-800 text-theme-l dark:text-white/90 lg:text-l">
          Total Amount:
        </h4>
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
        <div className="text-right m-0 p-0 font-bold text-green-600 dark:text-green-400">
          KSH. {grandTotalAmount.toLocaleString()}
        </div>
      </div>
      <p role='button' className='font-medium text-right text-xs text-brand-400 mt-0 mb-4 underline' onClick={() => setExpandBreakdown(!expandBreakdown)}>{expandBreakdown ? 'Collapse' : 'Expand'} Cost Breakdown?</p>

      {
        expandBreakdown &&
        <div className="flex ms-auto dark:bg-gray-800 bg-gray-200 rounded-2xl top-0 lg:w-130 w-full gap-2 flex-col col-span-12 lg:col-span-3 mb-5">
          <h4 className="mt-4 px-3 text-right font-semibold text-gray-800 modal-title text-theme-l dark:text-white/90 lg:text-l">
            Booking Summary</h4>
          <div className="mt-2 p-2 px-3 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/30">
            <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Cost Breakdown</h3>

            {/* Grid Wrapper */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-3 text-sm items-center">

              {/* Row 1 */}
              <div className="text-left text-gray-500 dark:text-gray-400">Duration</div>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
              <div className="text-right font-medium text-gray-800 dark:text-gray-200">{dynamicDays} Days</div>

              {/* Row 2 */}
              <div className="text-left text-gray-500 dark:text-gray-400">Daily Rate</div>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
              <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                Ksh. {VehicleDetails.daily_rate.toLocaleString()}
              </div>

              {/* Row 3 */}
              <div className="text-left text-gray-500 dark:text-gray-400">Delivery + Pickup fee</div>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
              <div className="text-right font-medium text-gray-800 dark:text-gray-200">Ksh. 0</div>

              {/* Row 4 */}
              <div className="text-left text-gray-500 dark:text-gray-400">Rescue Plan</div>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
              <div className="text-right font-medium text-gray-800 dark:text-gray-200">Ksh. {rescuePlanFee}</div>

              {/* Row 5 */}
              <div className="text-left text-gray-500 dark:text-gray-400">VAT 16%</div>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
              <div className="text-right font-medium text-gray-800 dark:text-gray-200">Ksh. {vatAmount.toLocaleString()}</div>

              {/* Horizontal Divider Span across all 3 columns */}
              <div className="col-span-3 border-t border-gray-200 my-1 dark:border-gray-800" />

              {/* Grand Total Row */}
              <div className="text-left font-bold text-gray-800 dark:text-gray-100">Total</div>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-700" />
              <div className="text-right text-base font-bold text-green-600 dark:text-green-500">
                Ksh. {grandTotalAmount.toLocaleString()}
              </div>

            </div>
          </div>
        </div>
      }

      <div className="grid grid-cols-12 gap-6">
        {/* Calendar Section: col-span-5 */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <CalendarWrapper isMarkedUnavailable={VehicleDetails.status === "Not Available"} vehicleId={parseInt(vehicleID)} dateString={new Date().toISOString().split('T')[0]} />
          </div>

          {/* Price Range Fields */}
          <div className="mb-2">
            <p className="mb-2 text-black dark:text-white">Rental Dates (All Times in {tenant?.timezone || 'Nairobi (UTC+3)'})</p>
            <div className="grid grid-cols-1 gap-3 mt-4 mb-8">
              <div className="col-span-6 lg:col-span-12">
                <Label>Start Date</Label>
                <div className="relative mt-2">
                  <Input
                    type="datetime-local"
                    className="pl-15.5 text-inherit"
                    value={start ? dayjs(start).format('YYYY-MM-DDTHH:mm') : ''} onChange={(e) => {
                      const newStart = e.target.value; // e.g., "2026-06-25T16:00"
                      const updatedEnd = syncTimeToDateString(end, newStart);
                      setStart(newStart);
                      setEnd(updatedEnd);
                    }}
                    name="end_date"
                  />

                  <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <CalendarMonthOutlinedIcon />
                  </span>
                </div>
              </div>
              <div className="col-span-6 lg:col-span-12">
                <Label>End Date</Label>
                <div className="relative mt-2">
                  <Input
                    type="datetime-local"
                    className="pl-15.5 "
                    value={end ? dayjs(end).format('YYYY-MM-DDTHH:mm') : ''} onChange={(e) => {
                      const newEnd = e.target.value; // e.g., "2026-06-25T16:00"
                      const updatedStart = syncTimeToDateString(start, newEnd);
                      setStart(updatedStart);
                      setEnd(newEnd);
                    }}
                    name="end_date"
                  />

                  <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <CalendarMonthOutlinedIcon />
                  </span>
                </div>
              </div>
              <div className="col-span-12">
                <Label>Days</Label>
                <div className="relative mt-2">
                  <div
                    className="pl-15.5 h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                  >
                    {totalDays} Days
                  </div>

                  <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <ScheduleIcon />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section: col-span-7 */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {VehicleDetails.year} {VehicleDetails.make} {VehicleDetails.model}
                </h2>
                <p className="text-gray-500">Category: {VehicleDetails.category} | Body Type: {VehicleDetails.group}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-sm mt-2 mb-1 ${VehicleDetails.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                  {VehicleDetails.status}
                </span>
                <span className='px-3 bg-green-100 text-green-700 ms-3 py-1 rounded-full text-xs font-sm mt-2 mb-1 '>Self Driven</span>

              </div>
            </div>

            <div className='relative'>
              <Box className='flex gap-2' sx={{ position: 'absolute', top: 10, right: 10 }}>
                <Chip sx={{ px: 1 }} variant='filled' color='primary' icon={<LocalGasStationOutlinedIcon fontSize='small' />} label={VehicleDetails.fuel_type} />
                <Chip sx={{ px: 1 }} variant='filled' color='primary' icon={<PeopleAltOutlinedIcon fontSize='small' />} label={VehicleDetails.seats + ' Seats'} />

              </Box>
              <img src={VehicleDetails.image_url} alt={''} className="w-full object-cover object-center rounded-xl mb-8 aspect-video" />
            </div>

            <div>
              <p className="font-sm mt-2 mb-1 dark:text-gray-400">{VehicleDetails.description}</p>
            </div>


            <div className="grid grid-cols-2 gap-y-4 mt-6">
              <div>
                <p className="text-gray-400">Year</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.year}</p>
              </div>
              <div>
                <span className="text-gray-400">Seats</span>
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
                <p className="text-gray-400">Daily Rate</p>
                <p className="font-sm mt-2 mb-1 text-blue-600">Ksh. {VehicleDetails.daily_rate.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Location</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.location}</p>
              </div>

              <div>
                <p className="text-gray-400">Minimum Rental Days</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{VehicleDetails.min_rental_days} days</p>
              </div>

              <div>
                <p className="text-gray-400">Luggages/Carry-on</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">{2} carry-ons</p>
              </div>

              <div>
                <p className="text-gray-400">Baby Seats</p>
                <p className="font-sm mt-2 mb-1 dark:text-white">Available on request</p>
              </div>
            </div>
            {
              profile ?
                <div
                  onClick={() => {
                    const today = dayjs(new Date()).startOf('day');
                    const startDay = dayjs(start).startOf('day');
                    const endDay = dayjs(end).startOf('day');

                    const totalDaysCalculated = startDay.isValid() && endDay.isValid()
                      ? endDay.diff(startDay, "day")
                      : 0;

                    // 1. Basic validation checks
                    if (totalDaysCalculated < 1 || endDay.isBefore(startDay) || startDay.isBefore(today)) {
                      showToast('Please select a valid date!', 'warning');
                      return;
                    }

                    if (totalDaysCalculated < Number(VehicleDetails?.min_rental_days)) {
                      showToast('Please select a minimum of ' + VehicleDetails?.min_rental_days + ' days!', 'error');
                      return;
                    }

                    // --- 2. NEW OVERLAP CHECK INTERCEPTION ---
                    let isOverlapping = false;
                    let checkDay = startDay;

                    // Loop through each day of the user's current selection
                    while (checkDay.isBefore(endDay) || checkDay.isSame(endDay, 'day')) {
                      const formattedCheckDay = checkDay.format('YYYY-MM-DD');

                      // If the current day string matches an array item in your memoized bookedDates...
                      if (bookedDates?.includes(formattedCheckDay)) {
                        isOverlapping = true;
                        break; // Exit loop immediately upon finding a conflict
                      }
                      checkDay = checkDay.add(1, 'day');
                    }

                    if (isOverlapping) {
                      showToast('This vehicle is already booked for some of your selected dates!', 'error');
                      return; // Stop execution: blocks router.push entirely
                    }
                    // ----------------------------------------

                    // Compute token-specific metrics to match current selection
                    const tokenDays = totalDaysCalculated <= 0 ? 1 : totalDaysCalculated;
                    const tokenBaseRate = tokenDays * VehicleDetails.daily_rate;
                    const tokenVat = Math.round((tokenBaseRate + 200) * 0.16);
                    const tokenTotal = tokenBaseRate + 200 + tokenVat;

                    // Gather the state you want to protect
                    const stateToEncode = {
                      vehicleID: vehicleID,
                      VehicleDetails: VehicleDetails,
                      bookingInformation: {
                        start: dayjs(start).format('YYYY-MM-DDTHH:mm'),
                        end: dayjs(end).format('YYYY-MM-DDTHH:mm'),
                        totalDays: tokenDays,
                        vat: tokenVat,
                        rescue: 200,
                        total: tokenTotal
                      }
                    };
                    // console.log('encoding',stateToEncode)
                    try {
                      // Convert to JSON, then encode to Base64
                      const jsonString = JSON.stringify(stateToEncode);
                      const encodedData = btoa(encodeURIComponent(jsonString));

                      // Navigate with the tokenized payload
                      router.push(`/vehicles/${vehicleID}/book?token=${encodedData}`);
                    } catch (error) {
                      console.error("Failed to encode booking data:", error);
                    }
                  }}
                >
                  <Button disabled={!profile || VehicleDetails.status === 'Not Available'} className='w-full mt-5' size='sm'>Continue to Book</Button>
                </div> :
                <Link target='_blank' href={'/signin'}>
                  <Button className='w-full mt-5' size='sm'>Sigin to Book</Button>
                </Link>
            }
            <div className='flex mt-3 text-gray-500 gap-3 items-center text-sm w-1/2 mx-auto'>
              <div className='w-full h-0.5 bg-gray-600'></div>
              OR
              <div className='w-full h-0.5 bg-gray-600'></div>
            </div>
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