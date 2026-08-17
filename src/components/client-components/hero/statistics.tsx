import React from "react";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { useFleet } from "@/context/FleetContext";
import { useBooking } from "@/context/BookingContext";
import CountUp from "react-countup";
import { ArrowRightIcon } from "@/icons";
import Link from "next/link";

function StatisticsBanner({ tenant }: { tenant: any }) {
  const { vehicles, loading } = useFleet();
  const { bookings, loading: loadingBookings } = useBooking();

  // Safely compute values with strict fallbacks
  const vehicleCount = Array.isArray(vehicles) ? vehicles.length : 0;
  const bookingCount = Array.isArray(bookings) ? bookings.length : 0;
  const yardCount =
    tenant?.yards && Array.isArray(tenant.yards) ? tenant.yards.length : 0;

  const stats = [
    {
      icon: <DirectionsCarFilledOutlinedIcon className="text-gray-500" />,
      end: vehicleCount,
      isLoading: loading,
      label: "Vehicles",
      desc: "Browse a diverse selection of our fleet at our yards, from economy cars to premium SUVs and Minivans.",
      border: "border-l-orange-500",
    },
    {
      icon: <CalendarMonthIcon className="text-gray-500" />,
      end: bookingCount,
      isLoading: loadingBookings,
      label: "Bookings",
      desc: "Reliable and seamless booking services tailored to meet your travel needs efficiently.",
      border: "border-l-brand-500",
    },
    {
      icon: <LocationOnOutlinedIcon className="text-gray-500" />,
      end: yardCount,
      isLoading: !tenant,
      label: "Yards/Locations",
      desc: "Conveniently located yards across the region to ensure easy pickup and drop-off access.",
      border: "border-l-green-500",
    },
    {
      icon: <StarBorderOutlinedIcon className="text-gray-500" />,
      end: 99.5,
      isLoading: false,
      label: "Satisfaction",
      desc: "Our commitment to excellence is reflected in our consistently high customer satisfaction ratings.",
      border: "border-l-purple-500",
      unit: "%",
      decimals: 1,
    },
  ];

  return (
    <div className="shadow-brand-400 container mx-auto mb-5 rounded-3xl bg-gray-100 p-6 text-gray-900 shadow dark:bg-gray-900">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h4 className="mb-2 text-2xl font-bold text-black dark:text-white">
            We only deliver the best results.
          </h4>
          <p className="mb-0 text-gray-500">
            We don’t take chances when it comes to giving you the experience you
            deserve.
          </p>
        </div>

        <div className="hidden sm:block">
          <div className="flex items-center gap-4">
            <Link
              id="heroactionBtn"
              className="ml-2 flex items-center rounded-lg bg-blue-500 p-2 px-4 text-sm font-medium text-white transition-colors"
              href="/vehicles"
            >
              Find Cars &nbsp; <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-5 text-center md:grid-cols-4 md:text-left">
        {stats.map((item, index) => (
          <div key={index} className="mb-4 md:mb-0">
            <div className="stat-number text-brand-500 text-2xl font-bold">
              {item.isLoading ? (
                <span>0</span>
              ) : (
                <CountUp
                  end={item.end}
                  duration={5}
                  decimals={item.decimals || 0}
                />
              )}
              {item.unit || "+"}
            </div>
            <div className="stat-label mt-1 mb-1 font-bold text-black dark:text-white">
              {item.label}
              <br />
              <small className="text-xs font-normal text-gray-400">
                {item.desc}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatisticsBanner;
