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
import { useUser } from "@/context/UserContext";
import { fetchExpensesForAdmin } from "@/app/actions/expenses";

export default function ExpensesTable() {
  const { profile } = useUser();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (!profile?.tenant_id) return;
    const fetchExpenses = async () => {
      setLoading(true);

      const res = await fetchExpensesForAdmin(profile?.tenant_id);
      console.log(res);
      if (res.success) {
        setExpenses(res.data);

        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [profile]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <div className="min-h-100 min-w-275.5">
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
              ) : expenses.length > 0 ? (
                expenses.map((expense: any) => (
                  <TableRow key={expense.id}>
                    <TableCell className="px-5 py-4 text-start sm:px-6">
                      <div className="flex min-w-37.5 items-center gap-3">
                        <div>
                          <span className="text-theme-sm block font-medium text-gray-800 dark:text-white/90">
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
                      {new Date(expense.created_at).toLocaleString()}
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
    </div>
  );
}
