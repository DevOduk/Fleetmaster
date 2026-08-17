"use client";
import { Box, Chip } from "@mui/material";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import dayjs from "dayjs";

interface VehicleDetails {
  VehicleDetails: any;
  filters: any;
  isBooked: boolean;
}

function VehicleItem({ VehicleDetails, isBooked, filters }: VehicleDetails) {
  const startDay = dayjs(filters.start);
  const endDay = dayjs(filters.end);

  const dayGap =
    startDay.isValid() && endDay.isValid()
      ? endDay.diff(filters.start, "day")
      : 0;

  // 2. Ensure it defaults to at least 1 Day if they select the same day or a short window
  const totalDays = dayGap <= 0 ? 0 : dayGap;

  return (
    <div
      key={VehicleDetails.id}
      className="mb-3 rounded-2xl bg-gray-500/3 shadow dark:bg-gray-500/10"
    >
      <Link
        className="relative"
        href={`/vehicles/${VehicleDetails.id}?start=${filters?.start}&end=${filters?.end}`}
      >
        <Box
          className="flex gap-2"
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <Chip
            size="small"
            sx={{ px: 1 }}
            variant="filled"
            color="primary"
            label={VehicleDetails.driver_type}
          />
          <Chip
            size="small"
            sx={{ px: 1 }}
            variant="filled"
            color="secondary"
            icon={<DirectionsCarFilledOutlinedIcon fontSize="small" />}
            label={VehicleDetails.category}
          />
        </Box>
        <img
          src={VehicleDetails.image_url}
          alt={`${VehicleDetails.make} ${VehicleDetails.model}`}
          className="mb-3 aspect-video w-full rounded-xl rounded-b-none bg-gray-500 object-cover"
        />
      </Link>

      <div className="px-3 pb-4">
        <h4 className="mb-1 font-bold text-black dark:text-white">
          {VehicleDetails.year} {VehicleDetails.make}{" "}
          {VehicleDetails.model}{" "}
        </h4>
        {/* <p className="truncate text-gray-500 mb-2 mt-1 text-sm dark:text-gray-400">{VehicleDetails.description}</p> */}
        <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
          <div
            className={`inline-flex items-center gap-1.5 py-1 ${
              isBooked
                ? "text-rose-700 dark:text-rose-400"
                : VehicleDetails.status === "Available"
                  ? "dark:text-green-400"
                  : "dark:text-amber-400"
            }`}
          >
            {isBooked ? (
              <CloseOutlinedIcon sx={{ fontSize: "1rem" }} />
            ) : VehicleDetails.status === "Available" ? (
              <TaskAltOutlinedIcon sx={{ fontSize: "1rem" }} />
            ) : (
              <InfoOutlinedIcon sx={{ fontSize: "1rem" }} />
            )}
            <span>
              {isBooked
                ? "Booked"
                : VehicleDetails.status === "Available"
                  ? "Available"
                  : "Unavailable"}
            </span>
          </div>

          {/* 2. Constraint Warning: Separated for clarity, distinct styling */}
          {totalDays > 0 && totalDays < VehicleDetails?.min_rental_days && (
            <div className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <span className="">●</span>
              <span>{VehicleDetails.min_rental_days} Days required!</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-0">
          <div className="mr-2 flex items-center gap-1 p-1 text-sm text-gray-500 dark:text-gray-400">
            <PeopleAltOutlinedIcon fontSize="small" /> {VehicleDetails.seats}
          </div>

          <div className="mr-2 flex items-center gap-1 p-1 text-sm text-gray-500 dark:text-gray-400">
            <CalendarMonthOutlinedIcon fontSize="small" />{" "}
            {VehicleDetails.min_rental_days} days
          </div>

          <div className="flex items-center gap-1 p-1 text-sm text-gray-500 dark:text-gray-400">
            <LocalGasStationOutlinedIcon fontSize="small" />{" "}
            {VehicleDetails.fuel_type}
          </div>
        </div>
        <h5 className="text-right text-sm font-bold text-green-500">
          Ksh. {VehicleDetails.daily_rate.toLocaleString()}{" "}
          <span className="mt-1 text-right text-xs font-medium text-gray-500">
            /day
          </span>
        </h5>
        <p className="text-brand-400 mt-2 text-right text-xs font-medium">
          Exclusive of VAT
        </p>

        <Link
          href={`/vehicles/${VehicleDetails.id}?start=${filters?.start}&end=${filters?.end}`}
        >
          <Button
            variant="outline"
            className="hover:bg-brand-500! focus:bg-brand-500 active:bg-brand-600 dark:hover:bg-brand-600 dark:focus:bg-brand-600 dark:active:bg-brand-700 mt-3 w-full rounded-lg p-3! text-sm! transition-colors hover:border-transparent hover:text-white focus:border-transparent focus:text-white focus:outline-hidden active:border-transparent active:text-white dark:border-gray-500 dark:bg-gray-200/10 dark:text-gray-400 dark:hover:border-transparent dark:hover:text-white dark:focus:border-transparent dark:focus:text-white dark:active:border-transparent dark:active:text-white"
          >
            See Details
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default VehicleItem;
