import React from "react";
import Link from "next/link";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import DoNotDisturbAltOutlinedIcon from "@mui/icons-material/DoNotDisturbAltOutlined";

const VehicleNotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      {/* Icon with subtle background pulse */}
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <DoNotDisturbAltOutlinedIcon
            color="error"
            sx={{ fontSize: "4rem" }}
          />
        </div>
      </div>

      {/* Text Content */}
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        Vehicle Not Found
      </h1>
      <p className="mb-8 max-w-sm text-gray-500 dark:text-gray-400">
        The vehicle you are looking for doesn&apos;t exist or has been removed
        from the fleet. Please check the ID and try again.
      </p>

      {/* Action Button */}
      <Link
        href="/vehicles"
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95"
      >
        <ArrowBackOutlinedIcon className="h-4 w-4" />
        Back to Vehicles
      </Link>
    </div>
  );
};

export default VehicleNotFound;
