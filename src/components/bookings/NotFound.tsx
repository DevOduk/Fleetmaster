import React from "react";
import Link from "next/link";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import DoNotDisturbAltOutlinedIcon from "@mui/icons-material/DoNotDisturbAltOutlined";

const BookingNotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      {/* Icon with subtle background pulse */}
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-800/30">
          <DoNotDisturbAltOutlinedIcon
            color="error"
            sx={{ fontSize: "2rem" }}
          />
        </div>
      </div>

      {/* Text Content */}
      <h4 className="modal-title text-theme-xl mt-3 mb-2 font-semibold text-gray-800 lg:text-xl dark:text-white/90">
        Booking Not Found!
      </h4>
      <p className="mb-8 text-sm max-w-2xl text-gray-500 dark:text-gray-400">
        The booking you are looking for doesn&apos;t exist or has been
        removed/deleted. Please check the ID and try again. If this error persits, contact <Link className="text-blue-500 underline" href={'/support'}>support</Link> with the booking id.
      </p>

      {/* Action Button */}
      <Link
        href="/bookings"
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95"
      >
        <ArrowBackOutlinedIcon className="h-4 w-4" />
        Back to Bookings
      </Link>
    </div>
  );
};

export default BookingNotFound;
