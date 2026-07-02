"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/context/ToastContext";
import { updateTenantDetails } from "@/app/actions/tenant";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

// Dynamically import the map to prevent hydration/window errors
const MapPicker = dynamic(() => import("../map/MapPicker"), { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-2xl" /> 
});

export default function UpdateYardsModal({ 
    tenantId, isOpen, yardDetails, setCompanyFormData, companyFormData , setIsOpen
}: any) {
    const [isUpdating, setIsUpdating] = useState(false);
    const { showToast } = useToast();
    const [updatedYard, setUpdatedYard] = useState<any>(yardDetails || { 
        title: '', 
        description: '', 
        imageUrl: '', 
        location: [-1.286389, 36.817223] 
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedYard((prev: any) => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitYard = async () => {
        setIsUpdating(true);
        const isUpdate = !!yardDetails;
        const newYards = isUpdate 
            ? companyFormData.yards.map((y: any) => y.title === yardDetails.title ? updatedYard : y)
            : [...(companyFormData.yards || []), updatedYard];

        const res = await updateTenantDetails(tenantId, { ...companyFormData, yards: newYards });
        
        if (res.success) {
            setCompanyFormData((prev: any) => ({ ...prev, yards: newYards }));
            showToast(`Yard ${isUpdate ? 'updated' : 'created'} successfully.`, "success");
            setTimeout(() => {
                setIsOpen(false);
                setIsUpdating(false);
            }, 2000);
        } else {
            showToast("Failed to save yard.", "error");
            setIsUpdating(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => setIsOpen(false)} 
            className="max-w-175 p-6 lg:p-10"
        >
            <div className="flex flex-col px-2 overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
                <h5 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
                    {yardDetails ? "Edit Yard" : "Create Yard"}
                </h5>

                {/* Image Section */}
                <label className="mb-1.5 mt-4 block text-sm font-medium text-gray-700 dark:text-gray-400">Image</label>
                {updatedYard?.imageUrl && <img className="w-full mb-4 rounded-lg h-50 object-cover" src={updatedYard.imageUrl} />}
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-700 text-gray-700 dark:text-gray-400" />

                {/* Text Inputs */}
                <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-400">Yard Name</label>
                <Input value={updatedYard?.title || ''} onChange={(e) => setUpdatedYard({...updatedYard, title: e.target.value})} className="h-11 w-full rounded-lg border px-4 text-sm" />

                <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-400">Yard Description</label>
                <Input value={updatedYard?.description || ''} onChange={(e) => setUpdatedYard({...updatedYard, description: e.target.value})} className="h-11 w-full rounded-lg border px-4 text-sm" />

                {/* Map Section */}
                <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-400">Location (Click map to set)</label>
                <div className="w-full mt-2 h-64 border rounded-2xl overflow-hidden">
                    <MapPicker 
                        center={updatedYard?.location || [-1.286389, 36.817223]} 
                        setLocation={(loc) => setUpdatedYard({...updatedYard, location: loc})} 
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 mt-6 justify-end">
                    <Button size="sm" variant="danger-outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button size="sm" variant="primary" onClick={handleSubmitYard}>
                        {isUpdating ? 'Just a moment ...' : yardDetails ? "Update Yard" : "Create Yard"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}