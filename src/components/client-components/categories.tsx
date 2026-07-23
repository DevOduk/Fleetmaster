"use client";

import { useFleet } from "@/context/FleetContext";
import { Box } from "@mui/material";
import { defaultVehicleImages } from "./hero/slider";
import Link from "next/link";

interface Tenant {
    tenantData: any;
}

export const DefaultCategories = [
    "Premium SUV",
    "Economy",
    "Compact",
];

export default function ViewAllCategories({ tenantData }: Tenant) {
    const { vehicles } = useFleet();

    const myVehicles = vehicles?.filter((v) => v.tenant_id == tenantData?.id) || [];

    const enrichedCategories = Array.from(
        new Map(myVehicles.map(v => [v.category, v])).values()
    ).map(v => ({
        category: v.category,
        image_url: v.image_url,
    }));

    const existingCategoryNames = new Set(enrichedCategories.map(c => c.category));

    const fallbackCategories = defaultVehicleImages
        .map((image, i) => ({
            category: DefaultCategories[i],
            image_url: image,
        }))
        .filter(item => !existingCategoryNames.has(item.category));

    const allMyCategories = [...enrichedCategories, ...fallbackCategories];

    return (
        <div key={tenantData?.id} datatype={tenantData?.slug} className="grid mt-5 grid-cols-2 lg:grid-cols-3 m-auto gap-3 container mb-5">
            {
             allMyCategories.slice(0, 6).map((item) => (
                <Link key={item.category} href={`/vehicles?category=${item.category}`} >
                    <div className="mb-3 dark:bg-gray-500/10 bg-gray-500/3 shadow rounded-2xl">
                        <div className='relative'>
                            <Box
                                className='flex gap-2 text-white bg-blend-darken font-bold items-end p-3 w-full h-full rounded-xl'
                                sx={{ position: 'absolute', bottom: 0, right: 0, background: 'linear-gradient(to top, black, transparent)' }}
                            >
                                {item.category}
                            </Box>
                            <img
                                src={item.image_url}
                                alt={item.category}
                                className="w-full object-cover rounded-xl aspect-4/3"
                            />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}