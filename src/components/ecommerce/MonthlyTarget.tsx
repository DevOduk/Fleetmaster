"use client";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useMemo, useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useUser } from "@/context/UserContext";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const formatedValue = (value: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1, // Optional: adjust for precision
  });

  return `${formatter.format(value)}`;
};

export default function MonthlyTarget({
  bookings,
  loadingBookings,
  target,
}: {
  bookings: any;
  loadingBookings: boolean;
  target: number;
}) {
  const now = new Date();
  const today = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalRevenue =
    bookings
      ?.filter((booking) => {
        const bookingDate = new Date(booking.created_at);
        return (
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, booking) => sum + (Number(booking.total) || 0), 0) || 0;

  const totalToday =
    bookings
      ?.filter((b) => {
        const d = new Date(b.created_at);
        return (
          d.getDate() === today &&
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
      })
      .reduce((sum, payment) => sum + (Number(payment.total) || 0), 0) || 0;

  const series = useMemo(() => {
    return [Number(((totalRevenue / target) * 100).toPrecision(3))];
  }, [totalRevenue, target]);

  const options: ApexOptions = useMemo(() => {
    return {
      colors: ["var(--color-green-500)"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        type: "radialBar",
        height: 330,
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -85,
          endAngle: 85,
          hollow: {
            size: "80%",
          },
          track: {
            // background: "rgb(0,255,0, 0.1)",
            strokeWidth: "100%",
            margin: 5, // margin is in pixels
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: "36px",
              fontWeight: "600",
              offsetY: -40,
              color: "#1D2939",
              formatter: function (val) {
                return val + "%";
              },
            },
          },
        },
      },
      fill: {
        type: "solid",
        colors: ["var(--color-green-500)"],
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["Progress"],
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const { loading } = useUser();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/3">
      {loading ? (
        <div className="relative h-128 space-y-6 rounded-xl border border-gray-900/60 bg-transparent p-5">
          <div className="mb-4 space-y-3">
            <div className="h-8 w-28 animate-pulse rounded bg-gray-800" />
            <div className="h-4 w-44 animate-pulse rounded bg-gray-800/50" />
          </div>

          {/* Circular Gauge Centerpiece Approximation */}
          <div className="relative mx-auto flex h-64 w-64 animate-pulse items-center justify-center rounded-full border-4 border-dashed border-gray-800">
            <div className="space-y-2 text-center">
              <div className="mx-auto h-6 w-12 rounded bg-gray-800" />
              <div className="mx-auto h-3 w-16 rounded bg-gray-800/60" />
            </div>
          </div>

          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-800/60" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-800/60" />
        </div>
      ) : (
        <>
          <div className="shadow-default rounded-2xl bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:bg-gray-900">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Monthly Target
                </h3>
                <p className="text-theme-sm mt-1 font-normal text-gray-500 dark:text-gray-400">
                  Target you’ve set for each month
                </p>
              </div>
              <div className="relative inline-block">
                <button onClick={toggleDropdown} className="dropdown-toggle">
                  <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                </button>
                <Dropdown
                  isOpen={isOpen}
                  onClose={closeDropdown}
                  className="w-40 p-2"
                >
                  <DropdownItem
                    tag="a"
                    onItemClick={closeDropdown}
                    className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    View More
                  </DropdownItem>
                  <DropdownItem
                    tag="a"
                    onItemClick={closeDropdown}
                    className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    Delete
                  </DropdownItem>
                </Dropdown>
              </div>
            </div>
            <div className="relative text-center">
              <div className="max-h-80">
                <ReactApexChart
                  options={options}
                  series={series}
                  type="radialBar"
                  // height={330}
                />
              </div>

              <span className="bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500 rounded-full px-3 py-1 text-xs font-medium">
                +10%
              </span>
            </div>
            <p className="mx-auto mt-5 w-full max-w-95 text-center text-sm text-gray-500 sm:text-base">
              You earned ${formatedValue(totalToday)} today, it&apos;s higher than last month. Keep up
              your good work!
            </p>
          </div>

          <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
            <div>
              <p className="text-theme-xs mb-1 text-center text-gray-500 sm:text-sm dark:text-gray-400">
                Target
              </p>
              <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
                ${formatedValue(target)}
              </p>
            </div>

            <div className="h-7 w-px bg-gray-200 dark:bg-gray-800"></div>

            <div>
              <p className="text-theme-xs mb-1 text-center text-gray-500 sm:text-sm dark:text-gray-400">
                Revenue
              </p>
              <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
                ${formatedValue(totalRevenue)}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                    fill="#039855"
                  />
                </svg>
              </p>
            </div>

            <div className="h-7 w-px bg-gray-200 dark:bg-gray-800"></div>

            <div>
              <p className="text-theme-xs mb-1 text-center text-gray-500 sm:text-sm dark:text-gray-400">
                Today
              </p>
              <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
                ${formatedValue(totalToday)}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                    fill="#039855"
                  />
                </svg>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
