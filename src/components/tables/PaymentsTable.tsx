import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { ArrowRightIcon, PencilIcon, TrashBinIcon } from "@/icons";
import Link from "next/link";
import { CircularProgress } from "@mui/material";


export default function PaymentsTable({expenses, loading}: {expenses: any; loading: boolean;}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-275.5 min-h-100">
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
                  User Details
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Payment Ref
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
                  Amount
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nessage
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
                        <span>Loading payments...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.length > 0 ? (
                    expenses.map((payment: any, i) => (
                      <TableRow key={payment?.id}>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {i + 1}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3 min-w-37.5">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {payment?.account_number}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 min-w-50 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {payment?.intasend_invoice_id}
                        </TableCell>
                        <TableCell className="px-4 text-nowrap py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {new Date(payment?.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                          {payment?.provider}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                          {payment?.amount.toLocaleString()} {payment?.currency}
                        </TableCell>

                        <TableCell className="px-4 max-w-lg py-3 text-wrap cursor-pointer text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {payment?.message || '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={
                              payment?.status === "Failed"
                                ? "error"
                                : "success"
                            }
                          >
                            {payment?.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 flex gap-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <button
                            className="flex text-nowrap items-center justify-center p-2 px-3 font-medium rounded-lg bg-gray-200 dark:bg-gray-800 text-red-500 text-theme-sm hover:bg-red-600"
                          >
                            Delete <TrashBinIcon className="ml-1" />
                          </button>
                          <Link href={'/payments/' + payment?.id}>
                            <button
                              className="flex text-nowrap items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
                            >
                              View <ArrowRightIcon className="ml-1" />
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
  );
}
