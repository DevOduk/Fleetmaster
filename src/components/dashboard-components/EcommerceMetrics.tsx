"use client";

import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import { useAdmin } from "@/context/AdminContext";
import { useManagerFleet } from "@/context/ManagerFleetContext";
import { formatedValue } from "../ecommerce/MonthlyTarget";
import { calculateChange, formatChange } from "../ecommerce/EcommerceMetrics";

export const EcommerceMetrics = ({
  tenants,
  payments,
}: {
  tenants: any;
  payments: any;
}) => {
  const { loading } = useAdmin();
  const { vehicles, loading: loadingVehicles } = useManagerFleet();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const allTimeTotalRevenue =
    payments?.reduce(
      (sum, payment) => sum + (Number(payment.amount) || 0),
      0,
    ) || 0;

  const totalRevenue =
    payments
      ?.filter((payment) => {
        const paymentDate = new Date(payment.created_at);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0) || 0;

  const lastMonth = (currentMonth - 1 + 12) % 12;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const totalRevenueLastMonth =
    payments
      ?.filter((payment) => {
        const paymentDate = new Date(payment.created_at);
        return (
          paymentDate.getMonth() === lastMonth &&
          paymentDate.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0) || 0;

  // 1. Get vehicle counts
  const vehiclesCountThisMonth = vehicles?.length || 0;

  const vehiclesCountLastMonth =
    vehicles?.filter((v) => {
      const date = new Date(v.created_at);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    }).length || 0;

  // 1. Get tenats counts
  const tenantsCountThisMonth = tenants?.length || 0;

  const tenantsCountLastMonth =
    tenants?.filter((v) => {
      const date = new Date(v.created_at);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    }).length || 0;

  const totalRevenueChange = calculateChange(
    totalRevenue,
    totalRevenueLastMonth,
  );
  const vehiclesChange = calculateChange(
    vehiclesCountThisMonth,
    vehiclesCountLastMonth,
  );
  const tenantsChange = calculateChange(
    tenantsCountThisMonth,
    tenantsCountLastMonth,
  );

  const metrics = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: formatedValue(allTimeTotalRevenue) + " /=",
      description: "Your ALL time total earned Revenue",
      icon: (
        <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />
      ),
      badge: formatChange(0),
      isReady: !loading,
    },
    {
      id: "revenue",
      title: "Revenue This Month",
      value: formatedValue(totalRevenue) + " /=",
      description: "Your total earned Revenue for this month",
      icon: (
        <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />
      ),
      badge: formatChange(totalRevenueChange),
      isReady: !loading,
    },
    {
      id: "vehicles",
      title: "Vehicles",
      value: `${vehiclesCountThisMonth || 0} +`,
      description: "Active operational vehicles in the system fleet",
      icon: (
        <DirectionsCarFilledOutlinedIcon className="size-6 text-gray-800 dark:text-white/90" />
      ),
      badge: formatChange(vehiclesChange),
      isReady: !loadingVehicles,
    },
    {
      id: "tenants",
      title: "Active Tenants",
      value: `${tenants.length} +`,
      description: "Total verified active tenants",
      icon: (
        <ScheduleOutlinedIcon className="text-gray-800 dark:text-white/90" />
      ),
      badge: formatChange(tenantsChange),
      isReady: !loading,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 2xl:grid-cols-4">
      {metrics.map((card, i) =>
        card.isReady ? (
          <div
            className="space-y-3 rounded-2xl border border-gray-200 bg-white px-5 pt-5 md:p-6 dark:border-gray-800 dark:bg-white/3"
            key={i}
          >
            <div className="ms-auto flex items-center justify-end shadow-xs">
              {card.icon}
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-300">
              {card.title}
            </span>
            <div className="mt-2 flex items-center justify-between">
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {card.value}
              </h4>
              <Badge color={card.badge.color}>
                {card.badge.icon}
                {card.badge.text}
              </Badge>
            </div>
            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
              {card.description}
            </div>
          </div>
        ) : (
          <div
            className="space-y-3 rounded-2xl border border-gray-200 bg-white px-5 pt-5 md:p-6 dark:border-gray-800 dark:bg-white/3"
            key={i}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700" />
            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="h-4 w-23 bg-gray-100 dark:bg-white/7" />
                <div className="mt-4 flex h-8 w-32 items-center justify-center bg-gray-50 dark:bg-gray-700" />
              </div>
              <div className="h-5 w-13 rounded-xl bg-gray-700" />
            </div>
          </div>
        ),
      )}
    </div>
  );
};
