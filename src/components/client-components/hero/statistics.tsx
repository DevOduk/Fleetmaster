import React from 'react'
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined"
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined"
import { useFleet } from '@/context/FleetContext'
import { useBooking } from '@/context/BookingContext'

function StatisticsBanner({ tenant }: { tenant: any; }) {
    const { vehicles } = useFleet();
    const { bookings } = useBooking();


    return (
        <div className='container m-auto mb-4 gap-3 grid grid-cols-2 lg:grid-cols-4 p-2'>
            <div className='rounded-2xl mb-6 p-4 shadow shadow-brand-500/60 bg-gray-700/9 border-l-orange-500 border-l-3'>
                {/* <DirectionsCarFilledOutlinedIcon className='text-gray-500' /> */}
                <h2 className='text-2xl mt-2 mb-2 text-brand-500 font-extrabold'>{vehicles?.length || 0}+</h2>
                <h3 className='mb-1 font-bold text-black dark:text-white'>Vehicles</h3>
                <p className='text-sm text-gray-500 truncate'>Browse a bunch of our fleet available at our designated yards. Want economy, premium SUVs, Minivans? We've got it!</p>
            </div>
            <div className='rounded-2xl mb-6 p-4 shadow shadow-brand-500/60 bg-gray-700/9 border-l-brand-500 border-l-3'>
                {/* <CalendarMonthIcon className='text-gray-500' /> */}
                <h2 className='text-3xl mt-2 mb-2 text-brand-500 font-extrabold'>{bookings?.length || 0}+</h2>
                <h3 className='mb-1 font-bold text-black dark:text-white'>Bookings</h3>
                <p className='text-sm text-gray-500 truncate'>Browse a bunch of our fleet available at our designated yards. Want economy, premium SUVs, Minivans? We've got it!</p>
            </div>
            <div className='rounded-2xl mb-6 p-4 shadow shadow-brand-500/60 bg-gray-700/9 border-l-green-500 border-l-3'>
                {/* <LocationOnOutlinedIcon className='text-gray-500' /> */}
                <h2 className='text-3xl mt-2 mb-2 text-brand-500 font-extrabold'>{tenant?.yards?.length || 0}+</h2>
                <h3 className='mb-1 font-bold text-black dark:text-white'>Yards/Loctions</h3>
                <p className='text-sm text-gray-500 truncate'>Browse a bunch of our fleet available at our designated yards. Want economy, premium SUVs, Minivans? We've got it!</p>
            </div>
            <div className='rounded-2xl mb-6 p-4 shadow shadow-brand-500/60 bg-gray-700/9 border-l-purple-500 border-l-3'>
                {/* <StarBorderOutlinedIcon className='text-gray-500' /> */}
                <h2 className='text-3xl mt-2 mb-2 text-brand-500 font-extrabold'>99%</h2>
                <h3 className='mb-1 font-bold text-black dark:text-white'>Satisfaction</h3>
                <p className='text-sm text-gray-500 truncate'>Browse a bunch of our fleet available at our designated yards. Want economy, premium SUVs, Minivans? We've got it!</p>
            </div>
        </div>
    )
}

export default StatisticsBanner
