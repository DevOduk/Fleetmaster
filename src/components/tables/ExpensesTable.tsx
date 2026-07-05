import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "@/icons";
import Button from "../ui/button/Button";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { useAdminBooking } from "@/context/AdminBookingContext";



export default function ExpensesTable() {
  const { bookings: allBookings, loading } = useAdminBooking();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-275.5">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User Details
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Purpose
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Paid By
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Method
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Receipt No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Amount
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {
                loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex flex-col py-4 items-center justify-center gap-3 w-full text-gray-500 text-theme-sm dark:text-gray-400">
                        <CircularProgress color="secondary" size="small" />
                        <span>Loading bookings...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  allBookings.length > 0 ? (
                    allBookings.map((booking: any) => (
                      <TableRow key={booking.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3 min-w-37.5">
                            {/* <img
                              className="w-20 object-fit-cover object-center"
                              style={{ objectFit: 'cover', objectPosition: 'center' }}
                              // src={order.user.image}
                              src={booking?.vehicleDetails?.imageUrl}
                              alt={booking.id.toString()}
                            /> */}
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {booking.vehicleDetails?.year} {booking.vehicleDetails?.make} {booking.vehicleDetails?.model}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 min-w-50 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {booking.renterName}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {booking.renterPhone}
                        </TableCell>
                        <TableCell className="px-4 text-nowrap py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {/* {order.nextService} */}
                          {booking.rentalStart} | {booking.rentalDays} Days
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                          {booking.vehicleDetails?.daily_rate.toLocaleString()} Ksh
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {'JHG4589GJKRG'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                          {booking.total.toLocaleString()} Ksh
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={
                              booking.bookingStatus === "Active"
                                ? "error"
                                : booking.bookingStatus === "Reserved"
                                  ? "primary"
                                  : "success"
                            }
                          >
                            {booking.bookingStatus === "Active"
                                ? "Failed"
                                : booking.bookingStatus === "Reserved"
                                  ? "Processing"
                                  : "Success"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 flex gap-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Link href={'/bookings/' + booking.id + '/edit'}>
                            <Button size="sm" variant="danger-outline"
                            >
                              Delete <TrashBinIcon className="ml-1" />
                            </Button>
                          </Link>
                          <Link href={'/bookings/' + booking.id}>

                            <Button
                              className="flex text-nowrap items-center justify-center font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
                            >
                              View Expense
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )))
                    : (
                      <TableRow>
                        <TableCell colSpan={9} className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
