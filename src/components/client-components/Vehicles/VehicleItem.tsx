"use client"
import { Box, Chip } from '@mui/material'
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined"
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined"
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"
import Link from "next/link";



interface VehicleDetails {
    VehicleDetails: any;
    isBooked: boolean;
}

function VehicleItem({ VehicleDetails, isBooked }: VehicleDetails) {
    return (
        <div key={VehicleDetails.id} className="mb-3 dark:bg-gray-500/10 bg-gray-500/3 shadow rounded-2xl">
            <div className='relative'>
                <Box className='flex gap-2' sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <Chip size='small' sx={{ px: 1 }} variant='filled' color='primary' label={VehicleDetails.driverType} />
                    <Chip size='small' sx={{ px: 1 }} variant='filled' color='secondary' icon={<DirectionsCarFilledOutlinedIcon fontSize='small' />} label={VehicleDetails.category} />
                </Box>
                <img src={VehicleDetails.imageUrl} alt={`${VehicleDetails.make} ${VehicleDetails.model}`} className="w-full bg-gray-500 object-cover rounded-xl rounded-b-none mb-3 aspect-video" />
            </div>
            <div className="px-3 pb-4">
                <h4 className="font-bold text-black dark:text-white">{VehicleDetails.year} {VehicleDetails.make} {VehicleDetails.model} </h4>
                {/* <p className="truncate text-gray-500 mb-2 mt-1 text-sm dark:text-gray-400">{VehicleDetails.description}</p> */}

                <span
                    className={`inline-flex items-center gap-1.5 py-1 rounded-full text-xs font-medium mb-1 ${isBooked
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
                </span>
                <div className="mt-2 flex gap-0 flex-wrap">
                    <div className="text-gray-500 dark:text-gray-400 text-sm p-1 flex gap-1 items-center mr-2">
                        <PeopleAltOutlinedIcon fontSize='small' /> {VehicleDetails.seats}
                    </div>

                    <div className="text-gray-500 dark:text-gray-400 text-sm p-1 flex gap-1 items-center mr-2">
                        <CalendarMonthOutlinedIcon fontSize='small' /> {VehicleDetails.minRentalDays} days
                    </div>

                    <div className="text-gray-500 dark:text-gray-400 text-sm p-1 flex gap-1 items-center">
                        <LocalGasStationOutlinedIcon fontSize='small' /> {VehicleDetails.fuelType}
                    </div>
                </div>
                <h5 className='font-bold text-right text-sm text-green-500'>Ksh. {VehicleDetails.dailyRate.toLocaleString()}</h5>
                <p className='font-medium text-right text-xs text-gray-500 mt-1'>/day</p>
                <p className='font-medium text-right text-xs text-brand-500 mt-1'>Exclusive of VAT</p>

                <Link href={'/vehicles/' + VehicleDetails.id}>
                    <button className="w-full bg-gray-200 dark:bg-gray-200/10 mt-3 text-sm border border-gray-500 rounded-lg p-2 dark:border-gray-500 text-gray-500 dark:text-gray-400 hover:text-white dark:hover:text-white hover:bg-blue-500 dark:hover:bg-blue-600 hover:border-transparent transition-colors">View Vehicle</button>
                </Link>
            </div>
        </div>
    )
}

export default VehicleItem;
