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
      className="w-full md:container md:m-auto grid grid-cols-2 gap-3 lg:grid-cols-3 py-8"
    >
      {tenantData?.yards?.length > 0
        ? tenantData?.yards?.slice(0, 6).map((VehicleDetails, i) => (
          <Link key={i} href={`/vehicles?location=${(VehicleDetails.title)}`}>
            <div
              className="mb-3 rounded-2xl bg-gray-500/3 shadow dark:bg-gray-500/10"
            >
              <div className="relative aspect-video w-full">
                <Box
                  className="flex h-full w-full z-2 items-end gap-2 rounded-xl p-3 font-bold text-white bg-blend-darken"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "linear-gradient(to top, black, transparent)",
                  }}
                >
                  {VehicleDetails.title}
                </Box>
                <Image
                  src={VehicleDetails.image_url}
                  alt={``}
                  preload
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className=" rounded-xl object-cover"
                />
              </div>
            </div>
          </Link>
        ))
        : defaultVehicleImages.slice(0, 3).map((_, i) => (
          <div
            key={i}
            className="mb-3 aspect-video relative overflow-hidden rounded-2xl bg-gray-300 shadow dark:bg-gray-700"
          >
            <Image
              src={_}
              alt=""
              preload
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="h-full w-full object-cover object-center brightness-70"
            />
          </div>
        ))}
    </div>
  );
}
