"use client"
import { useFleet } from "@/context/FleetContext";
import { Box, Chip } from "@mui/material";
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined"
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined"
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined"
import Button from "../ui/button/Button";


interface Tenant {
    tenantData: any;
}
const allYards = [
    {
        title: 'Nairabi Yard, Kenya.',
        description: 'This is the location of our yard in Kisumu.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Kenyatta_International_Convention_Centre_02.jpg/1920px-Kenyatta_International_Convention_Centre_02.jpg',
        location: [-1.286389, 36.817223],
    },
    {
        title: 'Kisumu Yard, Kenya.',
        description: 'This is the location of our main yard in Nairobi.',
        imageUrl: 'https://africanspicesafaris.com/wp-content/uploads/2020/06/kisumu-city-tours-kenya-1200x900.jpg',
        location: [-0.091702, 34.767956],
    },
    {
        title: 'Mombasa Yard, Kenya.',
        description: 'This is the location of our yard in Mombasa.',
        imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/09/b6/49/0f.jpg',
        location: [-4.043740, 39.658871],
    },
];

export default function ViewAllLocations({ tenantData }: Tenant) {
    console.log('tenant.yards: ',tenantData?.yards)
    return (
        <div key={tenantData?.id} datatype={tenantData?.slug} className="grid mt-5 grid-cols-2 lg:grid-cols-3 m-auto gap-3 container mb-5">
            {tenantData?.yards.length > 1 ? tenantData?.yards.slice(0, 6).map((VehicleDetails) => (
                <div key={VehicleDetails.title} className="mb-3 dark:bg-gray-500/10 bg-gray-500/3 shadow rounded-2xl">
                    <div className='relative'>
                        <Box className='flex gap-2 text-white bg-blend-darken font-bold items-end p-3 w-full h-full rounded-xl' sx={{ position: 'absolute', bottom: 0, right: 0, background: 'linear-gradient(to top, black, transparent)' }}>
                            {VehicleDetails.title}
                        </Box>
                        <img src={VehicleDetails.imageUrl} alt={`${VehicleDetails.title}`} className="w-full object-cover rounded-xl aspect-video" />
                    </div>
                </div>
            )) : (
                <>
                    {
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-gray-300 dark:bg-gray-700 animate-pulse shadow rounded-2xl mb-3 aspect-video">
                            </div>
                        ))
                    }
                </>
            )
            }
        </div>
    );
}