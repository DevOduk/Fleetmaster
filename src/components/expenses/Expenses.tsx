"use client";
import React, { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import Pagination from "../tables/Pagination";
import Link from "next/link";
import ExpensesTable from "../tables/ExpensesTable";
import { useUser } from "@/context/UserContext";
import { fetchExpensesForAdmin } from "@/app/actions/expenses";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type Expense = {
    amount: number | string;
    created_at: string;
    category?: string | null;
};

const Expenses: React.FC = () => {
    const { profile } = useUser();
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const aggregatedData = useMemo<{ series: number[]; labels: string[] }>(() => {
        if (!expenses || expenses.length === 0) return { series: [], labels: [] };

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Group by category
        const groups = expenses
            .filter(e => {
                const d = new Date(e.created_at);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            })
            .reduce<Record<string, number>>((acc, curr) => {
                const cat = (curr.category.replace(curr.category.at(0), (curr.category.at(0).toUpperCase()))) || 'Uncategorized';
                acc[cat] = (acc[cat] || 0) + (Number(curr.amount) || 0);
                return acc;
            }, {});

        return {
            series: Object.values(groups),
            labels: Object.keys(groups)
        };
    }, [expenses]);

    const options: ApexOptions = {
        chart: {
            width: 420,
            type: 'donut',
        },
        labels: aggregatedData.labels,
        colors: [
            '#3b82f6', // Bright Blue
            '#ec4899', // Pink
            '#f97316', // Orange
            '#06b6d4', // Cyan
            '#f59e0b', // Vibrant Amber
            '#ef4444', // Alert Red
            '#10b981', // Emerald Green
            '#8b5cf6', // Soft Violet
        ],
        plotOptions: {
            pie: {
                dataLabels: {
                    offset: 10,
                },
            },
        },
        title: {
            text: 'Expenses summary chart by ctegory',
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
        legend: {
            position: 'right',
            offsetY: 0,
            height: 230,
            show: true,
            formatter: function (val, opts) {
                return val + ' - ' + opts.w.globals.series[opts.seriesIndex].toLocaleString() + ' Ksh'
            },
        },
    };


    useEffect(() => {
        if (!profile?.tenant_id) return;
        const fetchPayments = async () => {

            const res = await fetchExpensesForAdmin(profile?.tenant_id)

            if (res.success) {
                setExpenses(res.data);
            }
        }
        fetchPayments();
    }, [profile])


    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const fullMonth = now.toLocaleString('default', { month: 'long' });

    const today = now.getDate(); // 1-31

    // 1. Daily Bookings (Today)
    const totalToday = expenses?.filter(b => {
        const d = new Date(b.created_at);
        return d.getDate() === today && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0) || 0;

    // 2. Weekly Bookings (Current week, assuming Monday start)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const totalThisWeek = expenses?.filter(b => {
        const d = new Date(b.created_at);
        return d >= startOfWeek;
    }).reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0) || 0;

    // 3. Monthly Bookings
    const totalThisMonth = expenses?.filter(b => {
        const d = new Date(b.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0) || 0;

    // 4. Average Daily Bookings (This month)
    // Formula: Total monthly expenses / Days passed so far this month
    const averageDailyThisMonth = Number((totalThisMonth / today).toFixed(0));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
                {
                    [
                        {
                            title: 'Today',
                            currency: 'Ksh',
                            value: totalToday,
                            description: 'Total Expenses today',
                        },
                        {
                            title: 'This week',
                            currency: 'Ksh',
                            value: totalThisWeek,
                            description: 'Total Expenses this week',
                        },
                        {
                            title: 'This Month',
                            currency: 'Ksh',
                            value: totalThisMonth,
                            description: `Total earnings this Month (${fullMonth})`,
                        },
                        {
                            title: 'Daily Average (This Month)',
                            currency: 'Ksh',
                            value: averageDailyThisMonth,
                            description: 'Your average daily expenses this month',
                        },
                    ].map((p, i) => (
                        <div className="rounded-2xl border border-gray-200 bg-brand-500/5 p-5 dark:border-gray-800 md:p-6 space-y-3" key={i}>
                            <span className="text-brand-500 text-2xl font-semibold mb-2 uppercase tracking-wider">{p.currency}</span>
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
            <div id="chart" className="flex items-center text-black justify-center py-5 border p-3 dark:border-gray-500 rounded-2xl min-h-75 bg-white">
                {aggregatedData.series.length > 0 ? (
                    <ReactApexChart
                        key={aggregatedData.series.length} // Force re-render only when data loads
                        options={options}
                        series={aggregatedData.series}
                        type="donut"
                        width={420}
                        className='border-0'
                    />
                ) : (
                    <div className="flex items-center justify-center h-75 text-gray-600">
                        Loading chart data...
                    </div>
                )}
            </div>

            <div className="flex justify-between py-3 items-center">
                <div>
                    <p className="font-medium text-gray-800 mb-2 text-theme-sm dark:text-white/90">View all bookings and manage them. Click Create New Booking to add a new booking.</p>
                    <span className="text-gray-500 text-start text-theme-sm dark:text-gray-400">{expenses?.length || 0} Expenses | {averageDailyThisMonth.toLocaleString()} Ksh Average per Day</span>
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
