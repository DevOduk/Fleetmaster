"use client";
import ViewAllCategories from "@/components/client-components/categories";
import Button from "@/components/ui/button/Button";
import { useTenant } from "@/context/TenantContext";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ViewAllLocations from "@/components/client-components/locations";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import { ImageList, ImageListItem } from "@mui/material";
import Link from "next/link";
import { useFleet } from "@/context/FleetContext";
import { useMemo } from "react";
import { defaultVehicleImages } from "@/data/globalExports";

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1549388604-817d15aa0110",
    title: "Bed",
  },
  {
    img: "https://images.unsplash.com/photo-1525097487452-6278ff080c31",
    title: "Books",
  },
  {
    img: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
    title: "Sink",
  },
  {
    img: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3",
    title: "Kitchen",
  },
  {
    img: "https://images.unsplash.com/photo-1588436706487-9d55d73a39e3",
    title: "Blinds",
  },
  {
    img: "https://images.unsplash.com/photo-1574180045827-681f8a1a9622",
    title: "Chairs",
  },
  {
    img: "https://images.unsplash.com/photo-1530731141654-5993c3016c77",
    title: "Laptop",
  },
  {
    img: "https://images.unsplash.com/photo-1481277542470-605612bd2d61",
    title: "Doors",
  },
  {
    img: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee",
    title: "Storage",
  },
  {
    img: "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62",
    title: "Candle",
  },
  {
    img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
    title: "Coffee table",
  },
];

export default function AboutPageContent() {
  const { tenant: tenantData } = useTenant();
  const { vehicles } = useFleet();
  const pages = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About Us",
      href: "/about",
    },
  ];
  const images = useMemo(() => {
    const allImages = vehicles?.map((v) => v.image_url);
    return [...allImages, ...defaultVehicleImages];
  }, [vehicles]);

  return (
    <div>
      <SecondaryHero
        pages={pages}
        title="Get in touch with"
        highlightedText="Our Team"
        description="Have questions about features, setup, or scaling your enterprise operations? Drop us a message and our fleet experts will handle the rest."
      />
      <div className="container m-auto grid grid-cols-1 items-center gap-5 p-4 lg:grid-cols-12">
        {/* 3. Swapped col-7 for col-span-7 */}
        <div className="lg:col-span-7">
          <ViewAllCategories tenantData={tenantData} />
        </div>

        {/* 2. Swapped col-5 for col-span-5 */}
        <div className="lg:col-span-5">
          <h3 className="text-amber-500">ABOUT US</h3>
          <h2 className="mt-4 mb-3 text-3xl font-bold text-black dark:text-white">
            Welcome to {tenantData?.name || "our CarHire"}
          </h2>

          <p className="mb-4 max-w-175 text-sm text-gray-500 dark:text-gray-400">
            {tenantData?.about ? (
              tenantData.about
            ) : (
              <>
                At {tenantData?.name}, we are passionate about providing
                exceptional car rental services that exceed our customers'
                expectations.
              </>
            )}
          </p>
          {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
          <p className="max-w-175 text-sm text-gray-500 dark:text-gray-400">
            {tenantData.description?.trim() ? (
              tenantData.description
            ) : (
              <>
                At {tenantData?.name}, we are passionate about providing
                exceptional car rental services that exceed our customers'
                expectations. With a commitment to quality, reliability, and
                customer satisfaction, we strive to be the preferred choice for
                all your car rental needs. Our extensive fleet of
                well-maintained vehicles, competitive pricing, and personalized
                service make us the go-to destination for travelers seeking
                convenience and comfort on the road.
              </>
            )}
          </p>

          <div className="mt-5 flex gap-3">
            <Link href={`tel:${tenantData.phone || "#"}`}>
              <Button variant="success" size="sm">
                Enquire <PhoneEnabledOutlinedIcon fontSize="small" />
              </Button>
            </Link>
            <Link href={`mailto:${tenantData.email || "#"}`}>
              <Button variant="primary" size="sm">
                Send an Email <EmailOutlinedIcon fontSize="small" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="m-auto mt-5 mb-5 max-w-6xl p-2">
        <h3 className="text-center text-amber-500 uppercase">Photo Gallery</h3>
        <h2 className="mt-4 mb-10 text-center text-3xl font-bold text-black dark:text-white">
          View Our Photo Gallery
        </h2>
        <ImageList className="p pointer-events-none select-none" variant="masonry" cols={4} gap={8}>
          {images.slice(0, 30).map((item, i) => (
            <ImageListItem key={i}>
              <img
                srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item}?w=248&fit=crop&auto=format`}
                alt={''}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
      <br />

      <div className="container m-auto">
        <h3 className="text-brand-500 text-center">Available Countrywide</h3>
        <h2 className="mt-4 mb-3 text-center text-3xl font-bold text-black dark:text-white">
          Explore Our Locations
        </h2>
        <p className="m-auto max-w-175 text-center text-sm text-gray-500 dark:text-gray-400">
          Browse our extensive collection of well-maintained vehicles across
          divers locations. From compact cars to luxury sedans, we have the
          perfect vehicle for your needs.
        </p>

        <ViewAllLocations tenantData={tenantData} />
      </div>
      <div className="container m-auto mb-5 border-t border-gray-500"></div>
    </div>
  );
}
