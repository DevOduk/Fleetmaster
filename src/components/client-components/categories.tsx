"use client";

import { useFleet } from "@/context/FleetContext";
import { Box } from "@mui/material";
import { defaultVehicleImages } from "./hero/slider";
import Link from "next/link";
import Image from "next/image";

interface Tenant {
  tenantData: any;
}

export const DefaultCategories = ["Premium SUV", "Economy", "Compact"];

export default function ViewAllCategories({ tenantData }: Tenant) {
  const { vehicles } = useFleet();

  const myVehicles =
    vehicles?.filter((v) => v.tenant_id == tenantData?.id) || [];

  const enrichedCategories = Array.from(
    new Map(myVehicles.map((v) => [v.category, v])).values(),
  ).map((v) => ({
    category: v.category,
    image_url: v.image_url,
  }));

  const existingCategoryNames = new Set(
    enrichedCategories.map((c) => c.category),
  );

  const fallbackCategories = defaultVehicleImages
    .map((image, i) => ({
      category: DefaultCategories[i],
      image_url: image,
    }))
    .filter((item) => !existingCategoryNames.has(item.category));

  const allMyCategories = [...enrichedCategories, ...fallbackCategories];

  return (
    <div
      key={tenantData?.id}
      datatype={tenantData?.slug}
      className="container m-auto mt-5 mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3"
    >
      {allMyCategories.slice(0, 6).map((item) => (
        <Link key={item.category} href={`/vehicles?category=${item.category}`}>
          <div className="mb-3 rounded-2xl bg-gray-500/3 shadow dark:bg-gray-500/10">
            <div className="relative aspect-4/3 w-full">
              <Box
                className="flex h-full z-2 w-full items-end gap-2 rounded-xl p-3 font-bold text-white bg-blend-darken"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: "linear-gradient(to top, black, transparent)",
                }}
              >
                {item.category}
              </Box>
              <Image
                src={item.image_url}
                alt={''}
                preload
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-xl object-cover bg-white"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
