"use client"
import ViewAllVehicles from "@/components/client-components/Vehicles/viewallvehicles";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { PencilIcon, ChevronDownIcon } from "@/icons";
import { Box } from "@mui/material";
import Button from "@/components/ui/button/Button";
import { useFleet } from "@/context/FleetContext";
import Input from "@/components/form/input/InputField";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"
import ScheduleIcon from "@mui/icons-material/Schedule"
import dayjs from "dayjs";
import { useTenant } from "@/context/TenantContext";




const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0); // Explicitly set to 10:00:00.000 AM local time

// 2. Get the date 3 days from now
const threeDaysOut = new Date();
threeDaysOut.setDate(threeDaysOut.getDate() + 3);
threeDaysOut.setHours(10, 0, 0, 0); // Explicitly set to 10:00:00.000 AM local time

// 3. Format both to 'YYYY-MM-DDTHH:mm' matching your HTML input type="datetime-local" needs
const start = tomorrow.toLocaleString('sv-SE').replace(' ', 'T').slice(0, 16);
const end = threeDaysOut.toLocaleString('sv-SE').replace(' ', 'T').slice(0, 16);


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

const resetFiltersStates = {
    category: '',
    make: '',
    model: '',
    minYear: 0,
    maxYear: 2026,
    minPrice: 0,
    maxPrice: 100000,
    driverType: "All",
    location: "Countrywide",
    start: '',
    end: ''
};

