"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import GppBadOutlinedIcon from "@mui/icons-material/GppBadOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { useAdmin } from "@/context/AdminContext";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { useManagerFleet } from "@/context/ManagerFleetContext";

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  country: string | null;
  county: string | null;
  slug: string;
  yards: any[];
  timezone: string | null;
  tenant_logo: string;
  about: string;
  subscription_status: string;
  expiry_date: string | null;
  created_at: string;
}

interface SystemUsersProps {
  tenants: AdminUser[];
}

export const TenantsMetrics = ({ tenants }: SystemUsersProps) => {
  const { adminProfile, loading } = useAdmin();
  const { loading: loadingVehicles } = useManagerFleet();

  const allTenants = tenants?.length || 0;
  const active = tenants?.filter(
    (tenant) => tenant.subscription_status === "Active",
  ).length;
  const expired = tenants?.filter(
    (tenant) => tenant.subscription_status !== "Active",
  ).length;

  const metrics = [
    {
      title: "All Tenants",
      value: `${allTenants.toLocaleString()} +`,
      icon: (
        <PeopleAltOutlinedIcon
          fontSize="large"
          className="rounded border border-gray-300 p-1 text-gray-800 dark:border-gray-700 dark:text-white/90"
        />
      ),
      badgeColor: "success" as const,
      badgeIcon: <ArrowUpIcon className="text-success-500" />,
      badgeText: "0.0%",
      description: "Total Number of tenants overall",
      isReady: true,
    },
    {
      title: "Active",
      value: `${active} +`,
      icon: (
        <VerifiedUserOutlinedIcon
          fontSize="large"
          className="rounded border border-gray-300 p-1 text-gray-800 dark:border-gray-700 dark:text-white/90"
        />
      ),
      badgeColor: "error" as const,
      badgeIcon: <ArrowDownIcon className="text-error-500" />,
      badgeText: "9.05%",
      description: "Number of tenants with active subscriptions",
      isReady: !!adminProfile,
    },
    {
      title: "Expired",
      value: `${expired} +`,
      icon: (
        <GppBadOutlinedIcon
          fontSize="large"
          className="rounded border border-gray-300 p-1 text-gray-800 dark:border-gray-700 dark:text-white/90"
        />
      ),
      badgeColor: "success" as const,
      badgeIcon: <ArrowUpIcon />,
      badgeText: "0.0%",
      description: "Number of tenants with expired subscriptions",
      isReady: true,
    },
    {
      title: "Subscription Rate",
      value: `${(100).toFixed(1)} %`,
      icon: (
        <TrendingUpOutlinedIcon
          fontSize="large"
          className="rounded border border-gray-300 p-1 text-gray-800 dark:border-gray-700 dark:text-white/90"
        />
      ),
      badgeColor: "error" as const,
      badgeIcon: <ArrowDownIcon className="text-error-500" />,
      badgeText: "9.05%",
      description: "Average tenants subscription rate done on time.",
      isReady: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 2xl:grid-cols-4">
      {!loadingVehicles && !loading ? (
        metrics.map((metric, index) =>
          metric.isReady ? (
            <div
              key={index}
              className="space-y-3 rounded-2xl border border-gray-200 bg-white px-5 pt-5 md:p-6 dark:border-gray-800 dark:bg-white/3"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-200 dark:text-gray-300">
                  {metric.title}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h4 className="text-title-sm mt-2 flex items-center gap-2 font-bold text-gray-800 dark:text-white/90">
                    {/* {metric.icon} */}
                    {metric.value}
                  </h4>
                </div>
                <Badge color={metric.badgeColor}>
                  {metric.badgeIcon}
                  {metric.badgeText}
                </Badge>
              </div>
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {metric.description}
              </div>
            </div>
          ) : (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/5"
            >
              <div className="bg-gray-550 flex h-12 w-12 items-center justify-center rounded-xl dark:bg-gray-700"></div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="h-4 w-23 bg-gray-100 dark:bg-white/7"></div>
                  <div className="mt-4 flex h-8 w-32 items-center justify-center bg-gray-50 dark:bg-gray-700"></div>
                </div>
                <div className="h-5 w-13 rounded-xl bg-gray-700"></div>
              </div>
            </div>
          ),
        )
      ) : (
        <>
          <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700"></div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="h-4 w-23 bg-gray-100 dark:bg-white/7"></div>
                <div className="mt-4 flex h-8 w-32 items-center justify-center bg-gray-50 dark:bg-gray-700"></div>
              </div>
              <div className="h-5 w-13 rounded-xl bg-gray-700"></div>
            </div>
          </div>
          <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700"></div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="h-4 w-23 bg-gray-100 dark:bg-white/7"></div>
                <div className="mt-4 flex h-8 w-32 items-center justify-center bg-gray-50 dark:bg-gray-700"></div>
              </div>
              <div className="h-5 w-13 rounded-xl bg-gray-700"></div>
            </div>
          </div>
          <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700"></div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="h-4 w-23 bg-gray-100 dark:bg-white/7"></div>
                <div className="mt-4 flex h-8 w-32 items-center justify-center bg-gray-50 dark:bg-gray-700"></div>
              </div>
              <div className="h-5 w-13 rounded-xl bg-gray-700"></div>
            </div>
          </div>
          <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700"></div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="h-4 w-23 bg-gray-100 dark:bg-white/7"></div>
                <div className="mt-4 flex h-8 w-32 items-center justify-center bg-gray-50 dark:bg-gray-700"></div>
              </div>
              <div className="h-5 w-13 rounded-xl bg-gray-700"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
