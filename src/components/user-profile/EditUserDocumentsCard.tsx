"use client";
import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Link from "next/link";
import DropzoneComponent from "../form/form-elements/DropZone";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";

export default function EditUserDocumentsCard() {
  const { profile, loading } = useUser();
  const [profileDetails, setProfileDetails] = useState(profile || null);
  const { showToast } = useToast();

  useEffect(() => {
    if (profile && !loading) {
      setProfileDetails(profile)
    }
  }, [profile])

  const handleSave = () => {
    // Handle save logic here
  };
  return (
    <>
      <div id="documents" className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">

        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Update Documents
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your document details to keep your profile up-to-date. Unverified documents will block online bookings!
            </p>
          </div>

          <div className="px-2 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>National ID/Passport</Label>
                <Input className="mb-3" type="text" placeholder="21345678" value={profileDetails?.national_id_number} onChange={(e)=> setProfileDetails((prev)=> ({...prev, national_id_number: e}))} />
                <DropzoneComponent title="Upload ID Document" />
              </div>

              <div>
                <Label>Driving License</Label>
                <Input className="mb-3" type="text" placeholder="621345678" value={profileDetails?.dl_number} onChange={(e)=> setProfileDetails((prev)=> ({...prev, dl_number: e}))} />
                <DropzoneComponent title="Upload Driving License" />
              </div>

              <div>
                <Label>KRA PIN (Kenyan Nationals)</Label>
                <Input className="mb-3" type="text" placeholder="A10621345678" value={profileDetails?.kra_pin_number} onChange={(e)=> setProfileDetails((prev)=> ({...prev, kra_pin_number: e}))} />

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
            <Button disabled={profile === profileDetails} size="sm" onClick={handleSave}>
              Send for Review
            </Button>
          </div>
        </div>
      </div>

    </>
  );
}
