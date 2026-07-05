"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Link from "next/link";
import { TrashBinIcon } from "@/icons";
import { useUser } from "@/context/UserContext";
import Checkbox from "../form/input/Checkbox";


export default function AccountSettings() {
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { profile } = useUser();

  useEffect(() => {
    if (!profile) return;
    setFormData(profile || null)
  }, [profile])

  console.log(profile)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      closeModal();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(null);
    closeModal();
  };

  return (
    <div className="">

      {/* Security Section */}
      <div className="relative w-full p-5 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900">


        <div className="space-y-4 lg:space-y-5">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Security
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Add an extra layer of security to your account
            </p>
          </div>

          <div className="p-3 rounded-xl mt-3 border border-green-500/50 w-full">
            <p className="text-muted mb-3 text-gray-400 text-sm">No 2FA Added.</p>
            <Button onClick={openModal} variant="primary-outline" size="sm">
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                />
              </svg>
              Add 2FA
            </Button>
          </div>
        </div>
      </div>

      <div className="relative w-full p-5 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Change Password
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="px-2 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Old Password</Label>
                <Input type="password" value={profile?.country} placeholder="********" />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" value={profile?.country} placeholder="********" />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" value={profile?.country} placeholder="********" />
              </div>

            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Link href="/profile" className="mr-2">
              <Button size="sm" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
      <div className="relative w-full p-5 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 space-y-4">

        {/* Danger Zone Section */}

        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Account Management
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Manage your account state here. Delete, pause, unpause your account
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10 lg:p-5">
          <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-400">
            Delete Account
          </h3>

          <div className="space-y-4">
            <p className="mb-3 text-sm text-red-800 dark:text-red-300">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="danger-outline" size="sm">
              Delete Account <TrashBinIcon />
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10 lg:p-5">
          <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-400">
            Pause Account
          </h3>

          <div className="space-y-4">
            <p className="mb-3 text-sm text-red-800 dark:text-red-300">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="danger-outline" size="sm">
              Delete Account <TrashBinIcon />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
