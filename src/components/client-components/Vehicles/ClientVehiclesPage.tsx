"use client";

import ViewAllVehicles from "@/components/client-components/Vehicles/viewallvehicles";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { PencilIcon, ChevronDownIcon } from "@/icons";
import { Box } from "@mui/material";
import Button from "@/components/ui/button/Button";
import { useFleet } from "@/context/FleetContext";
import Input from "@/components/form/input/InputField";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import dayjs from "dayjs";
import { useTenant } from "@/context/TenantContext";
import { useToast } from "@/context/ToastContext";
import CarModelsByBrand from "@/data/carMakeModels";
import { vehiclesCategories, yearsOfManufacture } from "@/data/globalExports";
import { syncTimeToDateString } from "../hero/searchform";
import Image from "next/image";

interface Filters {
  category: string;
  make: string;
  model: string;
  minYear: number;
  maxYear: number;
  minPrice: number;
  maxPrice: number;
  driverType: string;
  location: any;
  start: string;
  end: string;
}



const defaultLocation = {
  id: "Countrywide",
  title: "Countrywide",
  description:
    "Find rental vehicles all over the country through our countrywide selection",
  image_url:
    "https://images.goway.com/production/hero_image/Amboseli_AdobeStock_568345335.jpeg?VersionId=sEzQrGblBaQDhMGlcsN_UCovnYeM0tUf",
  location: [-1.286389, 36.817223],
};

const resetFiltersStates = {
  category: "",
  make: "",
  model: "",
  minYear: 0,
  maxYear: new Date().getFullYear(),
  minPrice: 0,
  maxPrice: 100000,
  driverType: "All",
  location: defaultLocation,
  start: dayjs().add(1, "day").hour(9).minute(0).second(0).millisecond(0).toDate().toString(),
  end: dayjs().add(3, "day").hour(9).minute(0).second(0).millisecond(0).toDate().toString(),
};

