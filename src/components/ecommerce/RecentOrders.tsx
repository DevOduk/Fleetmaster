"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";
import { formatedTimestamp } from "../company-profile/ExpiryBanner";

export default function RecentOrders({
  bookings
}: {
  bookings: any[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/3">
      <div className="mb-4 flex gap-2 justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Bookings
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link href={"/bookings"}>
            <button className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200">
              See all
            </button>
          </Link>
        </div>
      </div>
      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-h-100 min-w-170">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-y border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Vehicle Details
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Category
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Amount
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Time
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {
              // loading ? (
              //   <>
              //     {[...Array(4)].map((_, i) => (
              //       <TableRow key={i}>
              //         <TableCell className="w-full py-2" colSpan={4}>
              //           <div className="mb-2 h-12 animate-pulse rounded bg-gray-300 text-center dark:bg-gray-600"></div>
              //         </TableCell>
              //       </TableRow>
              //     ))}
              //   </>
              // ) : 
              bookings.length > 0 ? (
                bookings?.slice(0, 10).map((product, index) => (
                  <TableRow key={index} className="">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.vehicleDetails?.image_url}
                          className="h-11 w-17 rounded object-cover"
                          alt={product.vehicleDetails?.make}
                        />
                        <div>
                          <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                            {product.vehicleDetails?.make}{" "}
                            {product.vehicleDetails?.model}{" "}
                            {product.vehicleDetails?.year}
                          </p>
                          <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                            {product.vehicleDetails?.license_plate} |{" "}
                            {product.vehicleDetails?.rental_days} Days
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {product.vehicleDetails?.category}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {product.total?.toLocaleString()} Ksh.
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {formatedTimestamp(new Date(product.created_at).toISOString())}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          product.booking_status === "Active"
                            ? "primary"
                            : product.booking_status === "Reserved"
                              ? "info"
                              : product.booking_status === "Completed"
                                ? "success"
                                : product.booking_status === "Cancelled"
                                  ? "error"
                                  : "warning"
                        }
                      >
                        {product.booking_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex h-80 items-center justify-center rounded-lg border text-center text-sm text-red-500 dark:border-gray-600">
                      You don't have any bookings! Go to &nbsp;{" "}
                      <Link
                        className="text-brand-500 underline"
                        href={"/bookings"}
                      >
                        Bookings
                      </Link>{" "}
                      &nbsp; to create one.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
