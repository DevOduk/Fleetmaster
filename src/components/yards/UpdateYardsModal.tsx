"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Modal } from "../ui/modal";
import { useToast } from "@/context/ToastContext";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { handleImageFileUpload } from "@/utils/uploads/imageUpload";
import {
  createTenantYard,
  updateTenantYardDetails,
} from "@/app/actions/tenant";
import { CheckLineIcon } from "@/icons";
import { CircularProgress } from "@mui/material";

// Dynamically import the map to prevent hydration/window errors
const MapPicker = dynamic(() => import("../map/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-2xl bg-gray-100" />
  ),
});

export default function UpdateYardsModal({
  tenantId,
  isOpen,
  yardDetails,
  setCompanyFormData,
  companyFormData,
  setIsOpen,
}: any) {
  const [isUpdloading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { showToast } = useToast();
  const [updatedYard, setUpdatedYard] = useState<any>(
    yardDetails || {
      title: "",
      description: "",
      image_url: "",
      location: [-1.286389, 36.817223],
    },
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const image = await handleImageFileUpload(e, showToast, "Profiles");

    if (image) {
      setUpdatedYard((prev: any) => ({ ...prev, image_url: image as string }));
      setIsUploading(false);
    } else {
      showToast("An error occured while uploading image!", "error");
      setIsUploading(false);
    }
  };

  const handleSubmitYard = async () => {
    setIsUpdating(true);
    const isUpdate = !!yardDetails;
    let res;
    const newYards = isUpdate
      ? companyFormData.yards.map((y: any) =>
          y.id === yardDetails.id ? updatedYard : y,
        )
      : [...(companyFormData.yards || []), updatedYard];
    if (isUpdate) {
      res = await updateTenantYardDetails(
        updatedYard.id,
        tenantId,
        updatedYard,
      );
    } else {
      showToast("Creating yard! Just a moment ...", "info");
      res = await createTenantYard(tenantId, updatedYard);
    }

    if (res.success) {
      setCompanyFormData((prev: any) => ({ ...prev, yards: newYards }));
      showToast(
        `Yard ${isUpdate ? "updated" : "created"} successfully.`,
        "success",
      );
      setTimeout(() => {
        setIsOpen(false);
        setIsUpdating(false);
      }, 2000);
    } else {
      showToast(res.error.message || "Failed to save yard.", "error");
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className="max-w-175 p-6 lg:p-10"
    >
      <div className="custom-scrollbar flex max-h-[calc(100vh-120px)] flex-col overflow-y-auto px-2">
        <h5 className="text-theme-xl mb-2 font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {yardDetails ? "Edit Yard" : "Create Yard"}
        </h5>

        {/* Image Section */}
        <label className="mt-4 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Upload Image
        </label>
        {updatedYard?.image_url && (
          <img
            className="mb-4 h-50 w-full rounded-lg object-cover"
            src={updatedYard.image_url}
          />
        )}
        {isUpdloading && (
          <div className="mb-4 flex h-50 w-full items-center justify-center rounded-lg object-cover">
            {" "}
            <CircularProgress color="primary" />{" "}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-400"
        />

        {/* Text Inputs */}
        <label className="mt-4 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Yard Name
        </label>
        <Input
          value={updatedYard?.title || ""}
          onChange={(e) =>
            setUpdatedYard({ ...updatedYard, title: e.target.value })
          }
          className="h-11 w-full rounded-lg border px-4 text-sm"
        />

        <label className="mt-4 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Yard Description
        </label>
        <Input
          value={updatedYard?.description || ""}
          onChange={(e) =>
            setUpdatedYard({ ...updatedYard, description: e.target.value })
          }
          className="h-11 w-full rounded-lg border px-4 text-sm"
        />

        {/* Map Section */}
        <label className="mt-4 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Location (Click map to set)
        </label>
        <div className="mt-2 h-64 w-full overflow-hidden rounded-2xl border">
          <MapPicker
            center={updatedYard?.location || [-1.286389, 36.817223]}
            setLocation={(loc) =>
              setUpdatedYard({ ...updatedYard, location: loc })
            }
          />
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            size="sm"
            variant="danger-outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={isUpdating || isUpdloading}
            size="sm"
            variant="primary"
            onClick={handleSubmitYard}
          >
            {isUpdloading ? (
              "Uploading image ..."
            ) : isUpdating ? (
              "Saving details ..."
            ) : yardDetails ? (
              <>
                Update Yard <CheckLineIcon />
              </>
            ) : (
              <>
                Create Yard <CheckLineIcon />
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
