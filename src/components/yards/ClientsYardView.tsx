"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Button from "../ui/button/Button";
import { ArrowRightIcon } from "@/icons";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined"
import { EnvelopeIcon } from "@/icons";
import { useTenant } from "@/context/TenantContext";
import SecondaryHero from "../marketing-components/SecondaryHero";




// Fix for default marker icon
const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ClientsYardView: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { tenant, loading } = useTenant();

  const allYards = useMemo(() => {
    if (!tenant) return;
    return (tenant?.yards || null);
  }, [tenant]);

  // const [allYards, setAllYards] = React.useState([
  //   {
  //     title: 'Nairabi Yard, Kenya.',
  //     description: 'This is the location of our yard in Kisumu.',
  //     imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Kenyatta_International_Convention_Centre_02.jpg/1920px-Kenyatta_International_Convention_Centre_02.jpg',
  //     location: [-1.286389, 36.817223],
  //   },
  //   {
  //     title: 'Kisumu Yard, Kenya.',
  //     description: 'This is the location of our main yard in Nairobi.',
  //     imageUrl: 'https://africanspicesafaris.com/wp-content/uploads/2020/06/kisumu-city-tours-kenya-1200x900.jpg',
  //     location: [-0.091702, 34.767956],
  //   },
  //   {
  //     title: 'Mombasa Yard, Kenya.',
  //     description: 'This is the location of our yard in Mombasa.',
  //     imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/09/b6/49/0f.jpg',
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

        <div className="grid items-center container m-auto mt-5 grid-cols-1 lg:grid-cols-12 gap-5 p-4">
          <div className="lg:col-span-6">
            {/* <ViewAllCategories tenant={tenant} /> */}
            <img className="rounded-3xl img-fluid" src='https://www.pigiame.co.ke/discover/wp-content/uploads/2025/06/Car-Hire-Nairobi.jpg' alt="lease" />
          </div>
          <div className="lg:col-span-6">
            <h3 className="text-amber-500">FIND US</h3>
            <h2 className="text-3xl mt-4 mb-3 font-bold text-black dark:text-white">Find our locations countrywide</h2>
            {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View all our available yards. Vehicles can be returned at any of our locations regardless of where they were picked up. Contact us for more information.
            </p>
            <div className="flex gap-3 mt-5">
              <Button variant="success" size="sm" className="py-1 small px-4" >Call Us  <PhoneEnabledOutlinedIcon fontSize="small" /></Button>
              <Button variant="primary" size="sm" className="py-1 small px-4">Send an Email  <EnvelopeIcon fontSize="small" /></Button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-brand-500 text-center">SEE ALL OUR YARDS</h3>
          <h2 className="text-3xl mt-4 mb-3 font-bold text-black text-center dark:text-white">Find the Nearest Yard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-[700px] m-auto">Browse all our locations all over the country. Vehicles can be returned at any of our locations upon agreement!</p>

        </div>
        {
          (loading && !allYards) ? <>Just a Moment ...</> :
            allYards.map((y, i) => (
              <div key={i}>
                <div
                  className={`flex flex-col gap-6 items-center mt-6 ${i % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"
                    }`}>
                  <div
                    className={`w-full col-span-12 lg:col-span-5 rounded-2xl border transition-colors duration-200 mt-4 h-100 ${isDarkMode
                      ? "border-gray-800 bg-white/3"
                      : "border-gray-200 bg-white"
                      }`}
                    style={{ aspectRatio: 1 }}
                  >
                    <MapContainer
                      center={[y.location[0], y.location[1]]}
                      zoom={9}
                      className="h-full rounded-2xl"
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker key={i} position={[y.location[0], y.location[1]]} icon={defaultIcon}>
                        <Popup>
                          <div className="flex gap-3 items-center">
                            <img src={y.imageUrl} alt="Nairobi, Kenya" className="w-20 h-auto mb-2 rounded" />
                            <div>
                              <strong>{y.title}</strong> <br /> <span className="mt-1 text-sm/4 text-gray-400">{y.description}
                              </span>

                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <div className="w-full col-span-12 lg:col-span-7">
                    {/* <img className="w-100 h-50 mb-3 rounded-2xl object-fit object-cover" alt={y.title} src={y.imageUrl} /> */}

                    <h6 className="font-semibold text-xl text-black mb-2 dark:text-white">{y.title}</h6>
                    <p className="text-gray-800 text-sm mb-4 dark:text-gray-400">{y.description}</p>
                    <div className="flex gap-3 items-center">
                      <Button variant="success" size="sm" className="py-1 small px-4" >Call Yard  <PhoneEnabledOutlinedIcon fontSize="small" /></Button>

                      <Button onClick={() => {
                        // Extract latitude and longitude from the current yard's location array
                        const [lat, lng] = y.location;

                        // Construct the Google Maps directions URL
                        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

                        // Open the URL in a new browser tab or redirect the user
                        window?.open(googleMapsUrl, "_blank", "noopener,noreferrer");
                      }} variant="primary" size="sm">
                        Get Directions <ArrowRightIcon className="rotate-315" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="w-2/3 m-auto shadow col-span-12 h-0.5 bg-gray-200 dark:bg-gray-700 mt-8"></div>
              </div>
            ))
        }
        <br />
        <br />
      </section>
    </div>
  );
};

export default ClientsYardView;
