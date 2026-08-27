"use client";
import React, { useEffect, useState } from "react";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Link from "next/link";
import DropzoneComponent from "../../form/form-elements/DropZone";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import { Backdrop, CircularProgress } from "@mui/material";
import handleProfileUpdate from "@/utils/admins/handleProfileUpdate";
import { usePathname, useSearchParams } from "next/navigation";

export default function EditUserDocumentsCard() {
  const { profile, loading, setProfile } = useUser();
  const [profileDetails, setProfileDetails] = useState(profile || null);
  const { showToast } = useToast();
  const [backDrop, setBackDrop] = useState(false);
  const pathname = usePathname();
  const searchString = useSearchParams().toString();
  const currentPageUrl = encodeURIComponent(
    searchString ? btoa(`${pathname}?${searchString}`) : btoa(pathname),
  );

  useEffect(() => {
    if (profile && !loading) {
      setProfileDetails(profile);
    }
  }, [profile]);

  const handleSave = () => {
    // proceed to update user profile details
    handleProfileUpdate(
      profile?.id,
      profileDetails,
      setBackDrop,
      showToast,
      setProfile,
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto min-h-[80vh] p-5 text-gray-400">
        Loading profile ...
      </div>
    );
  } else if (!profile) {
    window.location.href = `/signin?r=${currentPageUrl}`;
    return (
      <div className="container mx-auto min-h-[80vh] p-5 text-gray-400">
        Redirecting to signin ...
      </div>
    );
  }
  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={backDrop}
        onClick={() => null}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div
        id="documents"
        className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800"
      >
        <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Update Documents
            </h4>
            <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
              Update your document details to keep your profile up-to-date.
              Unverified documents will block online bookings!
            </p>
          </div>

          <div className="custom-scrollbar overflow-y-auto px-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>National ID/Passport</Label>
                <Input
                  className="mb-3"
                  type="text"
                  placeholder="21345678"
                  value={profileDetails?.national_id_number}
                  onChange={(e) =>
                    setProfileDetails((prev) => ({
                      ...prev,
                      national_id_number: e.target.value,
                    }))
                  }
                />
                <DropzoneComponent title="Upload ID Document" />
              </div>

              <div>
                <Label>Driving License</Label>
                <Input
                  className="mb-3"
                  type="text"
                  placeholder="621345678"
                  value={profileDetails?.dl_number}
                  onChange={(e) =>
                    setProfileDetails((prev) => ({
                      ...prev,
                      dl_number: e.target.value,
                    }))
                  }
                />
                <DropzoneComponent title="Upload Driving License" />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Link href="/profile" className="mr-2">
              <Button size="sm" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              disabled={profile === profileDetails}
              size="sm"
              onClick={handleSave}
            >
              Send for Review
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
