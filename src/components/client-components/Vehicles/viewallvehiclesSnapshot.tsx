"use client"
import { useFleet } from "@/context/FleetContext";
import { Box, Chip } from "@mui/material";
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined"
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined"
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined"
import Button from "../../ui/button/Button";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"
import Link from "next/link";
import VehicleItem from "@/components/client-components/Vehicles/VehicleItem"
import { VehicleSkeleton } from "./VehicleSkeleton";

interface Tenant {
    tenant: string;
}

export default function ViewAllSnapshots({ tenant }: Tenant) {
    const { vehicles } = useFleet();

    return (
        <div datatype={tenant} className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 gap-3">
            {vehicles.length > 1 ? vehicles.slice(0, 12).map((VehicleDetails) => (
                <VehicleItem isBooked={false} key={VehicleDetails.id} VehicleDetails={VehicleDetails} />
            )) : (
                Array.from({ length: 8 }).map((_, index) => (
                    <VehicleSkeleton key={`skeleton-${index}`} />
                ))
            )
            }
        </div>
    );
}