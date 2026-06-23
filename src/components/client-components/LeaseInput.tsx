"use client"
import { ChevronDownIcon } from "@/icons";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined"
import Select from '@/components/form/Select';
import { useState } from "react";
import Label from "@/components/form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import NoCrashOutlinedIcon from "@mui/icons-material/NoCrashOutlined"
import CarCrashOutlinedIcon from "@mui/icons-material/CarCrashOutlined"
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined"
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"




interface SearchParams {
    make: string;
    model: string;
    year: number;
    mileage: number;
}

const getyears = () => {
    const year = (new Date()).getFullYear();
    let years = [];
    for (let i: number = 1990; i <= year; i++) {
        years.push(i);
    }
    return years;
}

const years = getyears();
const makes = ["Toyota", "Nissan"];
const models = {
    "Toyota": ["Noah", "Ractis"],
};


function LeaseInput() {
    const [searchParams, setSearchParams] = useState<SearchParams>({ make: '', model: '', year: 1900, mileage: 0 });

    return (

        <div className="mt-12 mb-16">
            <h3 className="text-brand-500 text-center">IS YOUR VEHICLE ELIGIBLE?</h3>
            <h2 className="text-3xl mt-4 mb-3 font-bold text-black text-center dark:text-white">Check you Vehicle's Eligibility</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-175 m-auto">Browse our extensive collection of well-maintained vehicles. From compact cars to luxury sedans, we have the perfect vehicle for your needs.</p>


            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 content-end gap-y-4 mt-4 border border-gray-400 dark:border-gray-700 p-4 pt-6 rounded-xl bg-gray-300/10 dark:bg-gray-800">
                <div className="mt-3 mb-2 col-span-full text-black dark:text-white">
                    Select make, model, year & milleage
                </div>
                <div>
                    <Label>Make</Label>
                    <div className="relative">
                        <Select
                            options={makes.map((c) => ({ value: c, label: c }))}
                            placeholder="Select Make"
                            className="pl-15.5"
                            value={searchParams.make}
                            onChange={(e) => setSearchParams({ ...searchParams, make: e })}
                        />
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                            <CarCrashOutlinedIcon />
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
                            options={(models[searchParams?.make || ''] ?? []).map((c) => ({ value: c, label: c }))}
                            placeholder="Select Model"
                            value={searchParams.model}
                            className="pl-15.5"
                            onChange={(e) => setSearchParams({ ...searchParams, model: e })}
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
                    <Label>Year</Label>
                    <div className="relative">
                        <Select
                            options={years.map((c) => ({ value: c.toString(), label: c.toString() }))}
                            placeholder="Select Year"
                            className="pl-15.5"
                            value={(searchParams.year).toString()}
                            onChange={(e) => setSearchParams({ ...searchParams, year: parseInt(e) })}
                        />
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                            <CalendarMonthOutlinedIcon />
                        </span>

                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>
                <div>
                    <Label>Mileage</Label>
                    <div className="relative">
                        <Input
                            placeholder="Enter Mileage i.e 120000"
                            className="pl-15.5"
                            type="number"
                            value={(searchParams.mileage)}
                            onChange={(e) => setSearchParams({ ...searchParams, year: parseInt(e.target.value) })}
                        />
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                            <SpeedOutlinedIcon />
                        </span>

                    </div>
                </div>
                <Button variant="primary" size="sm" className="py-1 small px-4 lg:col-start-4">Check Eligibility  <NoCrashOutlinedIcon fontSize="small" /></Button>

            </div>
        </div>
    )
}

export default LeaseInput
