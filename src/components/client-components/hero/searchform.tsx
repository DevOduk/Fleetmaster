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

interface SearchFormProps {
  tenant: any;
}

interface SearchParams {
  location: string;
  category: string;
  make: string;
  model: string;
  start: string;
  end: string;
}
export default function SearchForm({ tenant }: SearchFormProps) {
  const router = useRouter();
  const [search, setSearch] = useState<number>(0);
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
  const [searchParams, setSearchParams] = useState<SearchParams>({ location: '', category: '', make: '', model: '', start: start, end: end });
  const { vehicles } = useFleet();
  
  const allCategories = vehicles.map(v => v.category);
  const allMakes = vehicles.map(v => v.make);
  const allLocations = vehicles.map(v => v.location);
  const modelsForMake = (make: string) => {
    const vehicleModels = vehicles.filter(v => v.make === make);
    return vehicleModels.map(v => v.model);
  }

  const categories = [...new Set(allCategories)];
  const makes = [...new Set(allMakes)];
  const locations = [...new Set(allLocations)];

  const searchQuery = new URLSearchParams(searchParams as any).toString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Stop the browser from doing a traditional page reload

    // Use Next.js router to navigate with your custom query string
    router.push(`/vehicles?${searchQuery}`);
  };


  return (
    <form onSubmit={handleSubmit} className="p-7 min-h-[70vh] justify-center flex flex-col mb-2">
      {/* <h1 className="text-2xl font-bold">Welcome, {tenant}!</h1> */}
      <p className="text-brand-500">Welcome to {tenant?.name || 'Car Hire'}, {tenant?.country || 'Kenya'}</p>
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
              options={locations.map((c) => ({ value: c, label: c }))}
              placeholder="Select Location"
              value={searchParams.location}
              className="pl-[62px]"
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
              className="pl-[62px]"
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
                className="pl-[62px]"
                name="make"
              /> */}
                <Select
                  options={makes.map((c) => ({ value: c, label: c }))}
                  placeholder="Select Make"
                  className="pl-[62px]"
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
                  className="pl-[62px]"
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
              className="pl-[62px]"
              value={searchParams.start}
              onChange={(e) => setSearchParams({ ...searchParams, start: e.target.value })}
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
              className="pl-[62px]"
              value={searchParams.end}
              onChange={(e) => setSearchParams({ ...searchParams, end: e.target.value })}
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
