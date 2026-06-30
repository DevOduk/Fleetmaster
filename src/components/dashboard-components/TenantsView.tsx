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
import Button from "../ui/button/Button";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  initialTenants: AdminUser[];
  loading?: boolean;
}

// 2. Fixed the parameter mapping here
const TenantsView = ({ initialTenants, loading }: SystemUsersProps) => {
  const isDarkMode = typeof window !== "undefined" && document.documentElement.classList.contains("dark");
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

  if (!initialTenants || initialTenants.length === 0) {
    return (
      <div className="p-5 text-center text-gray-500 dark:text-gray-400">
        No tenants found.
      </div>
    );
  }
  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  // --- 3. PAGINATION MATH MATRICS ---
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(initialTenants.length / itemsPerPage));

  // Fallback safeguard to handle bounds correctly if users apply filters that shrink the page footprint
  const activePage = Math.max(1, Math.min(urlPage, totalPages));

  const indexStart = (activePage - 1) * itemsPerPage;
  const indexEnd = indexStart + itemsPerPage;
  const paginatedVehicles = initialTenants.slice(indexStart, indexEnd);

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

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between py-3 items-center">
          <div>
            <p className="font-medium text-gray-800 mb-2 text-theme-sm dark:text-white/90">
              View all system users and manage them. Click Create New User to add a new user with admin rights.
            </p>
            <span className="text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {initialTenants.length} Tenants
            </span>
          </div>
          <Link href="/bookings/new">
            <Button variant="success" size="sm"
              className="flex items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
            >
              Create New Tenant
            </Button>
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="max-w-full overflow-x-auto custom-scrollbar">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/5">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Tenant Information
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      About
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Sub-Domain
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Email
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Phone
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      No. of Yards
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Date Created
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Status
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Expiry Date
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
                          <span>Loading tenants...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // 3. Loop through your live initialTenants data dynamically
                    initialTenants.slice(startIndex - 1, endIndex).length > 0 ? initialTenants.slice(startIndex - 1, endIndex).map((tenant, i) => (
                      <TableRow key={i}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3 min-w-45">
                            <Avatar
                              className="w-25 border object-fit-cover object-center"
                              style={{ objectFit: 'cover', objectPosition: 'center' }}
                              src={tenant.tenant_logo || undefined}
                            />
                            <div>
                              <span className="block font-medium uppercase text-gray-800 text-theme-sm dark:text-white/90">
                                {tenant.slug || "N/A"}
                              </span>
                              <span className="block text-gray-500 text-theme-xs text-nowrap pt-2 dark:text-gray-400">
                                {tenant.name}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-90 min-w-45 truncate">
                          {tenant.about || "No bio available"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {tenant.slug ? (
                            <a target="_blank" className="text-brand-500 hover:underline text-sm" href={`https://${tenant.slug}.fleetmaster.co.ke`}>
                              [ Open ]
                            </a>
                          ) : (
                            <span>—</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {tenant.email ? (
                            <a className="text-brand-500 hover:underline" href={`mailto:${tenant.email}`}>
                              {tenant.email}
                            </a>
                          ) : (
                            <span>—</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {tenant.phone || "—"}
                        </TableCell>
                        <TableCell className="px-4 text-nowrap py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {tenant.yards?.length}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                          {tenant.created_at ? new Date(tenant.created_at).toLocaleString() : "—"}
                        </TableCell>
                        <TableCell className="px-4 text-nowrap py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge variant='light' color={tenant.subscription_status === 'Active' ? 'success' : tenant.subscription_status === 'Not Active' ? 'error' : 'warning'}>
                            {tenant.subscription_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                          {tenant.expiry_date ? new Date(tenant.expiry_date).toLocaleString() : "—"}
                        </TableCell>
                        <TableCell className="px-4 flex gap-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Link href={`/bookings/${tenant.id}/edit`}>
                            <Button size="sm" variant="success-outline" endIcon={<EditOutlinedIcon fontSize="small" className="m-0" />}>
                              Update
                            </Button>
                          </Link>
                          <Link href={`/bookings/${tenant.id}`}>
                            <Button variant="primary" size="sm"
                              className="flex text-nowrap items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
                            >
                              View Tenant
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

        {/* Pagination Controls Visibility Rule */}
        {!loading && (
          <div className="flex items-center justify-between pb-3 pt-8 border-t border-gray-100 dark:border-gray-800 mt-4">
            <span className="dark:text-white text-gray-800 text-sm">
              Showing {startIndex} to {endIndex} of {initialTenants.length} results
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