"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Link from "next/link";
import DropzoneComponent from "../form/form-elements/DropZone";

export default function EditUserDocumentsCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    closeModal();
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
       
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Update Documents
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your document details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>National ID/Passport</Label>
                  <Input className="mb-3" type="text" defaultValue="United States" />
                  <DropzoneComponent title="Upload ID Document" />
                </div>

                <div>
                  <Label>Driving License</Label>
                  <Input className="mb-3" type="text" defaultValue="Arizona, United States." />
                  <DropzoneComponent title="Upload Driving License" />
                </div>

                <div>
                  <Label>KRA PIN</Label>
                  <Input className="mb-3" type="text" defaultValue="ERT 2489" />
                  <DropzoneComponent accept={{ "application/pdf": [".pdf"] }} title="Upload KRA PIN" />
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
                Send for Review
              </Button>
            </div>
          </form>
        </div>
      </div>
      
    </>
  );
}
