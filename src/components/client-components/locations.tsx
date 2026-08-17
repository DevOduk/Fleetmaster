"use client";
import { useFleet } from "@/context/FleetContext";
import { Box, Chip } from "@mui/material";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import Button from "../ui/button/Button";
import { defaultVehicleImages } from "./hero/slider";

interface Tenant {
  tenantData: any;
}
const allYards = [
  {
    title: "Nairabi Yard, Kenya.",
    description: "This is the location of our yard in Kisumu.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Kenyatta_International_Convention_Centre_02.jpg/1920px-Kenyatta_International_Convention_Centre_02.jpg",
    location: [-1.286389, 36.817223],
  },
  {
    title: "Kisumu Yard, Kenya.",
    description: "This is the location of our main yard in Nairobi.",
    image_url:
      "https://africanspicesafaris.com/wp-content/uploads/2020/06/kisumu-city-tours-kenya-1200x900.jpg",
    location: [-0.091702, 34.767956],
  },
  {
    title: "Mombasa Yard, Kenya.",
    description: "This is the location of our yard in Mombasa.",
    image_url:
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/09/b6/49/0f.jpg",
    location: [-4.04374, 39.658871],
  },
];

export default function ViewAllLocations({ tenantData }: Tenant) {
  return (
    <div
      key={tenantData?.id}
      datatype={tenantData?.slug}
      className="container m-auto mt-5 mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3"
    >
      {tenantData?.yards?.length > 0
        ? tenantData?.yards?.slice(0, 6).map((VehicleDetails) => (
            <div
              key={VehicleDetails.id}
              className="mb-3 rounded-2xl bg-gray-500/3 shadow dark:bg-gray-500/10"
            >
              <div className="relative">
                <Box
                  className="flex h-full w-full items-end gap-2 rounded-xl p-3 font-bold text-white bg-blend-darken"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "linear-gradient(to top, black, transparent)",
                  }}
                >
                  {VehicleDetails.title}
                </Box>
                <img
                  src={VehicleDetails.image_url}
                  alt={`${VehicleDetails.title}`}
                  className="aspect-video w-full rounded-xl object-cover"
                />
              </div>
            </div>
          ))
        : defaultVehicleImages.map((_, i) => (
            <div
              key={i}
              className="mb-3 aspect-video overflow-hidden rounded-2xl bg-gray-300 shadow dark:bg-gray-700"
            >
              <img
                src={_}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
          ))}
    </div>
  );
}
