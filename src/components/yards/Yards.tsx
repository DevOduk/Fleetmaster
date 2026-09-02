"use client";

import React, { useEffect, useState } from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Button from "../ui/button/Button";
import { PlusIcon } from "@/icons";
import { useUser } from "@/context/UserContext";
import UpdateYardsModal from "./UpdateYardsModal";
import {
  deleteTenantYard,
  fetchTenantDetails,
  updateTenantDetails,
} from "@/app/actions/tenant";
import { useToast } from "@/context/ToastContext";
import { Avatar, Backdrop, CircularProgress } from "@mui/material";

import dynamic from "next/dynamic";

// Dynamically load the client map component to ensure Leaflet/React-Leaflet are only evaluated in the browser
const MapMulti = dynamic(() => import("./MapMulti"), { ssr: false });

// --- Part 2: The Main Component Structure ---
const YardsContent: React.FC = () => {
  const { profile: adminProfile } = useUser();
  const { showToast } = useToast();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(true);
  const [companyFormData, setCompanyFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!yard || !yard.id) {
      console.error("Invalid yard data for deletion:", yard);
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this yard "${yard.title}"?`,
    );
    if (!confirmDelete) return;

    setIsSaving(true);
    const updatedYards = companyFormData.yards.filter(
      (y: any) => y.id !== yard.id,
    );

    const res = await deleteTenantYard(adminProfile.tenant_id, yard.id);

    if (res.success) {
      showToast(`Yard "${yard.title}" deleted successfully.`, "success");
      setCompanyFormData((prev: any) => ({ ...prev, yards: updatedYards }));

      setIsSaving(false);
    } else {
      showToast(res.error.message || "Failed to delete yard. Try again later!", "error");

      setIsSaving(false);
    }
  };

  const mainMapYards = companyFormData?.yards || [];

  if (!adminProfile || !adminProfile.tenant_id || loadingCompany) {
    return (
      <div className="mx-auto w-full animate-pulse space-y-6 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-6 dark:border-gray-800">
          <div className="space-y-2">
            <div className="h-6 w-48 rounded-md bg-gray-200 dark:bg-gray-600"></div>
            <div className="h-4 w-32 rounded-md bg-gray-100 dark:bg-gray-600"></div>
          </div>
          <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-600"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-xl border border-gray-100 p-5 dark:border-gray-700"
            >
              <div className="h-4 w-34 rounded-md bg-gray-100 dark:bg-gray-600"></div>
              <div className="h-8 w-19 rounded-md bg-gray-200 dark:bg-gray-600"></div>
            </div>
          ))}
        </div>
        <div className="space-y-4 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
          <div className="mb-2 h-5 w-36 rounded-md bg-gray-200 dark:bg-gray-500"></div>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0 dark:border-gray-600"
            >
              <div className="flex w-full items-center space-x-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                <div className="w-full max-w-[60%] space-y-2">
                  <div className="h-4 w-3/4 rounded-md bg-gray-200 dark:bg-gray-600"></div>
                  <div className="h-3 w-1/2 rounded-md bg-gray-100 dark:bg-gray-600"></div>
                </div>
              </div>
              <div className="h-4 w-12 rounded-md bg-gray-100 dark:bg-gray-600"></div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-2 pt-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
          <span className="pl-1 text-xs font-medium text-gray-400">
            Syncing workspace...
          </span>
        </div>
      </div>
    );
  }

  if (!companyFormData) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800">
        <div className="mb-4 text-4xl">🏢</div>
        <h3 className="text-lg font-semibold text-red-600">
          Company Not Found
        </h3>
        <p className="mt-2 max-w-sm text-gray-500">
          We couldn't locate a profile associated with your account. If you
          believe this is an error, please contact support.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
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
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          yardDetails={selectedEvent}
          setCompanyFormData={setCompanyFormData}
          companyFormData={companyFormData}
        />
      )}

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isSaving}
        onClick={() => null}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="grid grid-cols-12 gap-6">
        <div
          className={`col-span-12 mt-4 h-100 w-full rounded-2xl border transition-colors duration-200 lg:col-span-5 ${
            isDarkMode
              ? "border-gray-800 bg-white/3"
              : "border-gray-200 bg-white"
          }`}
          style={{ aspectRatio: 1 }}
        >
          <MapMulti
            center={[-1.286389, 36.817223]}
            zoom={6}
            yardsData={mainMapYards}
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="col-span-12 py-3 lg:col-span-7">
          <div className="flex items-center justify-between">
            <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
              Below is a list of your working yards/locations:
            </p>
            <Button onClick={() => setIsOpen(true)} variant="primary" size="sm">
              New Yard <PlusIcon />
            </Button>
          </div>
          {mainMapYards.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {mainMapYards.map((yard: any, i: number) => (
                <div
                  key={i}
                  className="relative rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30"
                >
                  <img
                    src={yard.image_url || "/images/brand/default-yard.png"}
                    alt={yard.title || "Yard"}
                    className="mb-2 aspect-video h-auto w-full rounded-lg object-cover"
                  />
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {yard.title}
                  </p>
                  <p className="mt-1text-sm mt-1 mb-2 line-clamp-2 truncate text-gray-500">
                    {yard.description}
                  </p>
                  <p className="font-small text-xs text-gray-700 dark:text-gray-500">
                    Lat: {yard.location?.[0]} | long: {yard.location?.[1]}
                  </p>

                  <div className="absolute top-5 right-5 z-3 flex gap-4 rounded-lg bg-white/50 p-2 dark:bg-gray-800/50">
                    <BorderColorOutlinedIcon
                      onClick={() => {
                        setSelectedEvent(yard);
                        setIsOpen(true);
                      }}
                      fontSize="small"
                      className="cursor-pointer text-white"
                    />
                    <DeleteOutlinedIcon
                      onClick={() => {
                        handleDeleteYard(yard);
                      }}
                      fontSize="small"
                      color="error"
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative mt-3 flex min-h-85 w-full flex-col items-center justify-center gap-3 rounded-lg border text-gray-600 dark:border-gray-600 dark:text-gray-400">
              <h5 className="mb-0 text-2xl font-bold text-red-500">Oops!</h5>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                You don't seem to have any yard loctaions yet. Create one now!
              </p>
              <Button
                onClick={() => setIsOpen(true)}
                variant="primary"
                size="sm"
              >
                New Yard <PlusIcon />
              </Button>
            </div>
          )}
        </div>
      </div>
      <p className="text-theme-sm mt-3 py-9 text-center font-medium text-gray-800 dark:text-white/90">
        You have {mainMapYards.length} Yards. You can add unlimitted yards
      </p>
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
      <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/3">
        <p className="text-gray-500 dark:text-gray-400">
          Loading fleet metrics and map parameters...
        </p>
      </div>
    );
  }

  return <YardsContent />;
};

export default Yards;
