"use client";
import { Box } from "@mui/material";
import Image from "next/image";
import { defaultVehicleImages } from "@/data/globalExports";
import Link from "next/link";

interface Tenant {
  tenantData: any;
}


export default function ViewAllLocations({ tenantData }: Tenant) {
  return (
    <div
      key={tenantData?.id}
      datatype={tenantData?.slug}
      className="grid w-full grid-cols-2 gap-3 py-8 md:container md:m-auto lg:grid-cols-3"
    >
      {tenantData?.yards?.length > 0
        ? tenantData?.yards?.slice(0, 6).map((VehicleDetails, i) => (
            <Link key={i} href={`/vehicles?location=${VehicleDetails.title}`}>
              <div className="mb-3 rounded-2xl bg-gray-500/3 shadow dark:bg-gray-500/10">
                <div className="relative w-full">
                  <Box
                    className="z-2 flex h-full w-full items-end gap-2 rounded-xl p-3 font-bold text-white bg-blend-darken"
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
                    alt={``}
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="rounded-xl object-center object-cover aspect-video"
                  />
                </div>
              </div>
            </Link>
          ))
        : defaultVehicleImages.slice(0, 3).map((_, i) => (
            <div
              key={i}
              className="relative mb-3 overflow-hidden rounded-2xl bg-gray-300 shadow dark:bg-gray-700"
            >
              <img
                src={_}
                alt=""
                sizes="(max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                className="aspect-video h-full w-full object-cover object-center brightness-70"
              />
            </div>
          ))}
    </div>
  );
}
