"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";
import { useManagerFleet } from "@/context/ManagerFleetContext";
import { formatedValue } from "../ecommerce/MonthlyTarget";


export default function RecentVehiscles() {
  const { vehicles, loading } = useManagerFleet();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Vehicles
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link href={'/bookings'}>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200">
              See all
            </button>
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Vehicle Name
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Owner
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Category
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {
              loading ? (
                <>
                  {[...Array(4)].map((i) => <TableRow key={i}>
                    <TableCell className="w-full py-2" colSpan={4}><div className="dark:bg-gray-600 rounded bg-gray-300 mb-2 h-12 text-center animate-pulse"></div></TableCell>
                  </TableRow>)}
                </>
              ) :
                vehicles.length > 0 ? vehicles?.sort((a, b) => b.created_at - a.created_at).slice(0, 10).map((product, index) => (
                  <TableRow key={index} className="">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url}
                          className="h-11.25 w-17.5 object-cover rounded"
                          alt={product.make}
                        />
                        <div>
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {product.make} {product.model} {product.year}
                          </p>
                          <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                            {product.license_plate} | Min {product.min_rental_days} Days
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-nowrap">
                      {product.owner}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {product.category}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {formatedValue(product.daily_rate)} Ksh.
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          product.status === "Available"
                            ? "success" : "error"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )) : <TableRow>
                  <TableCell>There are no vehicles!</TableCell>
                </TableRow>
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
