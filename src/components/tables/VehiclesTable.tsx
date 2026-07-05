import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Link from "next/link";
import { ArrowRightIcon } from "@/icons";
import Pagination from "./Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useBooking } from "@/context/BookingContext";
import { useAdminFleet } from "@/context/AdminFleetContext";
import { useAdminBooking } from "@/context/AdminBookingContext";


export default function VehiclesTable() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const { vehicles, loading } = useAdminFleet();
  const { bookings } = useAdminBooking();
  const router = useRouter();
  const pathname = usePathname();
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const allVehicles = vehicles.map(vehicle => {
    const booking = bookings.find(v => v.id === vehicle.id);
    return { ...vehicle, booking };
  });

  const totalResults = allVehicles.length;
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
                    Vehicle Details
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Category
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Owner
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 text-nowrap py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Next Service
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
                    Min Rental Period
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
                        <div className="flex py-4 flex-col items-center justify-center gap-3 w-full text-gray-500 text-theme-sm dark:text-gray-400">
                          <CircularProgress color="secondary" />
                          <span>Loading vehicles...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : totalResults === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="px-5 py-4 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                        No vehicles found.
                      </TableCell>
                    </TableRow>
                  ) : allVehicles.slice(startIndex - 1, endIndex).map((vehicle, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-20 bg-white object-fit-cover object-center"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                            // src={vehicle.image}
                            src={vehicle.image_url}
                            alt={vehicle.license_plate}
                          />
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </span>
                            <span className="block text-gray-500 text-theme-xs py-2 dark:text-gray-400">
                              {vehicle.license_plate} | VIN: {vehicle.vin} |  {vehicle.location}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {vehicle.category}
                      </TableCell>
                      <TableCell className="px-4 text-nowrap py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {vehicle.owner}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {vehicle.next_service_due}
                      </TableCell>
                      <TableCell className="px-4 text-nowrap py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {vehicle.daily_rate} Ksh.
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {vehicle.min_rental_days} {vehicle.min_rental_days > 1 ? 'Days' : 'Day'}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            vehicle.status === "Not Available"
                              ? "error"
                              : "success"
                          }
                        >
                          {vehicle.status === "Not Available"
                            ? "Not Available"
                            : "Available"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Link href={`/vehicles/${vehicle.id}`}>
                          <button
                            className="flex items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 gap-3"
                          >
                            View <ArrowRightIcon />
                          </button></Link>
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
