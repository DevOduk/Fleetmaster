"use client";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
const MapClient = dynamic(() => import("./MapClient"), { ssr: false });
import Button from "../ui/button/Button";
import { ArrowRightIcon } from "@/icons";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined";
import { EnvelopeIcon } from "@/icons";
import { useTenant } from "@/context/TenantContext";
import SecondaryHero from "../marketing-components/SecondaryHero";

const ClientsYardView: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { tenant, loading } = useTenant();

  const allYards = useMemo(() => {
    if (!tenant) return;
    return tenant?.yards || null;
  }, [tenant]);

  // const [allYards, setAllYards] = React.useState([
  //   {
  //     title: 'Nairabi Yard, Kenya.',
  //     description: 'This is the location of our yard in Kisumu.',
  //     image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Kenyatta_International_Convention_Centre_02.jpg/1920px-Kenyatta_International_Convention_Centre_02.jpg',
  //     location: [-1.286389, 36.817223],
  //   },
  //   {
  //     title: 'Kisumu Yard, Kenya.',
  //     description: 'This is the location of our main yard in Nairobi.',
  //     image_url: 'https://africanspicesafaris.com/wp-content/uploads/2020/06/kisumu-city-tours-kenya-1200x900.jpg',
  //     location: [-0.091702, 34.767956],
  //   },
  //   {
  //     title: 'Mombasa Yard, Kenya.',
  //     description: 'This is the location of our yard in Mombasa.',
  //     image_url: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/09/b6/49/0f.jpg',
  //     location: [-4.043740, 39.658871],
  //   },
  // ]);

  // Check for dark mode after component mounts
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Apply dark mode styles to leaflet
    const handleModeChange = () => {
      checkDarkMode();
      const tiles = document.querySelectorAll(".leaflet-tile");
      tiles.forEach((tile) => {
        const img = tile as HTMLImageElement;
        if (isDarkMode) {
          img.style.filter = "invert(0.93) hue-rotate(180deg) saturate(0.9)";
        } else {
          img.style.filter = "none";
        }
      });
    };

    const observer = new MutationObserver(handleModeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    handleModeChange();
    return () => observer.disconnect();
  }, [isDarkMode]);

  const pages = [
    { label: "Home", href: "/" },
    { label: "Our Yards", href: "/yards" },
  ];
  return (
    <div>
      {/* Hero Header Block */}
      <SecondaryHero
        pages={pages}
        title={tenant?.name || "Our Fleet"}
        highlightedText="Holding Yards"
        description={`Welcome to ${tenant?.name || "our company"}. Explore our physical distribution locations and vehicle pick-up yards across the region.`}
      />

      <section className="container m-auto">
        <div className="container m-auto mt-5 grid grid-cols-1 items-center gap-5 p-4 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {/* <ViewAllCategories tenant={tenant} /> */}
            <img
              className="img-fluid rounded-3xl"
              src="https://www.pigiame.co.ke/discover/wp-content/uploads/2025/06/Car-Hire-Nairobi.jpg"
              alt="lease"
            />
          </div>
          <div className="lg:col-span-6">
            <h3 className="text-amber-500">FIND US</h3>
            <h2 className="mt-4 mb-3 text-3xl font-bold text-black dark:text-white">
              Find our locations countrywide
            </h2>
            {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View all our available yards. Vehicles can be returned at any of
              our locations regardless of where they were picked up. Contact us
              for more information.
            </p>
            <div className="mt-5 flex gap-3">
              <Button variant="success" size="sm" className="small px-4 py-1">
                Call Us <PhoneEnabledOutlinedIcon fontSize="small" />
              </Button>
              <Button variant="primary" size="sm" className="small px-4 py-1">
                Send an Email <EnvelopeIcon fontSize="small" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-brand-500 text-center">SEE ALL OUR YARDS</h3>
          <h2 className="mt-4 mb-3 text-center text-3xl font-bold text-black dark:text-white">
            Find the Nearest Yard
          </h2>
          <p className="m-auto max-w-175 text-center text-sm text-gray-500 dark:text-gray-400">
            Browse all our locations all over the country. Vehicles can be
            returned at any of our locations upon agreement!
          </p>
        </div>
        {loading && !allYards ? (
          <>Just a Moment ...</>
        ) : (
          allYards?.map((y, i) => (
            <div key={i}>
              <div
                className={`mt-6 flex flex-col items-center gap-6 ${
                  i % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                <div
                  className={`col-span-12 mt-4 h-100 w-full rounded-2xl border transition-colors duration-200 lg:col-span-5 ${
                    isDarkMode
                      ? "border-gray-800 bg-white/3"
                      : "border-gray-200 bg-white"
                  }`}
                  style={{ aspectRatio: 1 }}
                >
                  <MapClient
                    location={[y.location[0], y.location[1]]}
                    image_url={y.image_url}
                    title={y.title}
                    description={y.description}
                    zoom={9}
                    className="h-full rounded-2xl"
                  />
                </div>
                <div className="col-span-12 w-full lg:col-span-7">
                  <img
                    className="object-fit mb-3 h-50 w-100 rounded-2xl object-cover"
                    alt={y.title}
                    src={y.image_url}
                  />

                  <h6 className="mb-2 text-xl font-semibold text-black dark:text-white">
                    {y.title}
                  </h6>
                  <p className="mb-4 text-sm text-gray-800 dark:text-gray-400">
                    {y.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="success"
                      size="sm"
                      className="small px-4 py-1"
                    >
                      Call Yard <PhoneEnabledOutlinedIcon fontSize="small" />
                    </Button>

                    <Button
                      onClick={() => {
                        const [lat, lng] = y.location;

                        // Construct the Google Maps directions URL
                        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

                        // Open the URL in a new browser tab or redirect the user
                        window?.open(
                          googleMapsUrl,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                      variant="primary"
                      size="sm"
                    >
                      Get Directions <ArrowRightIcon className="rotate-315" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-span-12 m-auto mt-8 h-0.5 w-2/3 bg-gray-200 shadow dark:bg-gray-700"></div>
            </div>
          ))
        )}
        <br />
        <br />
      </section>
    </div>
  );
};

export default ClientsYardView;
