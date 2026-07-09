"use client"
import { useFleet } from "@/context/FleetContext";
import { Box } from "@mui/material";
import { defaultVehicleImages } from "./hero/slider";


interface Tenant {
    tenantData: any;
}

export default function ViewAllCategories({ tenantData }: Tenant) {
    const { vehicles, loading } = useFleet();

    const myVehicles = vehicles?.filter((v) => v.tenant_id == tenantData?.id)

    const allCategories = myVehicles?.map(v => v.category);
    const categories = [...new Set(allCategories)];
    return (
        <div key={tenantData?.id} datatype={tenantData?.slug} className="grid mt-5 grid-cols-2 lg:grid-cols-3 m-auto gap-3 container mb-5">
            {loading ? (
                [...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-300 dark:bg-gray-700 animate-pulse shadow rounded-2xl mb-3 aspect-square">
                    </div>
                ))
            ) : categories.length > 1 ? categories.slice(0, 6).map((category) => (
                <div key={category} className="mb-3 dark:bg-gray-500/10 bg-gray-500/3 shadow rounded-2xl">
                    <div className='relative'>
                        <Box className='flex gap-2 text-white bg-blend-darken font-bold items-end p-3 w-full h-full rounded-xl' sx={{ position: 'absolute', bottom: 0, right: 0, background: 'linear-gradient(to top, black, transparent)' }}>
                            {category}
                        </Box>
                        <img src={vehicles.find((v) => v.category === category).image_url} alt={``} className="w-full object-cover rounded-xl aspect-video" />
                    </div>
                </div>

            )) : (
                <>{
                    defaultVehicleImages.map((_, i) => (
                        <div key={i} className="bg-gray-300 relative dark:bg-gray-700 shadow overflow-hidden rounded-2xl mb-3 aspect-square">
                            <img src={_} alt="" className="w-full h-full object-cover object-center" />
                        </div>
                        ))
                }
                </>)
            }
        </div>
    );
}