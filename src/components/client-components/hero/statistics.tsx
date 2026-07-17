import React from 'react'
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined"
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined"
import { useFleet } from '@/context/FleetContext'
import { useBooking } from '@/context/BookingContext'
import CountUp from 'react-countup';
import { ArrowRightIcon } from '@/icons'

function StatisticsBanner({ tenant }: { tenant: any; }) {
    const { vehicles } = useFleet();
    const { bookings } = useBooking();


    return (
        <>
            <div className="mb-5 text-gray-900 container mx-auto rounded-3xl p-6 bg-gray-900 shadow shadow-brand-400">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h4 className="font-bold text-2xl mb-2 text-black dark:text-white">We only deliver the best results.</h4>
                        <p className="text-gray-500 mb-0">We don’t take chances when it comes to giving you the experience you deserve.</p>
                    </div>

                    <div className="hidden sm:block">
                        <div className="flex items-center gap-4">
                            <a id="heroactionBtn" className="text-sm ml-2 p-2 rounded-lg px-4 font-medium bg-blue-500 flex items-center text-white transition-colors" href="#contact">
                                Find Cars &nbsp; <ArrowRightIcon />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 text-center md:text-left gap-5">
                    {[
                        {
                            icon: <DirectionsCarFilledOutlinedIcon className='text-gray-500' />,
                            end: vehicles?.length || 0,
                            label: "Vehicles",
                            desc: "Browse a diverse selection of our fleet at our yards, from economy cars to premium SUVs and Minivans.",
                            border: "border-l-orange-500"
                        },
                        {
                            icon: <CalendarMonthIcon className='text-gray-500' />,
                            end: bookings?.length || 0,
                            label: "Bookings",
                            desc: "Reliable and seamless booking services tailored to meet your travel needs efficiently.",
                            border: "border-l-brand-500"
                        },
                        {
                            icon: <LocationOnOutlinedIcon className='text-gray-500' />,
                            end: tenant?.yards?.length || 0,
                            label: "Yards/Locations",
                            desc: "Conveniently located yards across the region to ensure easy pickup and drop-off access.",
                            border: "border-l-green-500"
                        },
                        {
                            icon: <StarBorderOutlinedIcon className='text-gray-500' />,
                            end: 99.5,
                            label: "Satisfaction",
                            desc: "Our commitment to excellence is reflected in our consistently high customer satisfaction ratings.",
                            border: "border-l-purple-500",
                            unit: "%",
                            decimals: 1
                        }
                    ].map((item, index) => (
                        <div key={index} className="mb-4 md:mb-0">
                            <div className="stat-number text-2xl font-bold text-brand-500">
                                <CountUp end={item.end} duration={5} decimals={item.decimals} />{item.unit || "+"}
                            </div>
                            <div className="stat-label font-bold mt-1 mb-1 text-black dark:text-white">
                                {item.label}
                                <br />
                                <small className="text-gray-400 text-xs font-normal">
                                    {item.desc}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default StatisticsBanner
