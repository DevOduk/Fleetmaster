"use client"

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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "./Pagination";

export default function ExpensesTable({ expenses, loading }: { expenses: any[]; loading: boolean; }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  // --- 3. PAGINATION MATH MATRICS ---
  const itemsPerPage = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(expenses.length / itemsPerPage),
  );

  // Fallback safeguard to handle bounds correctly if users apply filters that shrink the page footprint
  const activePage = Math.max(1, Math.min(urlPage, totalPages));

  const indexStart = (activePage - 1) * itemsPerPage;
  const indexEnd = indexStart + itemsPerPage;
  const paginatedExpensex = expenses.slice(indexStart, indexEnd);

  const startIndex = expenses.length === 0 ? 0 : indexStart + 1;
  const endIndex = Math.min(activePage * itemsPerPage, expenses.length);

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      nextParams.set("page", page.toString());
    } else {
      nextParams.delete("page");
    }
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <div className="min-h-100 min-w-275.5" >
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Expense Details
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-nowrap text-gray-500 dark:text-gray-400"
                >
                  Purpose
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Paid By
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-nowrap text-gray-500 dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-nowrap text-gray-500 dark:text-gray-400"
                >
                  Method
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Receipt No.
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Amount
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="border-b border-gray-200 px-5 py-4 dark:border-gray-800"
                  >
                    <div className="text-theme-sm flex w-full flex-col items-center justify-center gap-3 py-4 text-gray-500 dark:text-gray-400">
                      <CircularProgress color="secondary" size="small" />
                      <span>Loading expenses ...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedExpensex.length > 0 ? (
                paginatedExpensex.map((expense: any) => (
                  <TableRow key={expense.id}>
                    <TableCell className="px-5 py-4 text-start sm:px-6">
                      <div className="flex min-w-37.5 items-center gap-3">
                        <div>
                          <span className="text-theme-sm block min-w-70 font-medium text-gray-800 dark:text-white/90">
                            {expense.description}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                      <Badge size="sm" color={"info"}>
                        <span className="capitalize">{expense.category}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                      {expense.paid_by || "Company"}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                      {/* {order.nextService} */}
                      {new Date(expense.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-nowrap text-gray-500 dark:text-gray-400">
                      {expense.method}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500 uppercase dark:text-gray-400">
                      {expense.payment_ref}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-nowrap text-gray-500 dark:text-gray-400">
                      {expense.amount.toLocaleString()} Ksh
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      <Badge size="sm" color={"success"}>
                        {"Disbursed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-theme-sm flex gap-3 px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      <button className="text-theme-sm flex items-center justify-center rounded-lg bg-gray-200 p-2 px-3 font-medium text-nowrap text-red-500 hover:bg-red-600 dark:bg-gray-800">
                        Delete <TrashBinIcon className="ml-1" />
                      </button>
                      <Link href={"/expenses/" + expense.id}>
                        <button className="bg-brand-500 text-theme-sm hover:bg-brand-600 flex items-center justify-center rounded-lg p-2 px-3 font-medium text-nowrap text-white">
                          View <ArrowRightIcon className="ml-1" />
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="px-5 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls Visibility Rule */}
      {!loading && (
        <div className="flex items-center justify-between pt-8 pb-3 flex-col md:flex-row gap-8">
          <span className="text-gray-800 dark:text-white text-sm">
            Showing {startIndex} to {endIndex} of {expenses.length}{" "}
            results
          </span>
          <Pagination
            onPageChange={handlePageChange}
            currentPage={activePage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}
