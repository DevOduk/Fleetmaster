"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Avatar, CircularProgress } from "@mui/material";
import "leaflet/dist/leaflet.css";
import Pagination from "../tables/Pagination";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRightIcon, PlusIcon } from "@/icons";
import { formatedTimestamp, getExpiryString } from "../company-profile/ExpiryBanner";
import { Clipboard } from "../ecommerce/TopUsers";

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
  subscription_plan: string;
  expiry_date: string | null;
  created_at: string;
  admins: any[];
}

interface SystemUsersProps {
  initialTenants: AdminUser[];
  loading?: boolean;
}

// 2. Fixed the parameter mapping here
const TenantsView = ({ initialTenants, loading }: SystemUsersProps) => {
  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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
  const totalPages = Math.max(
    1,
    Math.ceil(initialTenants.length / itemsPerPage),
  );

  // Fallback safeguard to handle bounds correctly if users apply filters that shrink the page footprint
  const activePage = Math.max(1, Math.min(urlPage, totalPages));

  const indexStart = (activePage - 1) * itemsPerPage;
  const indexEnd = indexStart + itemsPerPage;
  const paginatedTenants = initialTenants.slice(indexStart, indexEnd);

  const startIndex = initialTenants.length === 0 ? 0 : indexStart + 1;
  const endIndex = Math.min(activePage * itemsPerPage, initialTenants.length);

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      nextParams.set("page", page.toString());
    } else {
      nextParams.delete("page");
    }
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };



  if (!initialTenants || initialTenants.length === 0) {
    return (
      <div className="p-5 text-center text-gray-500 dark:text-gray-400">
        No tenants found.
      </div>
    );
  }


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
              {initialTenants.length} Tenants
            </span>
          </div>
          <Link target="_blank" href="http://app.localhost:3000/register">
            <button className="text-theme-sm flex items-center justify-center rounded-lg border border-green-600 bg-green-600 p-2 px-4 font-medium text-nowrap text-white hover:bg-green-700">
              New Tenant <PlusIcon />
            </button>
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="custom-scrollbar max-w-full overflow-x-auto">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Tenant Information
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
                    Sub-Domain
                  </TableCell>
                  {/* <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-nowrap text-gray-500 dark:text-gray-400"
                  >
                    Email
                  </TableCell> */}
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
                    Yards
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-nowrap text-gray-500 dark:text-gray-400"
                  >
                    Admins
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs text-nowrap px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Date Created
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-nowrap text-gray-500 dark:text-gray-400"
                  >
                    Plan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-nowrap text-gray-500 dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-nowrap text-gray-500 dark:text-gray-400"
                  >
                    Expiry Date
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
                        <span>Loading tenants...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : // 3. Loop through your live initialTenants data dynamically
                  paginatedTenants.length > 0 ? (
                    paginatedTenants
                      .map((tenant, i) => (
                        <TableRow key={i}>
                          <TableCell className="px-5 py-4 text-start sm:px-6">
                            <div className="flex min-w-45 items-center gap-3">
                              <Avatar
                                className="object-fit-cover w-25 border object-center"
                                style={{
                                  objectFit: "cover",
                                  objectPosition: "center",
                                }}
                                src={tenant.tenant_logo || undefined}
                              />
                              <div>
                                <span className="text-theme-sm block font-medium text-gray-800 uppercase dark:text-white/90">
                                  {tenant.slug || "N/A"}
                                </span>
                                <span className="text-theme-xs block pt-2 text-nowrap text-gray-500 dark:text-gray-400">
                                  {tenant.name}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className={`text-theme-sm max-w-90 truncate px-4 py-3 text-start text-nowrap ${tenant.about ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                            {tenant.about || "[ No bio available ]"}
                          </TableCell>
                          <TableCell className="text-theme-sm px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                            {tenant.slug ? (
                              <a
                                target="_blank"
                                className="text-brand-500 text-sm hover:underline"
                                href={`http://${tenant.slug}.localhost:3000`}
                              >
                                [ Open ]
                              </a>
                            ) : (
                              <span>—</span>
                            )}
                          </TableCell>
                          {/* <TableCell className="text-theme-sm px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                            {tenant.email ? (
                              <a
                                className="text-brand-500 hover:underline"
                                href={`mailto:${tenant.email}`}
                              >
                                {tenant.email}
                              </a>
                            ) : (
                              <span>—</span>
                            )}
                          </TableCell> */}
                          <TableCell className="text-theme-sm px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              {tenant.phone || "—"}
                              <Clipboard text={tenant.phone} />
                            </div>                          </TableCell>
                          <TableCell className="text-theme-sm px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                            {tenant.yards?.length || 0}
                          </TableCell>
                          <TableCell className="text-theme-sm px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                            {tenant.admins?.length || 0}{" "}
                            {(tenant.admins?.length || 0) === 1
                              ? "admin"
                              : "admins"}
                          </TableCell>
                          <TableCell className="text-theme-sm px-4 py-3 text-nowrap text-gray-500 dark:text-gray-400">
                            {tenant.created_at
                              ? formatedTimestamp(new Date(tenant.created_at).toISOString())
                              : "—"}
                          </TableCell>
                          <TableCell className="text-theme-sm px-4 py-3 text-nowrap text-gray-500 dark:text-gray-400">
                            {tenant.subscription_plan}
                          </TableCell>
                          <TableCell className="text-theme-sm px-4 py-3 text-start text-nowrap text-gray-500 dark:text-gray-400">
                            <Badge
                              variant="light"
                              color={
                                tenant.subscription_status === "Active"
                                  ? "success"
                                  : tenant.subscription_status === "Not Active"
                                    ? "error"
                                    : "warning"
                              }
                            >
                              {tenant.subscription_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-theme-sm px-4 py-3 text-nowrap text-gray-500 dark:text-gray-400">
                            {tenant.expiry_date
                              ? getExpiryString(tenant.expiry_date)
                              : "—"}
                          </TableCell>
                          <TableCell className="text-theme-sm flex gap-3 px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                            <Link href={`/tenants/${tenant.id}`}>
                              <button className="bg-brand-500 border-brand-500 text-theme-sm hover:bg-brand-600 flex items-center justify-center rounded-lg border p-2 px-4 font-medium text-nowrap text-white">
                                View <ArrowRightIcon />
                              </button>
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

        {/* Pagination Controls Visibility Rule */}
        {!loading && (
          <div className="flex items-center justify-between pt-8 pb-3 flex-col md:flex-row gap-8">
            <span className="text-gray-800 dark:text-white text-sm">
              Showing {startIndex} to {endIndex} of {initialTenants.length}{" "}
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

export default TenantsView;
