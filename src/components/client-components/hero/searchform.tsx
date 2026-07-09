"use client"
import React, { useState } from 'react'
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronDownIcon, EnvelopeIcon } from "@/icons";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined"
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined"
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined"
import CarRepairOutlinedIcon from "@mui/icons-material/CarRepairOutlined"
import Select from '@/components/form/Select';
import { useFleet } from '@/context/FleetContext';
import { useRouter } from 'next/navigation';
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"
import dayjs from 'dayjs';


interface SearchParams {
  location: string;
  category: string;
  make: string;
  model: string;
  start: string;
  end: string;
}


const syncTimeToDateString = (dateTarget: string, sourceDateTime: string): string => {
  if (!sourceDateTime || !dateTarget) return dateTarget;

  // Extract the time portion (everything after the 'T')
  const [, timeComponent] = sourceDateTime.split("T");
  // Extract the date portion of the target string
  const [dateComponent] = dateTarget.split("T");

  if (!timeComponent || !dateComponent) return dateTarget;

  return `${dateComponent}T${timeComponent}`;
};

export default function SearchForm({ tenant }: { tenant: any; }) {
  const router = useRouter();
  const [search, setSearch] = useState<number>(0);

  const fallbackStart = dayjs().add(1, 'day').format('YYYY-MM-DD[T]HH:mm');

  // 2 days after tomorrow (3 days total) at the exact same hour and minute
  const fallbackEnd = dayjs().add(3, 'day').format('YYYY-MM-DD[T]HH:mm');
  const [searchParams, setSearchParams] = useState<SearchParams>({ location: '', category: '', make: '', model: '', start: fallbackStart, end: fallbackEnd });
  const { vehicles } = useFleet();

  const allCategories = vehicles.map(v => v.category);
  const allMakes = vehicles.map(v => v.make);
  const modelsForMake = (make: string) => {
    const vehicleModels = vehicles.filter(v => v.make === make);
    
    return vehicleModels.map(v => v.model);
  }

  const allYards = tenant.yards.map(y => y.title);
  const fallBackCategories = [
    'Economy', 'Hatchback', 'SUV'
  ];


  const categories = [...new Set([...allCategories, ...fallBackCategories])];
  const makes = [...new Set(allMakes)];

  const searchQuery = new URLSearchParams(searchParams as any).toString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Stop the browser from doing a traditional page reload

    // Use Next.js router to navigate with your custom query string
    router.push(`/vehicles?${searchQuery}`);
  };


  return (
    <form onSubmit={handleSubmit} className="p-7 min-h-[70vh] justify-center flex flex-col mb-2">
      {/* <h1 className="text-2xl font-bold">Welcome, {tenant}!</h1> */}
      <p className="text-amber-500">Welcome to {tenant?.name || 'our Car Hire'}, {tenant?.country || 'Kenya'}</p>
      <h1 className="text-3xl mt-4 mb-3 font-bold text-black dark:text-white max-w-[80%]">Affordable, Reliable & Efficient Car Hire Services in {tenant?.country || 'Kenya'}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred vehicle brand and category below to find the ideal ride for your journey. Visit our yard or make a booking online for delivery (See yard location on Map)</p>

      <div className="flex items-center gap-3 mt-4">
        {
          ["General Search", "Special Search"].map((s, i) => (
            <Button onClick={(e) => {
              e.preventDefault();
              setSearch(i);
            }} key={s} variant={i === search ? "primary" : "outline"} size="sm">{s}</Button>
          ))
        }
        {/* <Button size="sm" variant="outline">Special Search</Button> */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">

        <div>
          <Label>Location</Label>
          <div className="relative">
            <Select
              options={allYards.map((c) => ({ value: c, label: c }))}
              placeholder="Select Location"
              value={searchParams.location}
              className="pl-15.5"
              onChange={(e) => setSearchParams({ ...searchParams, location: e })}
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <LocationOnOutlinedIcon />
            </span>

            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
        <div>
          <Label>Category</Label>
          <div className="relative">
            <Select
              options={categories.map((c) => ({ value: c, label: c }))}
              placeholder="Select category"
              className="pl-15.5"
              value={searchParams.category}
              onChange={(e) => setSearchParams({ ...searchParams, category: e })}
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <WidgetsOutlinedIcon />
            </span>

            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
        {
          search === 1 && <>

            <div>
              <Label>Make</Label>
              <div className="relative">
                {/* <Input
                placeholder="Make"
                type="text"
                className="pl-15.5"
                name="make"
              /> */}
                <Select
                  options={makes.map((c) => ({ value: c, label: c }))}
                  placeholder="Select Make"
                  className="pl-15.5"
                  value={searchParams.make}
                  onChange={(e) => setSearchParams({ ...searchParams, make: e })}
                />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <DirectionsCarFilledOutlinedIcon />
                </span>

                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div>
              <Label>Model</Label>
              <div className="relative">
                <Select
                  options={modelsForMake(searchParams.make).map((c) => ({ value: c, label: c }))}
                  placeholder="Select Model"
                  className="pl-15.5"
                  value={searchParams.model}
                  onChange={(e) => setSearchParams({ ...searchParams, model: e })}
                />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <CarRepairOutlinedIcon />
                </span>

                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          </>
        }
        <div>
          <Label>Start Date</Label>
          <div className="relative">
            <Input
              type="datetime-local"
              className="pl-15.5"
              value={searchParams.start ? dayjs(searchParams.start).format('YYYY-MM-DDTHH:mm') : ''}
              onChange={(e) => {
                const newStart = e.target.value; // e.g., "2026-06-22T14:30"
                // Force the existing end date to adopt this new start time
                const updatedEnd = syncTimeToDateString(searchParams.end, newStart);

                setSearchParams({
                  ...searchParams,
                  start: newStart,
                  end: updatedEnd,
                });
              }}
              name="start_date"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <CalendarMonthOutlinedIcon />
            </span>
          </div>
        </div>

        <div>
          <Label>End Date</Label>
          <div className="relative">
            <Input
              type="datetime-local"
              className="pl-15.5"
              value={searchParams.end ? dayjs(searchParams.end).format('YYYY-MM-DDTHH:mm') : ''}
              onChange={(e) => {
                const newEnd = e.target.value; // e.g., "2026-06-25T16:00"
                // Force the existing start date to adopt this new end time
                const updatedStart = syncTimeToDateString(searchParams.start, newEnd);

                setSearchParams({
                  ...searchParams,
                  start: updatedStart,
                  end: newEnd,
                });
              }}
              name="end_date"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <CalendarMonthOutlinedIcon />
            </span>
          </div>
        </div>
      </div>

      <Button variant="primary" size="sm" className="mt-4 w-full gap-5" type="submit">
        Continue
        <span className="relative pointer-events-none">
          <svg
            className="fill-white dark:fill-white"
            width="17"
            height="17"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
              fill=""
            />
          </svg>
        </span>
      </Button>
    </form>
  )
}
