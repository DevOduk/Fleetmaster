import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { PencilIcon } from "@/icons";
import Button from "../ui/button/Button";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { useAdminBooking } from "@/context/AdminBookingContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "./Pagination";



export default function BookingsTable() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const pathname = usePathname();
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const { bookings: allBookings, loading } = useAdminBooking();

  const totalResults = allBookings.length;
  const [currentPage, setCurrentPage] = useState<number>(urlPage)
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));

  // Then use activePage for your math:
  const startIndex = totalResults === 0 ? 0 : (activePage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(activePage * itemsPerPage, totalResults);


  useEffect(() => {
    if (currentPage > totalPages && totalResults > 0) {
      params.delete("page");

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [totalPages, totalResults]);

  return (
    <div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-275">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>

                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    No.
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Vehicle Details
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Rented By
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Start Date
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Rate per Day
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Discount
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Total
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
                    allBookings.slice(startIndex - 1, endIndex).length > 0 ? (
                      allBookings.slice(startIndex - 1, endIndex).map((booking: any, i) => (
                        <TableRow key={booking.id}>
                          <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {i + 1}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start">
                            <div className="flex items-center gap-3 min-w-62.5">
                              <img
                                className="w-20 object-fit-cover object-center"
                                style={{ objectFit: 'cover', objectPosition: 'center' }}
                                // src={order.user.image}
                                src={booking?.vehicleDetails?.image_url}
                                alt={booking.id.toString()}
                              />
                              <div>
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 text-nowrap">
                                  {booking.vehicleDetails?.year} {booking.vehicleDetails?.make} {booking.vehicleDetails?.model}
                                </span>
                                <span className="block text-gray-500 text-theme-xs py-2 dark:text-gray-400">
                                  {/* {order.user.role} */}
                                  {booking.vehicleDetails?.license_plate}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {booking.renter_name}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {booking.renter_phone}
                          </TableCell>
                          <TableCell className="px-4 text-nowrap py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {/* {order.nextService} */}
                            {booking.rental_start} | {booking.rental_days} Days
                          </TableCell>
                          <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                            Ksh. {booking.vehicleDetails?.daily_rate?.toLocaleString()}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            Ksh. {booking.discount}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                            {booking.total.toLocaleString()} Ksh
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <Badge
                              size="sm"
                              color={
                                booking.booking_status === "Active"
                                  ? "error"
                                  : booking.booking_status === "Reserved"
                                    ? "primary"
                                    : "success"
                              }
                            >
                              {booking.booking_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 flex gap-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <Link href={'/bookings/' + booking.id + '/edit'}>
                              <button
                                className="flex text-nowrap items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
                              >
                                Edit <PencilIcon className="ml-1" />
                              </button>
                            </Link>
                            <Link href={'/bookings/' + booking.id}>

                              <button
                                className="flex text-nowrap items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
                              >
                                View Booking
                              </button>
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

      <div className="flex items-center justify-between pb-3 pt-8">
        <span className="dark:text-white text-gray-800">
          Showing {startIndex} to {endIndex} of {totalResults} results
        </span>
        <Pagination onPageChange={(page) => {
          setCurrentPage(page);
          page > 1 ? params.set("page", page.toString()) : params.delete("page");

          router.replace(`${pathname}?${params.toString()}`)
        }} currentPage={currentPage} totalPages={(totalPages)} />

      </div>
    </div>
  );
}
