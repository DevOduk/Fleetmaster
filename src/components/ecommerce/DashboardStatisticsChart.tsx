"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import { CalenderIcon } from "../../icons";
import { getYear, getMonth, isWithinInterval, startOfDay, endOfDay, format, isSameDay, eachDayOfInterval } from "date-fns";

// Import mandatory flatpickr theme stylesheets directly
import "flatpickr/dist/flatpickr.min.css";
import { formatedValue } from "./MonthlyTarget";

// Dynamically import ReactApexChart to prevent SSR issues
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-77.5 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
  ),
});

export default function DashboardStatisticsChart({
  expenses,
  payments,
  loadingRevenue,
  target,
}: {
  expenses: any[];
  payments: any[];
  loadingRevenue: boolean;
  target: number; // a daily value meaning should change for monthly quarterly etc if days mirroered are not equal
}) {
  const currentDate = new Date();
  const daysInCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const datePickerRef = useRef<HTMLInputElement>(null);
  const [filterType, setFilterType] = useState<"daily" | "monthly" | "quarterly" | "annually">("monthly");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  // Flatpickr range picker initialization
  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d, Y",
      defaultDate: [sevenDaysAgo, today],
      clickOpens: true,
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          setDateRange({ start: selectedDates[0], end: selectedDates[1] });
        } else if (selectedDates.length === 1) {
          setDateRange({ start: selectedDates[0], end: null });
        } else {
          setDateRange({ start: null, end: null });
        }
      },
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    });

    return () => {
      if (fp && typeof fp.destroy === "function") {
        fp.destroy();
      }
    };
  }, []);

  // Compute Categories and Series based on active filters (Monthly / Quarterly / Annually / Custom Date Range)
  const getProcessedChartData = () => {
    const now = new Date();
    const currentYear = getYear(now);

    // Keep the date as stored by the API. Parsing an ISO timestamp with
    // parseISO converts it to local time and can shift it into the prior day
    // or month for users in negative UTC offsets.
    const getChartDate = (createdAt: string) => {
      const [year, month, day] = createdAt.slice(0, 10).split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    const getAmount = (item: any) => Number(item?.amount ?? item?.total ?? 0);
    const isValidRevenueEntry = (item: any) => {
      const status = String(item?.status ?? "").trim().toLowerCase();
      if (!status) return true;
      return !["reserved", "failed", "cancelled", "declined", "refunded"].includes(status);
    };

    // 1. Handle Custom Date Range Filter if active
    if (dateRange.start && dateRange.end) {
      const filteredRevenue = (payments || []).filter((item) => {
        if (!item?.created_at) return false;
        const date = getChartDate(item.created_at);
        return (
          isWithinInterval(date, {
            start: startOfDay(dateRange.start!),
            end: endOfDay(dateRange.end!),
          }) && isValidRevenueEntry(item)
        );
      });

      const filteredExpenses = (expenses || []).filter((item) => {
        if (!item?.created_at) return false;
        const date = getChartDate(item.created_at);
        return isWithinInterval(date, {
          start: startOfDay(dateRange.start!),
          end: endOfDay(dateRange.end!),
        });
      });

      const days = eachDayOfInterval({
        start: startOfDay(dateRange.start),
        end: startOfDay(dateRange.end),
      });
      const getSumForDay = (data: any[], day: Date, isPayment = true) =>
        data
          .filter((item) => {
            if (!item?.created_at) return false;
            const date = getChartDate(item.created_at);
            return isSameDay(date, day) && (isPayment ? isValidRevenueEntry(item) : true);
          })
          .reduce((sum, item) => sum + (isPayment ? getAmount(item) : Number(item.amount ?? 0)), 0);

      return {
        categories: days.map((day) => format(day, "dd")),
        series: [
          { name: "Revenue", data: days.map((day) => getSumForDay(filteredRevenue, day, true)) },
          { name: "Expenses", data: days.map((day) => getSumForDay(filteredExpenses, day, false)) },
          { name: "Target", data: days.map(() => target) }
        ],
      };
    }

    // 2. Handle Daily Filter (all days in the current month)
    if (filterType === "daily") {
      const days = Array.from(
        { length: now.getDate() },
        (_, index) => new Date(currentYear, getMonth(now), index + 1)
      );
      const getSumForDay = (data: any[], day: Date, isPayment = true) => {
        return data
          .filter((item) => {
            if (!item?.created_at) return false;
            const date = getChartDate(item.created_at);
            return isSameDay(date, day) && (isPayment ? isValidRevenueEntry(item) : true);
          })
          .reduce((sum, item) => sum + (isPayment ? getAmount(item) : Number(item.amount ?? 0)), 0);
      };

      return {
        categories: days.map((day) => format(day, "dd")),
        series: [
          { name: "Revenue", data: days.map((day) => getSumForDay(payments || [], day, true)) },
          { name: "Expenses", data: days.map((day) => getSumForDay(expenses || [], day, false)) },
          { name: "Target", data: days.map(() => (target).toFixed(0)) }
        ],
      };
    }

    // 3. Handle Quarterly Filter
    if (filterType === "quarterly") {
      const quarters = ["Q1 (Jan-Mar)", "Q2 (Apr-Jun)", "Q3 (Jul-Sep)", "Q4 (Oct-Dec)"];
      const isMonthIn = (monthIndex: number, months: number[]) => months.includes(monthIndex);
      const getTargetForMonths = (year: number, months: number[]) =>
        months.reduce((sum, monthIndex) => sum + target * new Date(year, monthIndex + 1, 0).getDate(), 0);

      const getSumForQuarter = (data: any[], qMonths: number[], isPayment = true) => {
        return data
          .filter((item) => {
            if (!item?.created_at) return false;
            const date = getChartDate(item.created_at);
            return (
              getYear(date) === currentYear &&
              isMonthIn(getMonth(date), qMonths) &&
              (isPayment ? isValidRevenueEntry(item) : true)
            );
          })
          .reduce((sum, item) => sum + (isPayment ? getAmount(item) : Number(item.amount ?? 0)), 0);
      };

      const qMap = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [9, 10, 11],
      ];

      const salesData = qMap.map((months) => getSumForQuarter(payments || [], months, true));
      const revenueData = qMap.map((months) => getSumForQuarter(expenses || [], months, false));

      return {
        categories: quarters,
        series: [
          { name: "Revenue", data: salesData },
          { name: "Expenses", data: revenueData },
          { name: "Target", data: qMap.map((months) => getTargetForMonths(currentYear, months)) }
        ],
      };
    }

    // 4. Handle Annually Filter (Past 5 Years or available years)
    if (filterType === "annually") {
      const years = [currentYear - 4, currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
      const getTargetForYear = (year: number) =>
        Array.from({ length: 12 }, (_, monthIndex) => monthIndex).reduce(
          (sum, monthIndex) => sum + target * new Date(year, monthIndex + 1, 0).getDate(),
          0,
        );
      const getSumForYear = (data: any[], targetYear: number, isPayment = true) => {
        return data
          .filter((item) => {
            if (!item?.created_at) return false;
            const date = getChartDate(item.created_at);
            return getYear(date) === targetYear && (isPayment ? isValidRevenueEntry(item) : true);
          })
          .reduce((sum, item) => sum + (isPayment ? getAmount(item) : Number(item.amount ?? 0)), 0);
      };

      const salesData = years.map((yr) => getSumForYear(payments || [], yr, true));
      const revenueData = years.map((yr) => getSumForYear(expenses || [], yr, false));

      return {
        categories: years.map(String),
        series: [
          { name: "Revenue", data: salesData },
          { name: "Expenses", data: revenueData },
          { name: "Target", data: years.map((year) => getTargetForYear(year)) }
        ],
      };
    }

    // 5. Default Monthly Filter (Jan to Current Month)
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIndex = getMonth(now);
    const categories = allMonths.slice(0, currentMonthIndex + 1);

    const getTargetForMonth = (year: number, monthIndex: number) =>
      target * new Date(year, monthIndex + 1, 0).getDate();

    const getSumForMonth = (data: any[], targetMonthIndex: number, isPayment = true) => {
      return data
        .filter((item) => {
          if (!item?.created_at) return false;
          const date = getChartDate(item.created_at);
          return (
            getYear(date) === currentYear &&
            getMonth(date) === targetMonthIndex &&
            (isPayment ? isValidRevenueEntry(item) : true)
          );
        })
        .reduce((sum, item) => sum + (isPayment ? getAmount(item) : Number(item.amount ?? 0)), 0);
    };

    const salesData = categories.map((_, index) => getSumForMonth(payments || [], index, true));
    const expensesData = categories.map((_, index) => getSumForMonth(expenses || [], index, false));

    return {
      categories,
      series: [
        { name: "Revenue", data: salesData },
        { name: "Expenses", data: expensesData },
        { name: "Target", data: categories.map((_, index) => getTargetForMonth(currentYear, index)) }
      ],
    };
  };

  const chartData = getProcessedChartData();

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["var(--color-success-500)", "var(--color-red-500)", "var(--color-blue-500)"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 510,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories: chartData.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        maxHeight: 30,
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    yaxis: {
      labels: {
        align: "right",
        minWidth: 40,
        maxWidth: 40,
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
          cssClass: "apexcharts-yaxis-label",
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/5">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Target you've set on a monthly basis: ${formatedValue(target*daysInCurrentMonth)}
          </p>
        </div>
        <div className="flex items-center gap-3 sm:justify-end">
          {/* ChartTab handles view toggling: Pass active filter state and setter if needed */}
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            <button
              onClick={() => { setFilterType("daily"); setDateRange({ start: null, end: null }); }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${filterType === "daily" && !dateRange.start
                ? "bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                }`}
            >
              Daily
            </button>
            <button
              onClick={() => { setFilterType("monthly"); setDateRange({ start: null, end: null }); }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${filterType === "monthly" && !dateRange.start
                ? "bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => { setFilterType("quarterly"); setDateRange({ start: null, end: null }); }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${filterType === "quarterly" && !dateRange.start
                ? "bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => { setFilterType("annually"); setDateRange({ start: null, end: null }); }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${filterType === "annually" && !dateRange.start
                ? "bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                }`}
            >
              Annually
            </button>
          </div>

          <div className="relative inline-flex items-center">
            <CalenderIcon className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-gray-500 lg:top-1/2 lg:left-3 lg:translate-x-0 lg:-translate-y-1/2 dark:text-gray-400" />
            <input
              ref={datePickerRef}
              className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 bg-white text-sm font-medium text-transparent outline-none lg:h-auto lg:w-40 lg:py-2 lg:pr-3 lg:pl-10 lg:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:lg:text-gray-300"
              placeholder="Select date range"
            />
          </div>
        </div>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-w-250 xl:min-w-full">
          {loadingRevenue ? (
            <div className="h-77.5 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
          ) : (
            <div className="overflow-hidden">
              <Chart options={options} series={chartData.series} type="area" height={510} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}