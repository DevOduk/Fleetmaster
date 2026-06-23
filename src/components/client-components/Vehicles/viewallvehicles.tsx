"use client";
import { useFleet } from "@/context/FleetContext";
import VehicleItem from "@/components/client-components/Vehicles/VehicleItem";
import { VehicleSkeleton } from "@/components/client-components/Vehicles/VehicleSkeleton";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { useEffect, useState } from "react";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import Pagination from "@/components/tables/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import { useBooking } from "@/context/BookingContext";
import dayjs from "dayjs";

interface Filters {
    category: string;
    make: string;
    model: string;
    minYear: number;
    maxYear: number;
    minPrice: number;
    maxPrice: number;
    driverType: string;
    location: string;
    start: string;
    end: string;
}

interface ViewAllVehiclesProps {
    tenant: string;
    filters: Filters;
    loading?: boolean;
}

export default function ViewAllVehicles({ tenant, filters, loading = true }: ViewAllVehiclesProps) {
    const searchParams = useSearchParams();
    const { vehicles } = useFleet();
    const { bookings } = useBooking();
    const router = useRouter();
    const pathname = usePathname();

    

    const [isOpen, setIsOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Recommended');
    const [isSorting, setIsSorting] = useState(false);

    // Read the current page straight from the URL param (Single source of truth)
    const urlPage = parseInt(searchParams.get("page") || "1", 10);

    function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    const isShowingLoaders = loading || isSorting;

    // --- 1. FILTER LOGIC ---
    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchesLocation = (filters.location && filters.location !== "Countrywide")
            ? vehicle.location === filters.location
            : true;

        // If driverType filter is set to "All" or not specified, show all. Otherwise, match the type strictly.
        const matchesDriverType = (filters.driverType && filters.driverType !== "All")
            ? vehicle.driverType === filters.driverType
            : true;

        const matchesCategory = filters.category ? vehicle.category === filters.category : true;
        const matchesMake = filters.make ? vehicle.make === filters.make : true;
        const matchesModel = filters.model ? vehicle.model === filters.model : true;
        const matchesYear = (filters.minYear ? vehicle.year >= filters.minYear : true) &&
            (filters.maxYear ? vehicle.year <= filters.maxYear : true);
        const matchesPrice = (filters.minPrice ? vehicle.dailyRate >= filters.minPrice : true) &&
            (filters.maxPrice ? vehicle.dailyRate <= filters.maxPrice : true);

        return matchesLocation && matchesDriverType && matchesCategory && matchesMake && matchesModel && matchesYear && matchesPrice;
    });

    // --- 2. SORT LOGIC ---
    const sortedVehicles = [...filteredVehicles].sort((a, b) => {
        switch (sortBy) {
            case 'Price: Low to High':
                return a.dailyRate - b.dailyRate;
            case 'Price: High to Low':
                return b.dailyRate - a.dailyRate;
            case 'Year: Newest First':
                return b.year - a.year;
            case 'Year: Oldest First':
                return a.year - b.year;
            default:
                return 0;
        }
    });

    // --- 3. PAGINATION MATH MATRICS ---
    const itemsPerPage = 12;
    const totalPages = Math.max(1, Math.ceil(sortedVehicles.length / itemsPerPage));

    // Fallback safeguard to handle bounds correctly if users apply filters that shrink the page footprint
    const activePage = Math.max(1, Math.min(urlPage, totalPages));

    const indexStart = (activePage - 1) * itemsPerPage;
    const indexEnd = indexStart + itemsPerPage;
    const paginatedVehicles = sortedVehicles.slice(indexStart, indexEnd);

    const startIndex = sortedVehicles.length === 0 ? 0 : indexStart + 1;
    const endIndex = Math.min(activePage * itemsPerPage, sortedVehicles.length);

    // --- 4. ACTION INTERCEPTORS ---
    const handleSortChange = (option: string) => {
        closeDropdown();
        if (option === sortBy) return;

        setIsSorting(true);
        setTimeout(() => {
            setSortBy(option);
            setIsSorting(false);
        }, 1000);
    };

    const handlePageChange = (page: number) => {
        const nextParams = new URLSearchParams(searchParams.toString());
        if (page > 1) {
            nextParams.set("page", page.toString());
        } else {
            nextParams.delete("page");
        }
        router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
    };

    // --- 5. DEBOUNCED FILTER URL SYNC ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const nextParams = new URLSearchParams(searchParams.toString());

            // Wipe out standard page index offset when new user filters change layout length
            nextParams.delete("page");

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "" && value !== 0) {
                    nextParams.set(key, value.toString());
                } else {
                    nextParams.delete(key);
                }
            });

            router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [filters]);


    const bookedDates = (id: number) => {
        const vehicleBookings = bookings.filter((b) => b.vehicleId === id);

        return vehicleBookings.flatMap((booking) => {
            const start = dayjs(booking.rentalStart);
            const end = dayjs(booking.rentalEnd);
            const days = [];
            let current = start;

            while (current.isBefore(end) || current.isSame(end, "day")) {
                days.push(current.format("YYYY-MM-DD"));
                current = current.add(1, "day");
            }
            return days;
        });
    };

    const selectedDates = () => {
        const start = dayjs(filters.start);
        const end = dayjs(filters.end);

        let current = start;
        const days = [];

        while (current.isBefore(end) || current.isSame(end, "day")) {
            days.push(current.format("YYYY-MM-DD"));
            current = current.add(1, "day");
        }
        return days;
    };
    const availableVehicles = vehicles.filter((vehicle) => {
        // 1. Turn the array into a Set for instant lookup speeds
        const bookedSet = new Set(bookedDates(vehicle.id));
        const selected = selectedDates();

        // 2. Instantly check if there's an overlap
        const isOverlap = selected.some((date) => bookedSet.has(date));

        return !isOverlap;
    });


    return (
        <div>
            <div className="py-3 flex items-center justify-between">
                {/* Text updates gracefully depending on which action is running */}
                <h4 className="text-black dark:text-white">
                    {loading ? "Searching Fleet..." : isSorting ? "Sorting Results..." : `All Results (${sortedVehicles.length})`}
                </h4>

                <div className="relative">
                    <button
                        className="p-2 flex items-center gap-1 text-black dark:text-white m-0 disabled:opacity-50"
                        onClick={toggleDropdown}
                        disabled={isShowingLoaders}
                    >
                        <SwapVertOutlinedIcon /> Sort ({sortBy})
                    </button>
                    <Dropdown
                        isOpen={isOpen}
                        onClose={closeDropdown}
                        className="absolute right-0 mt-2.5 flex w-65 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark z-50"
                    >
                        <ul className="flex flex-col gap-1 border-b border-gray-200 dark:border-gray-800">
                            {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Year: Newest First', 'Year: Oldest First'].map((option) => (
                                <li key={option}>
                                    <DropdownItem
                                        onItemClick={() => handleSortChange(option)}
                                        tag="a"
                                        className="flex items-center gap-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 cursor-pointer"
                                    >
                                        {option}
                                    </DropdownItem>
                                </li>
                            ))}
                        </ul>
                    </Dropdown>
                </div>
            </div>

            <div key={tenant} data-tenant={tenant} className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-3">
                <div className="col-span-full bg-gray-200 dark:bg-gray-800 items-center flex gap-3 border dark:border-gray-500 rounded-xl mb-5 p-3">
                    <img className="w-50" src={'https://indigocarhire.co.uk/wp-content/uploads/header_22-768x281.png'} alt="" /> <div>
                        <h5 className="text-black dark:text-white font-semibold">Delivery & Airport Dropoffs</h5>
                        <p className="text-gray-400">We offer Affordable delivery services and airport dropoffs</p>
                        <p className="text-gray-500 text-xs mt-1">1,000 Ksh Within Nairobi | 1,500 Ksh Airport Dropoffs</p>
                    </div>
                </div>

                {isShowingLoaders ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <VehicleSkeleton key={`skeleton-${index}`} />
                    ))
                ) : sortedVehicles.slice(startIndex - 1, endIndex).length > 0 ? (
                    sortedVehicles.slice(startIndex - 1, endIndex).map((VehicleDetails) => (
                        <VehicleItem
                            key={VehicleDetails.id || VehicleDetails.licensePlate}
                            VehicleDetails={VehicleDetails}
                            isBooked={!availableVehicles?.some(v => v.id === VehicleDetails.id)}
                            filters={filters}
                        />
                    ))
                ) : (
                    <div className="flex w-full col-span-full flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                        {/* Icon with subtle background pulse */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl animate-pulse" />
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                <DoNotDisturbAltOutlinedIcon color='error' sx={{ fontSize: '4rem' }} />
                            </div>
                        </div>

                        {/* Text Content */}
                        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                            No Matches Found
                        </h1>
                        <p className="mb-8 max-w-sm text-gray-500 dark:text-gray-400">
                            No vehicles matched the selected criteria.
                        </p>

                        {/* Action Button */}
                        <Link
                            href="/vehicles"
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/25"
                        >
                            <ArrowBackOutlinedIcon className="h-4 w-4" />
                            Reset Filters
                        </Link>
                    </div>
                )}
            </div>

            {/* Pagination Controls Visibility Rule */}
            {!isShowingLoaders && (
                <div className="flex items-center justify-between pb-3 pt-8 border-t border-gray-100 dark:border-gray-800 mt-4">
                    <span className="dark:text-white text-gray-800 text-sm">
                        Showing {startIndex} to {endIndex} of {sortedVehicles.length} results
                    </span>
                    <Pagination
                        onPageChange={handlePageChange}
                        currentPage={activePage}
                        totalPages={totalPages}
                    />
                </div>
            )}
        </div>
    );
}