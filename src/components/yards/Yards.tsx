"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // 1. Import dynamic
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Button from "../ui/button/Button";
import { PlusIcon } from "@/icons";
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";
import { toast } from "sonner";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useUser } from "@/context/UserContext";

// Crucial: Leaflet imports must be loaded dynamically to prevent SSR errors
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Safely generate default marker icon inside browser context
const createDefaultIcon = () => {
  return L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// --- Part 1: The Core Content Component ---
// This contains all your original code, renamed slightly so we can wrap it.
const YardsContent: React.FC = () => {
  const { profile: adminProfile } = useUser();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const defaultIcon = typeof window !== 'undefined' ? createDefaultIcon() : undefined;

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

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


  const addCreateYard = () => {
    if (selectedEvent) {
      toast.success('Updated yard success')

    } else {
      toast(
        <div className="flex gap-2 font-bold items-center"><TaskAltIcon style={{ width: 16, height: 16 }} />Success!</div>,
        {
          description: (
            <span className="font-sm">
              New yard has been added successfully.
            </span>
          ),
          // Adding custom colors via style or className
          style: {
            padding: '10px 12px',
            color: 'green', // Dark green text
          },
        }
      );

    }
  }
  return (
    <div>
      <div className="grid grid-cols-12 gap-6">

        <div
          className={`w-full col-span-12 lg:col-span-5 rounded-2xl border transition-colors duration-200 mt-4 h-100 ${isDarkMode
            ? "border-gray-800 bg-white/3"
            : "border-gray-200 bg-white"
            }`}
          style={{ aspectRatio: 1 }}
        >
          <MapContainer
            center={[-1.286389, 36.817223]}
            zoom={6}
            className="h-full rounded-2xl"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
              adminProfile?.fleetmaster_tenants?.yards?.map((yard, i) => (
                <Marker key={i} position={[yard.location[0], yard.location[1]]} icon={defaultIcon}>
                  <Popup>
                    <div className="flex gap-3 items-center">
                      <img src={yard.imageUrl} alt="Nairobi, Kenya" className="w-20 h-auto mb-2" />
                      <div>
                        <strong>{yard.title}</strong> <br /> <span className="mt-1 text-sm/4 text-gray-400">{yard.description}
                        </span>

                      </div>
                    </div>
                  </Popup>
                </Marker>))}

          </MapContainer>
        </div>


        <div className="py-3 col-span-12 lg:col-span-7">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90"> Below is a list of your working yards/locations:</p>
            <Button onClick={openModal} variant="primary" size="sm">New Yard <PlusIcon /></Button>
          </div>
          <div>
            {adminProfile?.fleetmaster_tenants?.yards.map((yard, i) => (
              <div key={i} style={{ width: '100%' }} className="flex p-2 pr-3 rounded bg-white dark:bg-white/2 cursor-pointer gap-3 w-full mt-4 items-center">
                <div>

                  <img className="w-35 h-18 rounded object-fit object-cover" alt={yard.title} src={yard.imageUrl} />
                </div>
                <div className="w-full">
                  <h6 className="font-medium text-md text-gray-800 dark:text-white/80">{yard.title}</h6>
                  <p className="text-gray-800 text-sm dark:text-white/70 mb-1">{yard.description}</p>
                  <p className="font-small text-sm text-gray-700 dark:text-gray-500">Lat: {yard.location[0]} | long: {yard.location[1]}</p>
                </div>
                <div className="p-2 flex gap-3">
                  <BorderColorOutlinedIcon onClick={() => {
                    setSelectedEvent(yard);
                    openModal()
                  }} color="primary" />
                  <DeleteOutlinedIcon color="error" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          closeModal();
          setSelectedEvent(null);
        }}
        className="max-w-175 p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent ? "Edit Booking" : "Create Booking"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your yards by adding new ones or editing existing yrds.
            </p>
          </div>


          <h4 className="mb-2 mt-4 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-xl">
            Yard Information
          </h4>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Image
            </label>
            {selectedEvent ?
              <img className="w-40 mt-3 mb-3 rounded object-fit object-cover" alt={selectedEvent?.title || ''} src={selectedEvent?.imageUrl} />
              : <p className="text-sm font-small text-red-800 dark:text-red-400 py-4">No image yet ...</p>}
          </div>

          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => console.log(e.target.value)}
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
          <div>
            <label className="mb-1.5 mt-3 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Yard Name
            </label>
            <input
              id="renter-name"
              type="text"
              value={selectedEvent?.title}
              onChange={(e) => console.log(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <label className="mb-1.5 mt-4 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Yard Description
            </label>
            <input
              id="renter-name"
              type="text"

              value={selectedEvent?.description}
              onChange={(e) => console.log(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <label className="mb-1.5 mt-4 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Location
            </label>
            <div
              className={`w-full col-span-12 lg:col-span-5 rounded-2xl border transition-colors duration-200 mt-4 h-100 ${isDarkMode
                ? "border-gray-800 bg-white/3"
                : "border-gray-200 bg-white"
                }`}
              style={{ aspectRatio: 16 / 10 }}
            >
              <MapContainer
                center={[selectedEvent?.location[0] || -1.286389, selectedEvent?.location[1] || 36.817223]}
                zoom={8}
                className="h-full rounded-2xl"
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {selectedEvent && <Marker position={[selectedEvent?.location[0], selectedEvent?.location[1]]} icon={defaultIcon}>
                  <Popup>
                    <div className="flex gap-3 items-center">
                      <img src={selectedEvent?.imageUrl} alt="Nairobi, Kenya" className="w-20 h-auto mb-2" />
                      <div>
                        <strong>{selectedEvent?.title}</strong><br /> <span className="mt-1 text-sm/4 text-gray-400">{selectedEvent?.description}
                        </span>

                      </div>
                    </div>
                  </Popup>
                </Marker>}
              </MapContainer>

            </div>
          </div>



          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={() => {
                closeModal();
                setSelectedEvent(null);
              }}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={() => addCreateYard()}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {selectedEvent ? "Update Yard" : "Create Yard"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default YardsContent;
