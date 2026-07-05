"use client";

import React, { useEffect, useState } from "react";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Button from "../ui/button/Button";
import { PlusIcon } from "@/icons";
import { useModal } from "@/hooks/useModal";
import { useUser } from "@/context/UserContext";
import UpdateYardsModal from "./UpdateYardsModal";
import { fetchTenantDetails, updateTenantDetails } from "@/app/actions/tenant";
import { useToast } from "@/context/ToastContext";
import Image from "next/image";

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
  const { showToast } = useToast();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(true);
  const [companyFormData, setCompanyFormData] = useState<any>(null);

  useEffect(() => {
    const getTenantDetails = async () => {
      if (!adminProfile?.tenant_id) {
        setLoadingCompany(false);
        return;
      }
      if (adminProfile?.tenant_id) {
        const res = await fetchTenantDetails(adminProfile.tenant_id);
        setCompanyFormData(res.data);
        if (res) {
          setLoadingCompany(false);
        }
      }
    };

    getTenantDetails();
  }, [adminProfile?.tenant_id]);


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


  const handleDeleteYard = async (yard: any) => {
    if (!yard || !yard.title) {
      console.error("Invalid yard data for deletion:", yard);
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete the yard "${yard.title}"?`);
    if (!confirmDelete) return;

    const updatedYards = companyFormData.yards.filter((y: any) => y.title !== yard.title);

    const res = await updateTenantDetails(adminProfile.tenant_id, { ...companyFormData, yards: updatedYards });
    if (res.success) {
      showToast(`Yard "${yard.title}" deleted successfully.`, "success");
      setCompanyFormData((prev: any) => ({ ...prev, yards: updatedYards }));
    } else {
      showToast("Failed to delete yard.", "error");
    }
  }

  const mainMapYards = companyFormData?.yards || [];

  if (!adminProfile || !adminProfile.tenant_id || loadingCompany) {
    return (
      <div className="w-full mx-auto p-6 space-y-6 animate-pulse">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded-md dark:bg-gray-600"></div>
            <div className="h-4 w-32 bg-gray-100 rounded-md dark:bg-gray-600"></div>
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5 border border-gray-100 dark:border-gray-700 rounded-xl space-y-3">
              <div className="h-4 w-34 bg-gray-100 rounded-md dark:bg-gray-600"></div>
              <div className="h-8 w-19 bg-gray-200 rounded-md dark:bg-gray-600"></div>
            </div>
          ))}
        </div>
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 space-y-4">
          <div className="h-5 w-36 bg-gray-200 dark:bg-gray-500 rounded-md mb-2"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-600 last:border-0">
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full shrink-0"></div>
                <div className="space-y-2 w-full max-w-[60%]">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded-md w-1/2"></div>
                </div>
              </div>
              <div className="h-4 w-12 bg-gray-100 rounded-md dark:bg-gray-600"></div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-2 pt-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <span className="text-xs text-gray-400 font-medium pl-1">Syncing workspace...</span>
        </div>
      </div>
    );
  }

  if (!companyFormData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 min-h-[70vh]">
        <div className="text-4xl mb-4">🏢</div>
        <h3 className="text-lg font-semibold text-red-600">Company Not Found</h3>
        <p className="text-gray-500 max-w-sm mt-2">
          We couldn't locate a profile associated with your account. If you believe this is an error, please contact support.
        </p>
        <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div>
      {isOpen && (
        <UpdateYardsModal
          tenantId={adminProfile?.tenant_id}
          isDarkMode={isDarkMode}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          yardDetails={selectedEvent}
          setCompanyFormData={setCompanyFormData}
          companyFormData={companyFormData}
        />
      )}

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
            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
              Below is a list of your working yards/locations:
            </p>
            <Button onClick={() => setIsOpen(true)} variant="primary" size="sm">New Yard <PlusIcon /></Button>
          </div>
          {mainMapYards.length > 0 ? (
            <div className="grid gap-4 grid-cols-2">
              {
                mainMapYards.map((yard: any, i: number) => (
                  <div key={i} className="rounded-xl relative border border-gray-100 p-4 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                    <img
                      src={yard.imageUrl || "/images/brand/default-yard.png"}
                      alt={yard.title || "Yard"}
                      className="mb-2 h-auto aspect-video w-full rounded-lg object-cover"
                    />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{yard.title}</p>
                    <p className="mt-1text-sm mb-2 mt-1 truncate text-gray-500 line-clamp-2">{yard.description}</p>
                    <p className="font-small text-xs text-gray-700 dark:text-gray-500">Lat: {yard.location?.[0]} | long: {yard.location?.[1]}</p>

                    <div className="p-2 flex gap-4 absolute top-5 right-5 bg-white/50 dark:bg-gray-800/50 rounded-lg z-3">
                      <BorderColorOutlinedIcon onClick={() => {
                        setSelectedEvent(yard);
                        setIsOpen(true);
                      }} fontSize="small" className="text-white cursor-pointer" />
                      <DeleteOutlinedIcon onClick={() => {
                        handleDeleteYard(yard);
                      }} fontSize="small" color="error" className="cursor-pointer" />
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="relative mt-3 border dark:border-gray-600 rounded-lg w-full gap-3 min-h-85 flex items-center justify-center flex-col text-gray-600 dark:text-gray-400">
              <h5 className="text-2xl mb-0 font-bold text-red-500">Oops!</h5>
              <p className="text-gray-600 text-sm dark:text-gray-400 mb-2">You don't seem to have any yard loctaions yet. Create one now!</p>
              <Button onClick={() => setIsOpen(true)} variant="primary" size="sm">New Yard <PlusIcon /></Button>
            </div>
          )}
        </div>
      </div>
      <p className="font-medium py-9 mt-3 text-gray-800 text-center text-theme-sm dark:text-white/90">You have  {mainMapYards.length} Yards. You can add unlimitted yards</p>
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