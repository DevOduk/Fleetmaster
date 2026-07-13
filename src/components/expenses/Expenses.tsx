"use client";
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import Pagination from "../tables/Pagination";
import Link from "next/link";
import ExpensesTable from "../tables/ExpensesTable";
import { useAdminBooking } from "@/context/AdminBookingContext";

const Expenses: React.FC = () => {
    const { bookings } = useAdminBooking();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
                {
                    [
                        {
                            title: 'Today',
                            currency: 'Ksh',
                            value: 950.00,
                            description: 'Total Expenses today',
                        },
                        {
                            title: 'Last 7 days',
                            currency: 'Ksh',
                            value: 5950.00,
                            description: 'Total Expenses this week',
                        },
                        {
                            title: 'This Month',
                            currency: 'Ksh',
                            value: 73450.00,
                            description: 'Total Expenses this Month',
                        },
                        {
                            title: 'Mobile Money (This Month)',
                            currency: 'Ksh',
                            value: 24700.00,
                            description: 'Excluding voucher expenses',
                        },
                    ].map((p, i) => (
                        <div className="rounded-2xl border border-gray-200 bg-brand-500/5 p-5 dark:border-gray-800 md:p-6 space-y-3" key={i}>
                            <span className="text-brand-500 text-2xl font-bold mb-2">{p.currency}</span>
                            <h4 className="text-md text-black dark:text-white">
                                {p?.title}
                            </h4>
                            <h2 className="text-2xl mt-3 mb-2 dark:text-gray-300 text-gray-600 font-bold">
                                {p?.value ? Number(p.value).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</h2>
                            <p className="text-gray-500 text-sm">
                                {p?.description}
                            </p>
                        </div>
                    ))}
            </div>
            <div className="flex justify-between py-3 items-center">
                <div>
                    <p className="font-medium text-gray-800 mb-2 text-theme-sm dark:text-white/90">View all bookings and manage them. Click Create New Booking to add a new booking.</p>
                    <span className="text-gray-500 text-start text-theme-sm dark:text-gray-400">{bookings?.length || 0} Bookings | {bookings?.filter((b: any) => b.status === "Active").length || 0} Active | 7 Average per Day</span>
                </div>
                <Link href="/expenses/new">
                    <button
                        className="flex items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
                    >
                        Record Expense
                    </button>
                </Link>
            </div>
            <ExpensesTable />
            <Pagination onPageChange={() => 2} currentPage={1} totalPages={1} />
        </div>
    );
};

export default Expenses;
