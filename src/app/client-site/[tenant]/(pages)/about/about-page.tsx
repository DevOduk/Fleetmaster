"use client"
import ViewAllCategories from "@/components/client-components/categories";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { useTenant } from "@/context/TenantContext";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined"
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ViewAllLocations from "@/components/client-components/locations";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import { ImageList, ImageListItem } from "@mui/material";
import Link from "next/link";


const itemData = [
    {
        img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
        title: 'Bed',
    },
    {
        img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
        title: 'Books',
    },
    {
        img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
        title: 'Sink',
    },
    {
        img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
        title: 'Kitchen',
    },
    {
        img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
        title: 'Blinds',
    },
    {
        img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
        title: 'Chairs',
    },
    {
        img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
        title: 'Laptop',
    },
    {
        img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
        title: 'Doors',
    },
    {
        img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
        title: 'Coffee',
    },
    {
        img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
        title: 'Storage',
    },
    {
        img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
        title: 'Candle',
    },
    {
        img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
        title: 'Coffee table',
    }
];


export default function AboutPageContent() {
    const { tenant: tenantData } = useTenant();
    const pages = [
        {
            label: 'Home',
            href: '/',
        },
        {
            label: 'About Us',
            href: '/about',
        }
    ];


    return (
        <div>
            <SecondaryHero
                pages={pages}
                title="Get in touch with"
                highlightedText="Our Team"
                description="Have questions about features, setup, or scaling your enterprise operations? Drop us a message and our fleet experts will handle the rest."
            />
            <div className="grid items-center container m-auto grid-cols-1 lg:grid-cols-12 gap-5 p-4">

                {/* 3. Swapped col-7 for col-span-7 */}
                <div className="lg:col-span-7">
                    <ViewAllCategories tenantData={tenantData} />
                </div>

                {/* 2. Swapped col-5 for col-span-5 */}
                <div className="lg:col-span-5">
                    <h3 className="text-amber-500">ABOUT US</h3>
                    <h2 className="text-3xl mt-4 mb-3 font-bold text-black dark:text-white">Welcome to {tenantData?.name || "CarHire"}</h2>
                    {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-175">
                        At {tenantData?.name}, we are passionate about providing exceptional car rental services that exceed our customers' expectations. With a commitment to quality, reliability, and customer satisfaction, we strive to be the preferred choice for all your car rental needs. Our extensive fleet of well-maintained vehicles, competitive pricing, and personalized service make us the go-to destination for travelers seeking convenience and comfort on the road.
                    </p>

                    <div className="flex gap-3 mt-5">
                        <Link href={`tel:${tenantData.phone || '#'}`}>
                            <Button variant="success" size="sm">Enquire <PhoneEnabledOutlinedIcon fontSize="small" /></Button>
                        </Link>
                        <Link href={`mailto:${tenantData.email || '#'}`}>
                            <Button variant="primary" size="sm">Send an Email <EmailOutlinedIcon fontSize="small" /></Button>
                        </Link>
                    </div>
                </div>

            </div>
            <div className="p-2 mt-5 mb-5 max-w-6xl m-auto">

                <h3 className="text-amber-500 uppercase text-center">Photo Gallery</h3>
                <h2 className="text-3xl mt-4 mb-10 font-bold text-black text-center dark:text-white">View Our Photo Gallery</h2>
                <ImageList variant="masonry" cols={4} gap={8}>
                    {itemData.map((item) => (
                        <ImageListItem key={item.img}>
                            <img
                                srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.img}?w=248&fit=crop&auto=format`}
                                alt={item.title}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
            <br />

            <div className="container m-auto">
                <h3 className="text-brand-500 text-center">Available Countrywide</h3>
                <h2 className="text-3xl mt-4 mb-3 font-bold text-black text-center dark:text-white">Explore Our Locations</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-175 m-auto">Browse our extensive collection of well-maintained vehicles across divers locations. From compact cars to luxury sedans, we have the perfect vehicle for your needs.</p>

                <ViewAllLocations tenantData={tenantData} />
            </div>
            <div className="border-gray-500 border-t container m-auto mb-5"></div>


        </div>
    );
}
