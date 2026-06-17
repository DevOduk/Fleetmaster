"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Link from "next/link";
import { CheckCircleIcon, DownloadIcon } from "@/icons";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined"
import { useUser } from "@/context/UserContext";


export default function UserDocumentsCard() {
      const {profile} = useUser();
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    closeModal();
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Documents
          </h4>

          <Link href="/profile/edit" className=''>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-gray-50 hover:text-blue-800 dark:border-gray-700 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-white/3 dark:hover:text-blue-200 lg:inline-flex lg:w-auto"
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                  fill=""
                />
              </svg>
              Update
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32 relative">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              National ID/Passport Number
            </p>
            <p className="text-sm flex items-center gap-3 justify-between font-medium text-gray-800 dark:text-white/90">
              <span className="flex items-center gap-2">
                <DownloadIcon style={{ width: 28, height: 28 }} />{profile?.national_id_number || "Loading ..."}
              </span>
              <TaskAltOutlinedIcon className="text-green-500 mt-1" />
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Driving License Number
            </p>
            <p className="text-sm flex items-center gap-3 justify-between font-medium text-gray-800 dark:text-white/90">
              <span className="flex items-center gap-2">
                <DownloadIcon style={{ width: 28, height: 28 }} />{profile?.dl_number || "Loading ..."}
              </span>
              <CancelOutlinedIcon className="text-red-500 mt-1" />

            </p>
          </div>

          <div className=''>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              KRA PIN
            </p>
            <p className="text-sm flex items-center gap-3 justify-between font-medium text-gray-800 dark:text-white/90">
              <span className="flex items-center gap-2">
                <DownloadIcon style={{ width: 28, height: 28 }} />
                {profile?.kra_pin_number || "Loading ..."}
              </span>
              <TaskAltOutlinedIcon className="text-green-500 mt-1" />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