export default function ClientVehiclesPage() {
    const { isOpen, openModal, closeModal } = useModal();
    const { vehicles } = useFleet();
    const { tenant } = useTenant();
    const searchParams = useSearchParams();
    const initialFilters = {
        category: searchParams.get('category') || '',
        make: searchParams.get('make') || '',
        model: searchParams.get('model') || '',
        minYear: parseInt(searchParams.get('minYear') || '0'),
        maxYear: parseInt(searchParams.get('maxYear') || '2026'),
        minPrice: parseInt(searchParams.get('minPrice') || '0'),
        maxPrice: parseInt(searchParams.get('maxPrice') || '100000'),
        driverType: searchParams.get('driverType') || "All",
        location: searchParams.get('location') || "Countrywide",
        start: searchParams.get('start') || start,
        end: searchParams.get('end') || end,
    };

    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);
    const [selectedLocation, setSelectedLocation] = useState<string>(initialFilters.location);

    // 1. Initialize loading as true so it defaults to skeleton cards on first paint
    const [loading, setLoading] = useState<boolean>(true);

    // 2. Lifecycle Trigger: Run initial screen placeholder load for 1.5 seconds
    useEffect(() => {
        const initialTimer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(initialTimer);
    }, []);

    // 3. User Trigger: Handle Explicit Apply Filter Submission delays
    const handleApplyFilters = (useFilters = filters) => {
        setLoading(true); // Turn skeletons back on immediately

        // Simulate 1.2 second processing latency
        setTimeout(() => {
            setAppliedFilters(useFilters);
            setLoading(false); // Turn off loaders, reveal vehicles list
        }, 1200);
    };
    const resetFilters = () => {
        setFilters(resetFiltersStates);
        handleApplyFilters(resetFiltersStates);
    }
    const handleSave = () => {
        // 1. Create the single source of truth for the updated state
        const updatedFilters = { ...filters, location: selectedLocation };

        // 2. Update your local React component state
        setFilters(updatedFilters);

        // 3. Pass the fresh, updated object directly to your callback handler
        handleApplyFilters(updatedFilters);
        closeModal();
    };

    const allCategories = vehicles.map(v => v.category);
    const allMakes = vehicles.map(v => v.make);
    const allLocations = tenant?.yards || [];

    const modelsForMake = (make: string) => {
        const vehicleModels = vehicles.filter(v => v.make === make);
        return vehicleModels.map(v => v.model);
    }

    const categories = [...new Set(allCategories)];
    const makes = [...new Set(allMakes)];
    const locations = [
        {
            title: "Countrywide",
            description: "Find rental vehicles all over the country through our countrywide selection",
            imageUrl: "https://images.goway.com/production/hero_image/Amboseli_AdobeStock_568345335.jpeg?VersionId=sEzQrGblBaQDhMGlcsN_UCovnYeM0tUf",
            location: [-1.286389, 36.817223]
        },
        ...allLocations];
    console.log('all loc: ', locations)

    const startDay = dayjs(filters.start);
    const endDay = dayjs(filters.end);

    const dayGap = startDay.isValid() && endDay.isValid() ? endDay.diff(start, "day") : 0;

    // 2. Ensure it defaults to at least 1 Day if they select the same day or a short window
    const totalDays = dayGap <= 0 ? 0 : dayGap;

    const activeFiltersCount = Object.keys(filters).reduce((count, key) => {
        // Cast the key to match your Filters type definition
        const filterKey = key as keyof Filters;

        // If the current filter value is different from the initial value, count it as 1
        if (filters[filterKey] !== resetFiltersStates[filterKey]) {
            return count + 1;
        }

        return count;
    }, 0);

    return (
        <div className="container m-auto min-h-screen">
            <PageBreadcrumb pageTitle="Vehicles" />
            <div>

                {/* Price Range Fields */}
                <div className="mb-2">
                    <p className="mb-2 text-black dark:text-white">Select Rental Dates (All Times in {tenant?.timezone || 'Nairobi (UTC+3)'})</p>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-4 mb-8">
                        <div className="md:col-span-4 col-span-6">
                            <Label>Start Date</Label>
                            <div className="relative mt-2">
                                <Input
                                    type="datetime-local"
                                    className="pl-[62px]"
                                    value={filters.start}
                                    onChange={(e) => setFilters({ ...filters, start: e.target.value })}
                                    name="end_date"
                                />

                                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                    <CalendarMonthOutlinedIcon />
                                </span>
                            </div>
                        </div>
                        <div className="md:col-span-4 col-span-6">
                            <Label>End Date</Label>
                            <div className="relative mt-2">
                                <Input
                                    type="datetime-local"
                                    className="pl-[62px] "
                                    value={filters.end}
                                    onChange={(e) => setFilters({ ...filters, end: e.target.value })}
                                    name="end_date"
                                />

                                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                    <CalendarMonthOutlinedIcon />
                                </span>
                            </div>
                        </div>
                        <div className="md:col-span-2 col-span-6">
                            <Label>Days</Label>
                            <div className="relative mt-2">
                                <div
                                    className="pl-[62px] h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                                >
                                    {totalDays} Days
                                </div>

                                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                    <ScheduleIcon />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
                {/* --- Left Filters Control Board --- */}
                <div className="col col-span-12 md:col-span-4 border border-gray-400 dark:border-gray-500 rounded-xl mb-3 p-4 h-fit">
                    <div className="mb-3 dark:bg-gray-500/10 bg-gray-500/3 shadow rounded-2xl">
                        <div className='relative'>
                            <Box className='flex gap-2 text-white bg-blend-darken font-bold items-end p-4 w-full h-full rounded-xl' sx={{ position: 'absolute', bottom: 0, right: 0, background: 'linear-gradient(to top, black, transparent)' }}>
                                {locations?.find(l => l.title === filters.location)?.title || 'Countrywide'
                                }
                                <Box onClick={openModal} className='flex gap-2 text-red-500 text-sm bg-blend-darken items-end p-1 cursor-pointer rounded-xl' sx={{ position: 'absolute', top: 10, right: 10, }} ><PencilIcon /> Change</Box>
                            </Box>
                            <img src={
                                locations?.find(l => l.title === filters.location)?.imageUrl || 'https://images.goway.com/production/hero_image/Amboseli_AdobeStock_568345335.jpeg?VersionId=sEzQrGblBaQDhMGlcsN_UCovnYeM0tUf'
                            }
                                alt={locations?.find(l => l.title === filters.location)?.title || "Countrywide"
                                } className="w-full object-cover rounded-xl h-35" />
                        </div>


                        <Modal
                            isOpen={isOpen}
                            onClose={() => {
                                setFilters({ ...filters, location: "CountryWide" })
                                closeModal()
                            }}
                            className="max-w-[600px] p-5 lg:p-10"
                        >
                            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                                Change Location
                            </h4>
                            <div className="max-h-[500px] overflow-auto custom-scrollbar flex flex-col gap-3">
                                {locations.map((l, i) => (
                                    <div key={i} className={`relative border-2 rounded-2xl ${l.title === selectedLocation ? "border-red-500" : "border-transparent"}`}>
                                        <Box onClick={() => setSelectedLocation(l?.title)} className='flex cursor-pointer gap-2 text-white z-9 bg-blend-darken font-medium items-end p-4 w-full h-full rounded-xl' sx={{ position: 'absolute', bottom: 0, right: 0, background: 'linear-gradient(to top, black, transparent)' }}>
                                            {l?.title}
                                            <Box className='flex gap-2 text-gray-100 text-sm bg-blend-darken items-end p-1 cursor-pointer rounded-xl' sx={{ position: 'absolute', top: 10, right: 10, }} >{selectedLocation === l?.title ? <span className="text-red-500"><DoneAllOutlinedIcon fontSize="small" /> Selected</span> : <>Select</>}</Box>
                                        </Box>
                                        <img src={l?.imageUrl} alt={l.title} className="w-full object-cover rounded-xl h-35" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-end w-full gap-3 mt-8">
                                <Button size="sm" variant="outline" onClick={() => {
                                    closeModal()
                                }}>
                                    Close
                                </Button>
                                <Button size="sm" onClick={handleSave}>
                                    Save Changes
                                </Button>
                            </div>
                        </Modal>
                    </div>

                    <div className="flex my-5 rounded-2xl bg-gray-500/5">
                        {['All', 'Self Drive', 'Chauffeured'].map((d, i) => (
                            <button key={d} onClick={() => setFilters({ ...filters, driverType: d })} className={filters.driverType === d ? "inline-flex small items-center px-4 py-2 text-sm w-full justify-center font-medium gap-2 rounded-lg transition bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300" : "inline-flex items-center px-4 py-2 text-sm w-full justify-center border-0 font-medium gap-2 rounded-lg transition bg-transparent text-gray-500"}>
                                {d}
                            </button>
                        ))}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xl font-semibold text-black dark:text-white">Filters</h4>
                            <p onClick={resetFilters} className="font-medium justify-end text-sm py-2 m-0 text-red-600 cursor-pointer flex items-center"><CloseOutlinedIcon fontSize="small" /> Clear filters ({activeFiltersCount})</p>
                        </div>
                        {/* Category Dropdown */}
                        <div className="mb-2">
                            <Label>Category</Label>
                            <div className="relative">
                                <Select
                                    value={filters.category}
                                    defaultValue={filters.category}
                                    options={categories.map((c) => ({ value: c, label: c }))}
                                    placeholder="Select category"
                                    onChange={(e) => setFilters({ ...filters, category: e || '' })}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>

                        {/* Make Dropdown */}
                        <div className="flex gap-2 w-full mb-2">

                            <div className="w-full">
                                <Label>Make</Label>
                                <div className="relative">
                                    <Select
                                        value={filters.make}
                                        defaultValue={filters.make}
                                        options={makes.map((c) => ({ value: c, label: c }))}
                                        placeholder="Select Make"
                                        onChange={(e) => setFilters({ ...filters, make: e || '' })}
                                    />
                                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
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
                                        options={modelsForMake(filters.make).map((c) => ({ value: c, label: c }))}
                                        placeholder="Select Model"
                                        onChange={(e) => setFilters({ ...filters, model: e || '' })}
                                    />
                                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Year Range Inputs */}
                        <div className="mb-2">
                            <Label>Year</Label>
                            <div className="flex gap-2 w-full">
                                <div className="w-full">
                                    <div className="relative">
                                        <Select
                                            options={[{ value: '2020', label: '2020' }, { value: '2022', label: '2022' }, { value: '2024', label: '2024' }]}
                                            placeholder="Min Year"
                                            onChange={(e) => setFilters({ ...filters, minYear: parseInt(e) || 0 })}
                                        />
                                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="relative">
                                        <Select
                                            options={[{ value: '2023', label: '2023' }, { value: '2025', label: '2025' }, { value: '2026', label: '2026' }]}
                                            placeholder="Max Year"
                                            onChange={(e) => setFilters({ ...filters, maxYear: parseInt(e) || 2026 })}
                                        />
                                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Range Fields */}
                        <div className="mb-2">
                            <Label>Price</Label>
                            <div className="flex gap-2 w-full">
                                <div className="w-full">
                                    <Input
                                        min="0"
                                        type="number"
                                        value={filters.minPrice}
                                        placeholder="Min Price"
                                        onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="w-full">
                                    <Input
                                        type="number"
                                        value={filters.maxPrice}
                                        placeholder="Max Price"
                                        onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Apply Button calls our delayed state commit */}
                        <Button
                            variant="primary"
                            size="sm"
                            className="px-8 mt-3 w-full"
                            onClick={() => handleApplyFilters()}
                            disabled={loading}                        >
                            {loading ? "Processing..." : "Apply Filters"}
                        </Button>
                    </div>
                </div>

                {/* --- Right Dynamic Grid System (Skeletons/Data Render) --- */}
                <div className="col col-span-12 md:col-span-8">
                    <ViewAllVehicles tenant="me" filters={appliedFilters} loading={loading} />
                </div>
            </div>
        </div>
    );
}