"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { PencilIcon } from "@/icons";
import { Avatar, CircularProgress } from "@mui/material";
import "leaflet/dist/leaflet.css";
import Pagination from "../tables/Pagination";
import Link from "next/link";
import Button from "../ui/button/Button";
import { useUser } from "@/context/UserContext";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getTenantAdmins } from "@/app/actions/admin";
import { subscriptionPlans } from "@/data/globalExports";

// 1. Explicitly type your User structure
export interface AdminUser {
  id: string;
  phone: string | null;
  email: string;
  bio: string | null;
  first_name: string;
  last_name: string;
  role: string;
  profile_pic: string | null;
  created_at: string;
}

interface SystemUsersProps {
  initialUsers: AdminUser[];
  loading?: boolean;
}

const getUsersByPlan = (plan: string) => {
  if (!plan) return 0;

  if (plan === 'Trial') {
    return 1;
  } else {
    return subscriptionPlans.find(s => s.name === plan).userAccounts;
  }
};

// 2. Fixed the parameter mapping here
const SystemUsers = () => {
  const [initialUsers, setIinitialUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const isDarkMode = typeof window !== "undefined" && document.documentElement.classList.contains("dark");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = useUser();

  useEffect(() => {
    if (!profile?.tenant_id) return;

    const getAdmins = async () => {
      const res = await getTenantAdmins(profile?.tenant_id);
      if (res.success) {
        setIinitialUsers(res.data);
      }
      setLoading(false)
    }

    getAdmins();
  }, [profile])


  // Apply dark mode styles to leaflet
  useEffect(() => {
    const handleModeChange = () => {
      const tiles = document.querySelectorAll(".leaflet-tile");
      tiles.forEach((tile) => {
        const img = tile as HTMLImageElement;
        if (isDarkMode) {
          img.style.filter = "invert(0.93) hue-rotate(180deg) saturate(0.9)";
        } else {
          img.style.filter = "none";
        }
      });
    };

    const observer = new MutationObserver(handleModeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    handleModeChange();
    return () => observer.disconnect();
  }, [isDarkMode]);

  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  // --- 3. PAGINATION MATH MATRICS ---
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(initialUsers.length / itemsPerPage));

  // Fallback safeguard to handle bounds correctly if users apply filters that shrink the page footprint
  const activePage = Math.max(1, Math.min(urlPage, totalPages));

  const indexStart = (activePage - 1) * itemsPerPage;
  const indexEnd = indexStart + itemsPerPage;
  const paginatedVehicles = initialUsers.slice(indexStart, indexEnd);

  const startIndex = initialUsers.length === 0 ? 0 : indexStart + 1;
  const endIndex = Math.min(activePage * itemsPerPage, initialUsers.length);

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      nextParams.set("page", page.toString());
    } else {
      nextParams.delete("page");
    }
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };


  const plan = profile?.fleetmaster_tenants?.subscription_plan;
  const userCount = initialUsers.length;

  // 1. Single source of truth for plan limits
  const maxUsers = getUsersByPlan(plan); // Returns e.g. 1, 3, or Infinity / null for Unlimited

  // 2. Check if the user limit has been reached or exceeded
  const isLimitReached = maxUsers !== null && userCount >= maxUsers;

  // 3. Define upgrade upsell messages per plan
  const UPSELL_MESSAGES: Record<string, string> = {
    Trial: "Upgrade to Pro to add more users!",
    Starter: "Upgrade to Pro to add more users!",
    Pro: "Upgrade to Expert to add unlimited users!",
  };

  // 4. Determine the action UI
  let actionContent;

  if (isLimitReached) {
    actionContent = (
      <div className="text-red-500 text-sm font-medium">
        {userCount}/{maxUsers} users used. {UPSELL_MESSAGES[plan] ?? "Upgrade your plan to add more users!"}
      </div>
    );
  } else {
    actionContent = (
      <Link href="/system-users/new">
        <Button
          variant="success"
          size="sm"
          className="flex items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
        >
          Create New Admin
        </Button>
      </Link>
    );
  }

  const allowedUsers = maxUsers != null && maxUsers !== Infinity
    ? initialUsers.slice(0, maxUsers)
    : initialUsers;

  // 2. Paginate ONLY the allowed users
  const paginatedUsers = allowedUsers.slice(startIndex - 1, endIndex);




  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between py-3 items-center">
          <div>
            <p className="font-medium text-gray-800 mb-2 text-theme-sm dark:text-white/90">
              View all system users and manage them. Click Create New User to add a new user with admin rights.
            </p>
            <span className="text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {initialUsers.length} of {getUsersByPlan(plan)} User accounts
            </span>
          </div>
          {actionContent}
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="max-w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-275 min-h-100">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/5">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      User Name
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      About
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Email
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Phone
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Role
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Last Seen
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col py-4 items-center justify-center gap-3 w-full text-gray-500 text-theme-sm dark:text-gray-400">
                          <CircularProgress color="secondary" size="small" />
                          <span>Loading users...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // 3. Loop through your live initialUsers data dynamically
                    paginatedUsers.length > 0 ? paginatedUsers.map((user, i) => (
                      <TableRow key={i}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3 min-w-45">
                            <Avatar
                              className="w-25 object-fit-cover object-center"
                              style={{ objectFit: 'cover', objectPosition: 'center' }}
                              src={user.profile_pic || undefined}
                            />
                            <div>
                              <span className="block font-medium uppercase text-gray-800 text-theme-sm dark:text-white/90">
                                {user.first_name || "N/A"} {user.id === profile.id && '(You)'}
                              </span>
                              <span className="block text-gray-500 text-theme-xs pt-2 dark:text-gray-400">
                                {user.first_name} {user.last_name}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-90 truncate">
                          {user.bio || "No bio available"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {user.email ? (
                            <a className="text-brand-500 hover:underline" href={`mailto:${user.email}`}>
                              {user.email}
                            </a>
                          ) : (
                            <span>—</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {user.phone || "—"}
                        </TableCell>
                        <TableCell className="px-4 text-nowrap py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {/* <Badge variant={user.role === 'super_admin' ? 'success' : 'primary'}> */}
                          {user.role}
                          {/* </Badge> */}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                          {user.created_at ? new Date(user.created_at).toLocaleString() : "—"}
                        </TableCell>
                        <TableCell className="px-4 flex gap-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Link href={user.id === profile.id ? '/profile/edit' : `/system-users/${user.id}/edit`}>
                            <Button size="sm" variant="success-outline" endIcon={<EditOutlinedIcon fontSize="small" className="m-0" />}>
                              Update
                            </Button>
                          </Link>
                          <Link target={user.id === profile.id ? '_blank' : '_self'} href={user.id === profile.id ? '/profile' : `/system-users/${user.id}`}>
                            <Button variant="primary" size="sm"
                              className="flex text-nowrap items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
                            >
                              View User
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )) : <>There was a problem with the page oyu requested!</>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Pagination Controls Visibility Rule */}
        {!loading && (
          <div className="flex items-center justify-between pb-3 pt-8 border-t border-gray-100 dark:border-gray-800 mt-4">
            <span className="dark:text-white text-gray-800 text-sm">
              Showing {startIndex} to {endIndex} of {initialUsers.length} results
            </span>
            <Pagination
              onPageChange={handlePageChange}
              currentPage={activePage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemUsers;