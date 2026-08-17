"use client";
import { useState } from "react";
import Label from "@/components/form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Select from "@/components/form/Select";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import NoCrashOutlinedIcon from "@mui/icons-material/NoCrashOutlined";
import CarCrashOutlinedIcon from "@mui/icons-material/CarCrashOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CarModelsByBrand from "@/data/carMakeModels";
import { useToast } from "@/context/ToastContext";

interface SearchParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
}

const years = Array.from(
  { length: new Date().getFullYear() - 1990 + 1 },
  (_, i) => 1990 + i,
).reverse();
const makes = ["Toyota", "Nissan", "Honda", "Mazda"];
const models: Record<string, string[]> = {
  Toyota: ["Fielder", "Axio", "Voxy", "Noah", "Prado", "Land Cruiser"],
  Nissan: ["Note", "Sylphy", "X-Trail", "Juke"],
  Honda: ["Fit", "Insight", "Vezel"],
  Mazda: ["Demio", "CX-5"],
};

function LeaseInput() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: 0,
  });
  const [result, setResult] = useState<{
    status: "accepted" | "rejected" | null;
    message: string;
  }>({ status: null, message: "" });
  const { showToast } = useToast();

  const handleCheck = () => {
    const { year, mileage, make, model } = searchParams;
    if (!make.trim() || !model.trim()) {
      showToast(
        "Please provide the vehicle's make and model to check!",
        "warning",
      );
      return;
    }
    if (year >= 2013 && mileage <= 150000) {
      setResult({
        status: "accepted",
        message: `Great news! Your vehicle ${searchParams.make} ${searchParams.model} ${searchParams.year} with mileage ${searchParams.mileage}km meets our current fleet requirements.`,
      });
    } else {
      setResult({
        status: "rejected",
        message:
          "Unfortunately, your vehicle does not meet our current requirements (must be 2015+ and under 120,000 KM).",
      });
    }
  };

  if (result.status) {
    return (
      <div className="mx-auto mt-12 mb-16 max-w-6xl rounded-2xl border border-green-500 bg-white p-8 text-center shadow-lg dark:bg-gray-900">
        {result.status === "accepted" ? (
          <CheckCircleOutlineOutlinedIcon className="mb-4 text-6xl text-green-500" />
        ) : (
          <HighlightOffOutlinedIcon className="mb-4 text-6xl text-red-500" />
        )}
        <h3
          className={`text-2xl font-bold ${result.status === "accepted" ? "text-green-600" : "text-red-600"}`}
        >
          {result.status === "accepted"
            ? "Eligible for Leasing"
            : "Not Eligible"}
        </h3>
        <p className="mt-2 mb-6 text-gray-600 dark:text-gray-400">
          {result.message}
        </p>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResult({ status: null, message: "" })}
          >
            <ArrowBackIcon fontSize="small" /> Check Another
          </Button>
          {result.status === "rejected" && (
            <Button variant="success">Request Personal Review</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-12 mb-16">
      <h3 className="text-center text-amber-500">IS YOUR VEHICLE ELIGIBLE?</h3>
      <h2 className="mt-4 mb-3 text-center text-3xl font-bold text-black dark:text-white">
        Check your Vehicle's Eligibility
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-6 lg:grid-cols-4 dark:border-gray-700 dark:bg-gray-800">
        <div>
          <Label>Make</Label>
          <Select
            options={Object.keys(CarModelsByBrand || {}).map((brand) => ({
              value: brand,
              label: brand,
            }))}
            placeholder="Select Make"
            value={searchParams.make}
            onChange={(e) =>
              setSearchParams({ ...searchParams, make: e, model: "" })
            }
          />
        </div>
        <div>
          <Label>Model</Label>
          <Select
            options={(CarModelsByBrand[searchParams?.make] || [])?.map(
              (model) => ({
                value: model,
                label: searchParams?.make + " " + model,
              }),
            )}
            placeholder="Select vehicle Model"
            value={searchParams.model}
            onChange={(e) => setSearchParams({ ...searchParams, model: e })}
          />
        </div>
        <div>
          <Label>Year</Label>
          <Select
            options={years.map((y) => ({
              value: y.toString(),
              label: y.toString(),
            }))}
            placeholder="Select Year"
            value={searchParams.year.toString()}
            onChange={(e) =>
              setSearchParams({ ...searchParams, year: parseInt(e) })
            }
          />
        </div>
        <div>
          <Label>Mileage (KM)</Label>
          <Input
            type="number"
            placeholder="e.g. 80000"
            value={searchParams.mileage || ""}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                mileage: parseInt(e.target.value),
              })
            }
          />
        </div>
        <Button
          variant="primary"
          className="mt-auto lg:col-start-4"
          onClick={handleCheck}
        >
          Check Eligibility <NoCrashOutlinedIcon fontSize="small" />
        </Button>
      </div>
    </div>
  );
}

export default LeaseInput;