export default function ClientVehiclesPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const { vehicles, loading: loadingVehicles } = useFleet();
  const { tenant } = useTenant();
  const searchParams = useSearchParams();


  // Generate tomorrow at a fixed 9:00 AM deterministically
  const fallbackStart = dayjs().add(1, "day").hour(9).minute(0).second(0).millisecond(0).toDate().toString();
  const fallbackEnd = dayjs().add(3, "day").hour(9).minute(0).second(0).millisecond(0).toDate().toString();

  const initialFilters = {
    category: searchParams.get("category") || "",
    make: searchParams.get("make") || "",
    model: searchParams.get("model") || "",
    minYear: parseInt(searchParams.get("minYear") || "0"),
    maxYear: parseInt(searchParams.get("maxYear") || "2026"),
    minPrice: parseInt(searchParams.get("minPrice") || "0"),
    maxPrice: parseInt(searchParams.get("maxPrice") || "100000"),
    driverType: searchParams.get("driverType") || "All",
    location: searchParams.get("location") || "Countrywide",
    start: searchParams.get("start") || fallbackStart,
    end: searchParams.get("end") || fallbackEnd,
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);
  const [selectedLocation, setSelectedLocation] = useState<any>(
    defaultLocation
  );

  // 1. Initialize loading as true so it defaults to skeleton cards on first paint
  const [loading, setLoading] = useState<boolean>(false);

  const totalDays = useMemo(() => {
    const startDay = dayjs(filters.start);
    const endDay = dayjs(filters.end);

    const dayGap =
      startDay.isValid() && endDay.isValid()
        ? endDay.diff(filters.start, "day")
        : 0;

    return dayGap <= 0 ? 1 : dayGap;
  }, [filters]);

  // 3. User Trigger: Handle Explicit Apply Filter Submission delays
  const handleApplyFilters = (useFilters = filters) => {
    setLoading(true);

    const today = dayjs(new Date()).startOf("day");
    const startDay = dayjs(useFilters.start).startOf("day");
    const endDay = dayjs(useFilters.end).startOf("day");

    const totalDays =
      startDay.isValid() && endDay.isValid() ? endDay.diff(startDay, "day") : 0;

    if (
      totalDays < 1 ||
      endDay.isBefore(startDay) ||
      startDay.isBefore(today)
    ) {
      showToast("Please select a valid date!", "info");
      // setLoading(false); // Turn off loaders, reveal vehicles list
      // return;
    }

    // Simulate 1.2 second processing latency
    setTimeout(() => {
      setAppliedFilters(useFilters);
      setLoading(false); // Turn off loaders, reveal vehicles list
    }, 500);
  };

  const resetFilters = () => {
    setFilters(resetFiltersStates);
    handleApplyFilters(resetFiltersStates);
  };
  const handleSave = () => {
    // 1. Create the single source of truth for the updated state
    const updatedFilters = { ...filters, location: selectedLocation.title };

    setFilters(updatedFilters);
    handleApplyFilters(updatedFilters);
    closeModal();
  };

  // --- 1. FILTER LOGIC ---
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesLocation =
      filters.location && filters.location !== "Countrywide"
        ? vehicle.location.title === filters.location
        : true;

    // If driverType filter is set to "All" or not specified, show all. Otherwise, match the type strictly.
    const matchesDriverType =
      filters.driverType && filters.driverType !== "All"
        ? vehicle.driver_type === filters.driverType
        : true;

    const matchesCategory = filters.category
      ? vehicle.category === filters.category
      : true;
    const matchesMake = filters.make ? vehicle.make === filters.make : true;
    const matchesModel = filters.model ? vehicle.model === filters.model : true;
    const matchesYear =
      (filters.minYear ? vehicle.year >= filters.minYear : true) &&
      (filters.maxYear ? vehicle.year <= filters.maxYear : true);
    const matchesPrice =
      (filters.minPrice ? vehicle.daily_rate >= filters.minPrice : true) &&
      (filters.maxPrice ? vehicle.daily_rate <= filters.maxPrice : true);

    return (
      matchesLocation &&
      matchesDriverType &&
      matchesCategory &&
      matchesMake &&
      matchesModel &&
      matchesYear &&
      matchesPrice
    );
  });


  const allCategories = vehicles.map((v) => v.category);
  const allLocations = tenant?.yards || [];

  const categories = [...new Set([...allCategories, ...vehiclesCategories])];
  const locations = [
    defaultLocation,
    ...allLocations,
  ];

  const activeFiltersCount = Object.keys(appliedFilters).reduce(
    (count, key) => {
      const filterKey = key as keyof Filters;

      // 1. Handle start and end dates as a single combined filter unit
      if (filterKey === "start" || filterKey === "end") {
        // Only run the check once (when we encounter 'start') to prevent double counting
        if (filterKey === "start") {
          const isStartChanged =
            filters["start"] !== resetFiltersStates["start"];
          const isEndChanged = filters["end"] !== resetFiltersStates["end"];

          // If either (or both) have changed from their initial state, add 1
          if (isStartChanged || isEndChanged) {
            return count + 1;
          }
        }
        // If it's 'end', we skip it because it was already handled by 'start'
        return count;
      }

      // 2. Standard logic for all other filters
      if (filters[filterKey] !== resetFiltersStates[filterKey]) {
        return count + 1;
      }

      return count;
    },
    0,
  );

  return (
    <div className="container m-auto min-h-screen">
      <PageBreadcrumb pageTitle="Vehicles" />

      {/* Price Range Fields */}
      <div className="mb-2">
        <p className="mb-2 text-black dark:text-white">
          Rental Dates (All Times in {tenant?.timezone || "Nairobi (UTC+3)"})
        </p>
        <div className="mt-4 mb-8 grid grid-cols-1 items-end gap-3 lg:grid-cols-12">
          <div className="col-span-6 md:col-span-4">
            <Label>Start Date</Label>
            <div className="relative mt-2">
              <Input
                type="datetime-local"
                className="pl-15.5"
                value={
                  filters.start
                    ? dayjs(filters.start).format("YYYY-MM-DDTHH:mm")
                    : ""
                }
                onChange={(e) => {
                  const newStart = e.target.value; // e.g., "2026-06-22T14:30"
                  // Force the existing end date to adopt this new start time
                  const updatedEnd = syncTimeToDateString(
                    filters.end,
                    newStart,
                  );

                  setFilters({
                    ...filters,
                    start: newStart,
                    end: updatedEnd,
                  });
                }}
                name="start_date"
              />

              <span className="absolute top-1/2 left-0 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <CalendarMonthOutlinedIcon />
              </span>
            </div>
          </div>
          <div className="col-span-6 md:col-span-4">
            <Label>End Date</Label>
            <div className="relative mt-2">
              <Input
                type="datetime-local"
                className="pl-15.5"
                value={
                  filters.end
                    ? dayjs(filters.end).format("YYYY-MM-DDTHH:mm")
                    : ""
                }
                onChange={(e) => {
                  const newEnd = e.target.value; // e.g., "2026-06-25T16:00"
                  // Force the existing start date to adopt this new end time
                  const updatedStart = syncTimeToDateString(
                    filters.start,
                    newEnd,
                  );

                  setFilters({
                    ...filters,
                    start: updatedStart,
                    end: newEnd,
                  });
                }}
                name="end_date"
              />

              <span className="absolute top-1/2 left-0 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <CalendarMonthOutlinedIcon />
              </span>
            </div>
          </div>
          <div className="col-span-6 md:col-span-2">
            <Label>Days</Label>
            <div className="relative mt-2">
              <div className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-15.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30">
                {totalDays} Days
              </div>

              <span className="absolute top-1/2 left-0 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <ScheduleIcon />
              </span>
            </div>
          </div>
          <div className="col-span-6 md:col-span-2">
            {/* Apply Button calls our delayed state commit */}
            <Button
              variant="primary-outline"
              size="sm"
              className="w-full px-8"
              onClick={() => handleApplyFilters()}
              disabled={loading}
            >
              {loading ? "Processing..." : "Apply"}
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {/* --- Left Filters Control Board --- */}
        <div className="col col-span-12 mb-3 h-fit rounded-xl border border-gray-400 p-4 md:col-span-4 dark:border-gray-500">
          <div className="mb-3 rounded-2xl bg-gray-500/3 shadow dark:bg-gray-500/10">
            <div className="relative  h-35 w-full aspect-auto">
              <Box
                className="flex h-full z-2 w-full items-end gap-2 rounded-xl p-4 font-bold text-white bg-blend-darken"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: "linear-gradient(to top, black, transparent)",
                }}
              >
                {filters.location || "Countrywide"}
                <Box
                  onClick={openModal}
                  className="flex cursor-pointer items-end gap-2 rounded-lg bg-gray-900/40 p-1 px-2 text-sm font-medium text-green-400 bg-blend-darken"
                  sx={{ position: "absolute", top: 10, right: 10 }}
                >
                  <PencilIcon /> Change
                </Box>
              </Box>
              <Image
                src={
                  locations?.find((l) => l.title === filters.location)
                    ?.image_url ||
                  "https://images.goway.com/production/hero_image/Amboseli_AdobeStock_568345335.jpeg?VersionId=sEzQrGblBaQDhMGlcsN_UCovnYeM0tUf"
                }
                alt={''}
                preload
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-xl object-cover bg-white"
              />
            </div>

            <Modal
              isOpen={isOpen}
              onClose={() => {
                setFilters({ ...filters, location: defaultLocation.title });
                closeModal();
              }}
              className="max-w-150 p-5 lg:p-10"
            >
              <h4 className="text-title-sm mb-7 font-semibold text-gray-800 dark:text-white/90">
                Change Location
              </h4>
              <div className="custom-scrollbar flex max-h-125 flex-col gap-3 overflow-auto">
                {locations.map((l, i) => (
                  <div
                    key={i}
                    className={`relative rounded-2xl border-2 ${l.id === selectedLocation.id ? "border-green-500" : "border-transparent"}`}
                  >
                    <Box
                      onClick={() => setSelectedLocation(l)}
                      className="z-9 flex h-full w-full cursor-pointer items-end gap-2 rounded-xl p-4 font-medium text-white bg-blend-darken"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        background:
                          "linear-gradient(to top, black, transparent)",
                      }}
                    >
                      {l?.title}
                      <Box
                        className="flex cursor-pointer items-end gap-2 rounded-lg bg-gray-900/40 p-1 px-3 text-sm text-gray-100 bg-blend-darken"
                        sx={{ position: "absolute", top: 10, right: 10 }}
                      >
                        {selectedLocation.id === l?.id ? (
                          <span className="text-green-400">
                            <DoneAllOutlinedIcon fontSize="small" /> Selected
                          </span>
                        ) : (
                          <>Select</>
                        )}
                      </Box>
                    </Box>
                    <img
                      src={l?.image_url}
                      alt={l.title}
                      className="h-35 w-full rounded-xl object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 flex w-full items-center justify-end gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    closeModal();
                  }}
                >
                  Close
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </Modal>
          </div>

          <div className="my-5 flex rounded-2xl bg-gray-500/5">
            {["All", "Self Drive", "Chauffeured"].map((d, i) => (
              <button
                key={d}
                onClick={() => setFilters({ ...filters, driverType: d })}
                className={
                  filters.driverType === d
                    ? "small bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition"
                    : "inline-flex w-full items-center justify-center gap-2 rounded-lg border-0 bg-transparent px-4 py-2 text-sm font-medium text-gray-500 transition"
                }
              >
                {d}
              </button>
            ))}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Filters
              </h4>
              <p
                onClick={resetFilters}
                className="m-0 flex cursor-pointer items-center justify-end py-2 text-sm font-medium text-red-600"
              >
                <CloseOutlinedIcon fontSize="small" /> Clear filters (
                {activeFiltersCount})
              </p>
            </div>
            {/* Category Dropdown */}
            <div className="mb-2">
              <Label>Category</Label>
              <div className="relative">
                <Select
                  value={filters.category}
                  defaultValue={filters.category}
                  options={categories
                    .sort()
                    .map((c) => ({ value: c, label: c }))}
                  placeholder="Select category"
                  onChange={(e) =>
                    setFilters({ ...filters, category: e || "" })
                  }
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            {/* Make Dropdown */}
            <div className="mb-2 flex w-full gap-2">
              <div className="w-full">
                <Label>Make</Label>
                <div className="relative">
                  <Select
                    value={filters.make}
                    defaultValue={filters.make}
                    options={Object.keys(CarModelsByBrand || {}).map(
                      (brand) => ({
                        value: brand,
                        label: brand,
                      }),
                    )}
                    placeholder="Select Make"
                    onChange={(e) => setFilters({ ...filters, make: e || "" })}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              {/* Model Dropdown */}
              <div className="w-full">
                <Label>Model</Label>
                <div className="relative">
                  <Select
                    value={filters.model}
                    defaultValue={filters.model}
                    options={(CarModelsByBrand[filters?.make] || [])?.map(
                      (model) => ({
                        value: model,
                        label: filters?.make + " " + model,
                      }),
                    )}
                    placeholder="Select Model"
                    onChange={(e) => setFilters({ ...filters, model: e || "" })}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
            </div>

            {/* Year Range Inputs */}
            <div className="mb-2">
              <Label>Year</Label>
              <div className="flex w-full gap-2">
                <div className="w-full">
                  <div className="relative">
                    <Select
                      options={yearsOfManufacture(null, filters.maxYear).map(
                        (y) => {
                          return {
                            value: String(y),
                            label: String(y),
                          };
                        },
                      )}
                      placeholder="Min Year"
                      onChange={(e) =>
                        setFilters({ ...filters, minYear: parseInt(e) || 0 })
                      }
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  <div className="relative">
                    <Select
                      options={yearsOfManufacture(filters.minYear)
                        .sort((a, b) => b - a)
                        .map((y) => {
                          return {
                            value: String(y),
                            label: String(y),
                          };
                        })}
                      placeholder="Max Year"
                      onChange={(e) =>
                        setFilters({ ...filters, maxYear: parseInt(e) || 2026 })
                      }
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Range Fields */}
            <div className="mb-2">
              <Label>Price</Label>
              <div className="flex w-full gap-2">
                <div className="w-full">
                  <Input
                    min="0"
                    type="number"
                    value={filters.minPrice}
                    placeholder="Min Price"
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minPrice: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="w-full">
                  <Input
                    type="number"
                    value={filters.maxPrice}
                    placeholder="Max Price"
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrice: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Apply Button calls our delayed state commit */}
            <Button
              variant="primary"
              size="sm"
              className="mt-3 w-full px-8"
              onClick={() => handleApplyFilters()}
              disabled={loading}
            >
              {loading ? "Processing..." : `Apply Filters (${filteredVehicles.length || 0})`}
            </Button>
          </div>
        </div>

        {/* --- Right Dynamic Grid System (Skeletons/Data Render) --- */}
        <div className="col col-span-12 md:col-span-8">
          <ViewAllVehicles
            resetFilters={resetFilters}
            tenant="me"
            filters={appliedFilters}
            loading={loading || loadingVehicles}
          />
        </div>
      </div>
    </div>
  );
}
