"use client";

import React, { useEffect, useState } from "react";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Button from "../ui/button/Button";
import { PlusIcon } from "@/icons";
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";
import { toast } from "sonner";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useUser } from "@/context/UserContext";

// --- Part 1: Client-Only Map Sub-Component ---
// This safely loads and renders Leaflet elements ONLY in the browser environment.
const SafeLeafletMap: React.FC<{
  center: [number, number];
  zoom: number;
  yardsData: any[];
  isDarkMode: boolean;
}> = ({ center, zoom, yardsData, isDarkMode }) => {
  // Lazily load leaflet assets only when running on the client
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  const L = require("leaflet");
  require("leaflet/dist/leaflet.css");

  const defaultIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full rounded-2xl"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {yardsData?.map((yard: any, i: number) => {
        if (!yard?.location || yard.location.length < 2) return null;
        return (
          <Marker key={i} position={[yard.location[0], yard.location[1]]} icon={defaultIcon}>
            <Popup>
              <div className="flex gap-3 items-center">
                <img src={yard.imageUrl} alt={yard.title || "Yard"} className="w-20 h-auto mb-2" />
                <div>
                  <strong>{yard.title}</strong> <br />
                  <span className="mt-1 text-sm/4 text-gray-400">{yard.description}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

// --- Part 2: The Main Component Structure ---
const YardsContent: React.FC = () => {
  const { profile: adminProfile } = useUser();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

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
      toast.success('Updated yard success');
    } else {
      toast(
        <div className="flex gap-2 font-bold items-center"><TaskAltIcon style={{ width: 16, height: 16 }} />Success!</div>,
        {
          description: (
            <span className="font-sm">
              New yard has been added successfully.
            </span>
          ),
          style: {
            padding: '10px 12px',
            color: 'green',
          },
        }
      );
    }
  };

  const mainMapYards = adminProfile?.fleetmaster_tenants?.yards || [];
  const modalMapYards = selectedEvent ? [selectedEvent] : [];

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        <div
          className={`w-full col-span-12 lg:col-span-5 rounded-2xl border transition-colors duration-200 mt-4 h-100 ${isDarkMode ? "border-gray-800 bg-white/3" : "border-gray-200 bg-white"
            }`}
          style={{ aspectRatio: 1 }}
        >
          <SafeLeafletMap
            center={[-1.286389, 36.817223]}
            zoom={6}
            yardsData={mainMapYards}
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="py-3 col-span-12 lg:col-span-7">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90"> Below is a list of your working yards/locations:</p>
            <Button onClick={openModal} variant="primary" size="sm">New Yard <PlusIcon /></Button>
          </div>
          <div>
            {mainMapYards.map((yard: any, i: number) => (
              <div key={i} style={{ width: '100%' }} className="flex p-2 pr-3 rounded bg-white dark:bg-white/2 cursor-pointer gap-3 w-full mt-4 items-center">
                <div>
                  <img className="w-35 h-18 rounded object-fit object-cover" alt={yard.title} src={yard.imageUrl} />
                </div>
                <div className="w-full">
                  <h6 className="font-medium text-md text-gray-800 dark:text-white/80">{yard.title}</h6>
                  <p className="text-gray-800 text-sm dark:text-white/70 mb-1">{yard.description}</p>
                  <p className="font-small text-sm text-gray-700 dark:text-gray-500">Lat: {yard.location?.[0]} | long: {yard.location?.[1]}</p>
                </div>
                <div className="p-2 flex gap-3">
                  <BorderColorOutlinedIcon onClick={() => {
                    setSelectedEvent(yard);
                    openModal();
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
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
          <div>
            <label className="mb-1.5 mt-3 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Yard Name
            </label>
            <input
              id="renter-name"
              type="text"
              value={selectedEvent?.title || ''}
              onChange={(e) => console.log(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>

          <div>
            <label className="mb-1.5 mt-4 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Yard Description
            </label>
            <input
              id="renter-desc"
              type="text"
              value={selectedEvent?.description || ''}
              onChange={(e) => console.log(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
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
              <SafeLeafletMap
                center={[selectedEvent?.location?.[0] || -1.286389, selectedEvent?.location?.[1] || 36.817223]}
                zoom={8}
                yardsData={modalMapYards}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={() => {
                closeModal();
                setSelectedEvent(null);
              }}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:w-auto"
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

// --- Part 3: Hydration Execution Boundary ---
const Yards: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 dark:bg-white/3 rounded-2xl animate-pulse">
        <p className="text-gray-500 dark:text-gray-400">Loading fleet metrics and map parameters...</p>
      </div>
    );
  }

  return <YardsContent />;
};

export default Yards;