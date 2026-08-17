"use client";

import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import Pagination from "../tables/Pagination";
import Link from "next/link";
import PaymentsTable from "../tables/PaymentsTable";
import { fetchPaymentsForAdmin } from "@/app/actions/payments";
import { useUser } from "@/context/UserContext";

const Payments: React.FC = () => {
  const { profile } = useUser();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currency = profile?.fleetmaster_tenants?.currency || "USD";

  useEffect(() => {
    if (!profile?.tenant_id) return;
    setLoading(true);

    const fetchPayments = async () => {
      const res = await fetchPaymentsForAdmin(profile?.tenant_id);

      if (res.success && Array.isArray(res.data)) {
        setExpenses(res.data.filter((p: any) => p.status === "Success"));
      }
      setLoading(false);
    };
    fetchPayments();
  }, [profile]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const fullMonth = now.toLocaleString("default", { month: "long" });

  const today = now.getDate(); // 1-31
  const fullDay = now.toLocaleString("default", { day: "2-digit" });

  // 1. Daily Bookings (Today)
  const totalToday =
    expenses
      ?.filter((b) => {
        const d = new Date(b.created_at);
        return (
          d.getDate() === today &&
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
      })
      .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0) || 0;

  // 2. Weekly Bookings (Current week, assuming Monday start)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(
    now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1),
  );
  startOfWeek.setHours(0, 0, 0, 0);

  const totalThisWeek =
    expenses
      ?.filter((b) => {
        const d = new Date(b.created_at);
        return d >= startOfWeek;
      })
      .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0) || 0;

  // 3. Monthly Bookings
  const totalThisMonth =
    expenses
      ?.filter((b) => {
        const d = new Date(b.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0) || 0;

  // 4. Average Daily Bookings (This month)
  // Formula: Total monthly expenses / Days passed so far this month
  const averageDailyThisMonth = Number((totalThisMonth / today).toFixed(0));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
        {[
          {
            title: "Daily Earnings",
            value: totalToday,
            description: "Total earnings today " + fullDay,
          },
          {
            title: "Weekly Earnings",
            value: totalThisWeek,
            description: "Total earnings this week",
          },
          {
            title: "Monthly  Earnings",
            value: totalThisMonth,
            description: `Total earnings this Month (${fullMonth})`,
          },
          {
            title: "Daily Average (This Month)",
            value: averageDailyThisMonth,
            description: "Your average daily earnings this month",
          },
        ].map((p, i) => (
          <div
            className="space-y-3 rounded-2xl border border-gray-200 bg-white px-5 pt-5 md:p-6 dark:border-gray-800 dark:bg-white/3"
            key={i}
          >
            <span className="text-success-500 mb-3 text-xl font-semibold tracking-wider uppercase">
              {currency}
            </span>
            <h4 className="text-md text-black dark:text-white">{p?.title}</h4>
            <h2 className="mt-3 mb-2 text-2xl font-bold text-gray-600 dark:text-gray-300">
              {p?.value
                ? Number(p.value).toLocaleString("en-KE", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.00"}
            </h2>
            <p className="text-sm text-gray-500">{p?.description}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-theme-sm mb-2 font-medium text-gray-800 dark:text-white/90">
            View all payments (All money coming in) and manage them. Click
            Create New to add a new payment record.
          </p>
          <span className="text-theme-sm text-start text-gray-500 dark:text-gray-400">
            {expenses?.length || 0} Payments |{" "}
            {expenses?.filter((b: any) => b.status === "Success").length || 0}{" "}
            Success | {averageDailyThisMonth.toLocaleString()} Ksh Average per
            Day
          </span>
        </div>
        <Link href="/payments/new">
          <button className="bg-brand-500 text-theme-sm hover:bg-brand-600 flex items-center justify-center rounded-lg p-2 px-3 font-medium text-white">
            Record Payment
          </button>
        </Link>
      </div>
      <PaymentsTable expenses={expenses} loading={loading} />
      <Pagination onPageChange={() => 2} currentPage={1} totalPages={1} />
    </div>
  );
};

export default Payments;
