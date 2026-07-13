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
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    if (!profile?.tenant_id) return;
    const fetchExpenses = async () => {
      setLoading(true);

      const res = await fetchExpensesForAdmin(profile?.tenant_id)
      console.log(res)
      if (res.success) {
        setExpenses(res.data);

        setLoading(false);
      } else {

        setLoading(false);
      }
    }
    fetchExpenses();
  }, [profile])

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
                  Expense Details
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
                        <span>Loading expenses ...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.length > 0 ? (
                    expenses.map((expense: any) => (
                      <TableRow key={expense.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3 min-w-37.5">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {expense.description}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 min-w-50 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {expense.category}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {expense.paid_by || 'Company'}
                        </TableCell>
                        <TableCell className="px-4 text-nowrap py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {/* {order.nextService} */}
                          {new Date(expense.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                          {expense.method}
                        </TableCell>
                        <TableCell className="px-4 py-3 uppercase text-gray-500 text-theme-sm dark:text-gray-400">
                          {expense.payment_ref}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                          {expense.amount.toLocaleString()} Ksh
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={"success"}
                          >
                            {"Success"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 flex gap-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Link href={'/bookings/' + expense.id + '/edit'}>
                            <button
                              className="flex text-nowrap items-center justify-center p-2 px-3 font-medium rounded-lg bg-gray-200 dark:bg-gray-800 text-red-500 text-theme-sm hover:bg-red-600"
                            >
                              Delete <TrashBinIcon className="ml-1" />
                            </button>
                          </Link>
                          <Link href={'/bookings/' + expense.id}>

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
