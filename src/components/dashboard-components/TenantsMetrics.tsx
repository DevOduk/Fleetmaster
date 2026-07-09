"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import GppBadOutlinedIcon from "@mui/icons-material/GppBadOutlined"
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined"
import { useAdmin } from "@/context/AdminContext";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined"
import { useManagerFleet } from "@/context/ManagerFleetContext";



// 1. Explicitly type your User structure
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
  const { vehicles, loading: loadingVehicles } = useManagerFleet();

  const allTenants = tenants?.length || 0;
  const active = tenants?.filter(tenant => tenant.subscription_status === 'Active').length;
  const expired = tenants?.filter(tenant => tenant.subscription_status !== 'Active').length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">

      {
        (!loadingVehicles && !loading) ?
          <>
            {/* CARD 1: Total Revenue */}
            <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 bg-brand-500/5 md:p-6">
              <div className="flex gap-3 items-center">
                {/* <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                  <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />
                </div> */}

                <span className="text-xl font-bold text-gray-200 dark:text-gray-300">
                  All Tenants
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <h4 className="mt-2 font-bold text-gray-800 flex gap-2 items-center text-title-sm dark:text-white/90">
                    <PeopleAltOutlinedIcon fontSize="large" className="text-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 dark:text-white/90" />{allTenants.toLocaleString()}
                  </h4>
                </div>

                <Badge color="success">
                  <ArrowUpIcon className="text-success-500" />
                  0.0%
                </Badge>
              </div>
              <div className="text-sm mt-3 text-gray-500 dark:text-gray-400">
                Total Number of tenants overall
              </div>
            </div>

            {/* CARD 3: Completed Bookings */}
            {
              adminProfile ?
                <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 bg-brand-500/5 md:p-6">
                  <div className="flex gap-3 items-center">
                    {/* <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                      <ScheduleOutlinedIcon className="text-gray-800 dark:text-white/90" />
                    </div> */}

                    <span className="text-xl font-bold text-gray-200 dark:text-gray-300">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <h4 className="mt-2 font-bold text-gray-800 flex gap-2 items-center text-title-sm dark:text-white/90">
                        <VerifiedUserOutlinedIcon fontSize="large" className="text-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 dark:text-white/90" />{active} +
                      </h4>
                    </div>

                    <Badge color="error">
                      <ArrowDownIcon className="text-error-500" />
                      9.05%
                    </Badge>
                  </div>
                  <div className="text-sm mt-3 text-gray-500 dark:text-gray-400">
                    Number of tenants with active subscriptions
                  </div>
                </div> :
                <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
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
            }


            {/* CARD 2: Vehicles */}
            {
              vehicles ?
                <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 bg-brand-500/5 md:p-6">
                  <div className="flex gap-3 items-center">
                    {/* <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                      <DirectionsCarFilledOutlinedIcon className="text-gray-800 size-6 dark:text-white/90" />
                    </div> */}

                    <span className="text-xl font-bold text-gray-200 dark:text-gray-300">
                      Expired
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <h4 className="mt-2 font-bold text-gray-800 flex gap-2 items-center text-title-sm dark:text-white/90">
                        <GppBadOutlinedIcon fontSize="large" className="text-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 dark:text-white/90" />{expired} +
                      </h4>
                    </div>
                    <Badge color="success">
                      <ArrowUpIcon />
                      0.0%
                    </Badge>
                  </div>
                  <div className="text-sm mt-3 text-gray-500 dark:text-gray-400">
                    Number of tenants with expired subscriptions
                  </div>
                </div> :
                <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
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
            }

            {/* CARD 4: Booking Rate */}
            {
              true ?
                <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 bg-brand-500/5 md:p-6">
                  <div className="flex gap-3 items-center">
                    {/* <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                      <TrendingUpOutlinedIcon className="text-gray-800 dark:text-white/90" />
                    </div> */}

                    <span className="text-xl font-bold text-gray-200 dark:text-gray-300">
                      Subscription Rate
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <h4 className="mt-2 font-bold text-gray-800 flex gap-2 items-center text-title-sm dark:text-white/90">
                        <TrendingUpOutlinedIcon fontSize="large" className="text-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 dark:text-white/90" />{((89.5).toFixed(2))} %
                      </h4>
                    </div>

                    <Badge color="error">
                      <ArrowDownIcon className="text-error-500" />
                      9.05%
                    </Badge>
                  </div>
                  <div className="text-sm mt-3 text-gray-500 dark:text-gray-400">
                    Average tenants subscription rate done on time.
                  </div>
                </div> :
                <div className="rounded-2xl animate-pulse border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 md:p-6">
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
            }
          </> : <>
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
      }
    </div>
  );
};