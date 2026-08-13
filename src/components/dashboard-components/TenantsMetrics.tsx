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
  const active = tenants?.filter((tenant) => tenant.subscription_status === 'Active').length;
  const expired = tenants?.filter((tenant) => tenant.subscription_status !== 'Active').length;

  const metrics = [
    {
      title: "All Tenants",
      value: `${allTenants.toLocaleString()} +`,
      icon: <PeopleAltOutlinedIcon fontSize="large" className="text-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 dark:text-white/90" />,
      badgeColor: "success" as const,
      badgeIcon: <ArrowUpIcon className="text-success-500" />,
      badgeText: "0.0%",
      description: "Total Number of tenants overall",
      isReady: true,
    },
    {
      title: "Active",
      value: `${active} +`,
      icon: <VerifiedUserOutlinedIcon fontSize="large" className="text-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 dark:text-white/90" />,
      badgeColor: "error" as const,
      badgeIcon: <ArrowDownIcon className="text-error-500" />,
      badgeText: "9.05%",
      description: "Number of tenants with active subscriptions",
      isReady: !!adminProfile,
    },
    {
      title: "Expired",
      value: `${expired} +`,
      icon: <GppBadOutlinedIcon fontSize="large" className="text-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 dark:text-white/90" />,
      badgeColor: "success" as const,
      badgeIcon: <ArrowUpIcon />,
      badgeText: "0.0%",
      description: "Number of tenants with expired subscriptions",
      isReady: true,
    },
    {
      title: "Subscription Rate",
      value: `${(100).toFixed(1)} %`,
      icon: <TrendingUpOutlinedIcon fontSize="large" className="text-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 dark:text-white/90" />,
      badgeColor: "error" as const,
      badgeIcon: <ArrowDownIcon className="text-error-500" />,
      badgeText: "9.05%",
      description: "Average tenants subscription rate done on time.",
      isReady: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {(!loadingVehicles && !loading) ? (
        metrics.map((metric, index) => (
          metric.isReady ? (
            <div key={index} className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 md:p-6 space-y-3">
              <div className="flex gap-3 items-center">
                <span className="text-xl font-bold text-gray-200 dark:text-gray-300">
                  {metric.title}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <h4 className="mt-2 font-bold text-gray-800 flex gap-2 items-center text-title-sm dark:text-white/90">
                    {/* {metric.icon} */}
                    {metric.value}
                  </h4>
                </div>
                <Badge color={metric.badgeColor}>
                  {metric.badgeIcon}
                  {metric.badgeText}
                </Badge>
              </div>
              <div className="text-sm mt-3 text-gray-500 dark:text-gray-400">
                {metric.description}
              </div>
            </div>
          ) : (
            <div key={index} className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-550 rounded-xl dark:bg-gray-700">
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <div className="h-4 dark:bg-white/7 bg-gray-100 w-23">
                  </div>
                  <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700">
                  </div>
                </div>
                <div className="bg-gray-700 w-13 h-5 rounded-xl">
                </div>
              </div>
            </div>
          )
        ))
      ) : (
        <>
          <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl dark:bg-gray-700">
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <div className="h-4 dark:bg-white/7 bg-gray-100 w-23">
                </div>
                <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700">
                </div>
              </div>
              <div className="bg-gray-700 w-13 h-5 rounded-xl">
              </div>
            </div>
          </div>
          <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl dark:bg-gray-700">
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <div className="h-4 dark:bg-white/7 bg-gray-100 w-23">
                </div>
                <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700">
                </div>
              </div>
              <div className="bg-gray-700 w-13 h-5 rounded-xl">
              </div>
            </div>
          </div>
          <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl dark:bg-gray-700">
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <div className="h-4 dark:bg-white/7 bg-gray-100 w-23">
                </div>
                <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700">
                </div>
              </div>
              <div className="bg-gray-700 w-13 h-5 rounded-xl">
              </div>
            </div>
          </div>
          <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl dark:bg-gray-700">
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <div className="h-4 dark:bg-white/7 bg-gray-100 w-23">
                </div>
                <div className="flex mt-4 items-center justify-center w-32 h-8 bg-gray-50 dark:bg-gray-700">
                </div>
              </div>
              <div className="bg-gray-700 w-13 h-5 rounded-xl">
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};