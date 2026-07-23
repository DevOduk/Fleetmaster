"use client"
import { Box, Chip } from '@mui/material'
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined"
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined"
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"
import Link from "next/link";
import Button from '@/components/ui/button/Button';
import dayjs from 'dayjs';



interface VehicleDetails {
    VehicleDetails: any;
    filters: any;
    isBooked: boolean;
}

function VehicleItem({ VehicleDetails, isBooked, filters }: VehicleDetails) {
    const startDay = dayjs(filters.start);
    const endDay = dayjs(filters.end);

    const dayGap = startDay.isValid() && endDay.isValid() ? endDay.diff(filters.start, "day") : 0;

    // 2. Ensure it defaults to at least 1 Day if they select the same day or a short window
    const totalDays = dayGap <= 0 ? 0 : dayGap;

    return (
        <div key={VehicleDetails.id} className="mb-3 dark:bg-gray-500/10 bg-gray-500/3 shadow rounded-2xl">
            <div className='relative'>
                <Box className='flex gap-2' sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <Chip size='small' sx={{ px: 1 }} variant='filled' color='primary' label={VehicleDetails.driver_type} />
                    <Chip size='small' sx={{ px: 1 }} variant='filled' color='secondary' icon={<DirectionsCarFilledOutlinedIcon fontSize='small' />} label={VehicleDetails.category} />
                </Box>
                <img src={VehicleDetails.image_url} alt={`${VehicleDetails.make} ${VehicleDetails.model}`} className="w-full bg-gray-500 object-cover rounded-xl rounded-b-none mb-3 aspect-video" />
            </div>
            <div className="px-3 pb-4">
                <h4 className="font-bold text-black dark:text-white mb-1">{VehicleDetails.year} {VehicleDetails.make} {VehicleDetails.model} </h4>
                {/* <p className="truncate text-gray-500 mb-2 mt-1 text-sm dark:text-gray-400">{VehicleDetails.description}</p> */}

                <div
                    className={`inline-flex flex-wrap items-center gap-1.5 py-1 rounded-full text-xs font-medium mb-1 ${isBooked
                        ? 'text-rose-600 dark:text-rose-400'
                        : VehicleDetails.status === 'Available'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                >
                    {/* 1. Dynamic Icon Selection based on your execution hierarchy */}
                    {isBooked ? (
                        <CloseOutlinedIcon fontSize='small' />
                    ) : VehicleDetails.status === 'Available' ? (
                        <TaskAltOutlinedIcon fontSize="small" />
                    ) : (
                        <CloseOutlinedIcon fontSize='small' />
                    )}

                    {/* 2. Dynamic Text Output based on priority rules */}
                    {isBooked
                        ? 'Booked. Try another date!'
                        : VehicleDetails.status === 'Available'
                            ? 'Available for booking'
                            : 'Vehicle not available'
                    }
                    {totalDays < VehicleDetails?.min_rental_days && <span className='text-amber-600 dark:text-amber-400'>● Min {VehicleDetails.min_rental_days} days required!</span>}
                </div>
                <div className="flex gap-0 flex-wrap">
                    <div className="text-gray-500 dark:text-gray-400 text-sm p-1 flex gap-1 items-center mr-2">
                        <PeopleAltOutlinedIcon fontSize='small' /> {VehicleDetails.seats}
                    </div>

                    <div className="text-gray-500 dark:text-gray-400 text-sm p-1 flex gap-1 items-center mr-2">
                        <CalendarMonthOutlinedIcon fontSize='small' /> {VehicleDetails.min_rental_days} days
                    </div>

                    <div className="text-gray-500 dark:text-gray-400 text-sm p-1 flex gap-1 items-center">
                        <LocalGasStationOutlinedIcon fontSize='small' /> {VehicleDetails.fuel_type}
                    </div>
                </div>
                <h5 className='font-bold text-right text-sm text-green-500'>Ksh. {VehicleDetails.daily_rate.toLocaleString()} <span className='font-medium text-right text-xs text-gray-500 mt-1'>/day</span></h5>
                <p className='font-medium text-right text-xs text-brand-400 mt-2'>Exclusive of VAT</p>

                <Link href={`/vehicles/${VehicleDetails.id}?start=${filters?.start}&end=${filters?.end}`}>
                    <Button variant='outline' className="w-full mt-3 text-sm! rounded-lg p-3! transition-colors hover:bg-brand-500! hover:text-white hover:border-transparent focus:bg-brand-500 focus:text-white focus:border-transparent focus:outline-hidden active:bg-brand-600 active:text-white active:border-transparent dark:bg-gray-200/10 dark:text-gray-400 dark:border-gray-500 dark:hover:bg-brand-600 dark:hover:text-white dark:hover:border-transparent dark:focus:bg-brand-600 dark:focus:text-white dark:focus:border-transparent dark:active:bg-brand-700 dark:active:text-white dark:active:border-transparent" >
                        See Details
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default VehicleItem;
