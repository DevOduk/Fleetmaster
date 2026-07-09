"use client";
import { useState } from "react";
import Label from "@/components/form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Select from '@/components/form/Select';
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import NoCrashOutlinedIcon from "@mui/icons-material/NoCrashOutlined";
import CarCrashOutlinedIcon from "@mui/icons-material/CarCrashOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined"

import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface SearchParams {
    make: string;
    model: string;
    year: number;
    mileage: number;
}

const years = Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => 1990 + i).reverse();
const makes = ["Toyota", "Nissan", "Honda", "Mazda"];
const models: Record<string, string[]> = {
    "Toyota": ["Fielder", "Axio", "Voxy", "Noah", "Prado", "Land Cruiser"],
    "Nissan": ["Note", "Sylphy", "X-Trail", "Juke"],
    "Honda": ["Fit", "Insight", "Vezel"],
    "Mazda": ["Demio", "CX-5"],
};

function LeaseInput() {
    const [searchParams, setSearchParams] = useState<SearchParams>({ make: '', model: '', year: new Date().getFullYear(), mileage: 0 });
    const [result, setResult] = useState<{ status: 'accepted' | 'rejected' | null; message: string }>({ status: null, message: '' });

    const handleCheck = () => {
        const { year, mileage } = searchParams;
        if (year >= 2015 && mileage <= 120000) {
            setResult({ status: 'accepted', message: "Great news! Your vehicle meets our current fleet requirements." });
        } else {
            setResult({ status: 'rejected', message: "Unfortunately, your vehicle does not meet our current requirements (must be 2015+ and under 120,000 KM)." });
        }
    };

    if (result.status) {
        return (
            <div className="mt-12 mb-16 p-8 border rounded-2xl bg-white dark:bg-gray-900 shadow-lg text-center">
                {result.status === 'accepted' ? 
                    <CheckCircleOutlineOutlinedIcon className="text-green-500 text-6xl mb-4" /> : 
                    <HighlightOffOutlinedIcon className="text-red-500 text-6xl mb-4" />
                }
                <h3 className={`text-2xl font-bold ${result.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                    {result.status === 'accepted' ? "Eligible for Leasing" : "Not Eligible"}
                </h3>
                <p className="mt-2 mb-6 text-gray-600 dark:text-gray-400">{result.message}</p>
                
                <div className="flex justify-center gap-4">
                    <Button variant="primary" onClick={() => setResult({ status: null, message: '' })}>
                        <ArrowBackIcon fontSize="small" /> Check Another
                    </Button>
                    {result.status === 'rejected' && (
                        <Button variant="success">Request Personal Review</Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-12 mb-16 container mx-auto">
            <h3 className="text-amber-500 text-center">IS YOUR VEHICLE ELIGIBLE?</h3>
            <h2 className="text-3xl mt-4 mb-3 font-bold text-black text-center dark:text-white">Check your Vehicle's Eligibility</h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-8 border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div>
                    <Label>Make</Label>
                    <Select options={makes.map(m => ({ value: m, label: m }))} placeholder="Select Make" value={searchParams.make} onChange={(e) => setSearchParams({ ...searchParams, make: e, model: '' })} />
                </div>
                <div>
                    <Label>Model</Label>
                    <Select options={(models[searchParams.make] ?? []).map(m => ({ value: m, label: m }))} placeholder="Select Model" value={searchParams.model} onChange={(e) => setSearchParams({ ...searchParams, model: e })} />
                </div>
                <div>
                    <Label>Year</Label>
                    <Select options={years.map(y => ({ value: y.toString(), label: y.toString() }))} placeholder="Select Year" value={searchParams.year.toString()} onChange={(e) => setSearchParams({ ...searchParams, year: parseInt(e) })} />
                </div>
                <div>
                    <Label>Mileage (KM)</Label>
                    <Input type="number" placeholder="e.g. 80000" value={searchParams.mileage || ''} onChange={(e) => setSearchParams({ ...searchParams, mileage: parseInt(e.target.value) })} />
                </div>
                <Button variant="primary" className="lg:col-start-4 mt-auto" onClick={handleCheck}>
                    Check Eligibility <NoCrashOutlinedIcon fontSize="small" />
                </Button>
            </div>
        </div>
    );
}

export default LeaseInput;