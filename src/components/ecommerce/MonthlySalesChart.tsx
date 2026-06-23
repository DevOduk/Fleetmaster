"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useUser } from "@/context/UserContext";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart() {
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  const series = [
    {
      name: "Revenue",
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
    {
      name: "Expenses",
      data: [8, 35, 21, 98, 18, 15, 29, 110, 25, 39, 0, 2],
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const { loading } = useUser()

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
      {
        loading ? (
        <div className="xl:col-span-2 bg-transparent border border-gray-900/60 p-5 rounded-xl space-y-6 h-125">
          <div className="flex justify-between items-center">
            <div className="h-5 w-36 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            <div className="h-5 w-3 bg-gray-400 dark:bg-gray-500 rounded animate-pulse" />
          </div>
          {/* Fake Bar Chart Bars */}
          <div className="h-100 flex items-end justify-between gap-2 pt-4 px-2">
            {[55, 80, 45, 70, 50, 65, 85, 30, 60, 90, 75, 40, 90, 100, 110, 50, 90, 75, 40, 90, 100].map((height, i) => (
              <div
                key={i}
                style={{ height: `${height}%` }}
                className="w-full bg-gray-300 dark:bg-gray-600 rounded-t animate-pulse"
              />
            ))}
          </div>
        </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Monthly Revenue
              </h3>

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
                    onItemClick={closeDropdown}
                    className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    View More
                  </DropdownItem>
                  <DropdownItem
                    onItemClick={closeDropdown}
                    className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    Delete
                  </DropdownItem>
                </Dropdown>
              </div>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
              <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
                <ReactApexChart
                  options={options}
                  series={series}
                  type="bar"
                  height={450}
                />
              </div>
            </div>
          </>)
      }
    </div>
  );
}
