"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, CircularProgress } from "@mui/material";
import "leaflet/dist/leaflet.css";
import Pagination from "../tables/Pagination";
import Link from "next/link";
import Button from "../ui/button/Button";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAllAdmins } from "@/app/actions/main-admin";
import { useAdmin } from "@/context/AdminContext";

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

// 2. Fixed the parameter mapping here
const SystemManagers = () => {
  const [initialUsers, setIinitialUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { adminProfile: profile } = useAdmin();

  useEffect(() => {
    const getAdmins = async () => {
      const res = await getAllAdmins();

      if (
        res &&
        typeof res === "object" &&
        res !== null &&
        Array.isArray((res as { data?: unknown }).data)
      ) {
        setIinitialUsers((res as { data: AdminUser[] }).data);
      }
      setLoading(false);
    };

    getAdmins();
  }, []);

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

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-theme-sm mb-2 font-medium text-gray-800 dark:text-white/90">
              View all system users and manage them. Click Create New User to
              add a new user with admin rights.
            </p>
            <span className="text-theme-sm text-start text-gray-500 dark:text-gray-400">
              {initialUsers.length} Users
            </span>
          </div>
          <Link href="/bookings/new">
            <Button
              variant="success"
              size="sm"
              className="bg-brand-500 text-theme-sm hover:bg-brand-600 flex items-center justify-center rounded-lg p-2 px-3 font-medium text-white"
            >
              Create New Admin
            </Button>
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="custom-scrollbar max-w-full overflow-x-auto">
            <div className="min-h-100 min-w-275">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/5">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      User Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-nowrap text-gray-500 dark:text-gray-400"
                    >
                      About
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Email
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Phone
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Role
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Last Seen
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="border-b border-gray-200 px-5 py-4 dark:border-gray-800"
                      >
                        <div className="text-theme-sm flex w-full flex-col items-center justify-center gap-3 py-4 text-gray-500 dark:text-gray-400">
                          <CircularProgress color="secondary" size="small" />
                          <span>Loading users...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : // 3. Loop through your live initialUsers data dynamically
                    initialUsers.slice(startIndex - 1, endIndex).length > 0 ? (
                      initialUsers
                        .slice(startIndex - 1, endIndex)
                        .map((user, i) => (
                          <TableRow key={i}>
                            <TableCell className="px-5 py-4 text-start sm:px-6">
                              <div className="flex min-w-45 items-center gap-3">
                                <Avatar
                                  className="object-fit-cover w-25 object-center"
                                  style={{
                                    objectFit: "cover",
                                    objectPosition: "center",
                                  }}
                                  src={user.profile_pic || undefined}
                                />
                                <div>
                                  <span className="text-theme-sm block font-medium text-gray-800 uppercase dark:text-white/90">
                                    {user.first_name || "N/A"}
                                  </span>
                                  <span className="text-theme-xs block pt-2 text-gray-500 dark:text-gray-400">
                                    {user.first_name} {user.last_name}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-theme-sm max-w-90 truncate px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                              {user.bio || "No bio available"}
                            </TableCell>
                            <TableCell className="text-theme-sm px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                              {user.email ? (
                                <a
                                  className="text-brand-500 hover:underline"
                                  href={`mailto:${user.email}`}
                                >
                                  {user.email}
                                </a>
                              ) : (
                                <span>—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-theme-sm px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                              {user.phone || "—"}
                            </TableCell>
                            <TableCell className="text-theme-sm px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                              {/* <Badge variant={user.role === 'super_admin' ? 'success' : 'primary'}> */}
                              {user.role}
                              {/* </Badge> */}
                            </TableCell>
                            <TableCell className="text-theme-sm px-4 py-3 text-nowrap text-gray-500 dark:text-gray-400">
                              {user.created_at
                                ? new Date(user.created_at).toLocaleString()
                                : "—"}
                            </TableCell>
                            <TableCell className="text-theme-sm flex gap-3 px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                              <Link href={`/bookings/${user.id}/edit`}>
                                <Button
                                  size="sm"
                                  variant="success-outline"
                                  endIcon={
                                    <EditOutlinedIcon
                                      fontSize="small"
                                      className="m-0"
                                    />
                                  }
                                >
                                  Update
                                </Button>
                              </Link>
                              <Link href={`/bookings/${user.id}`}>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="bg-brand-500 text-theme-sm hover:bg-brand-600 flex items-center justify-center rounded-lg p-2 px-3 font-medium text-nowrap text-white"
                                >
                                  View User
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <>There was a problem with the page oyu requested!</>
                    )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Pagination Controls Visibility Rule */}
        {!loading && (
          <div className="flex items-center justify-between pt-8 pb-3 flex-col md:flex-row gap-8">
            <span className="text-gray-800 dark:text-white text-sm">
              Showing {startIndex} to {endIndex} of {initialUsers.length}{" "}
              results
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

export default SystemManagers;
