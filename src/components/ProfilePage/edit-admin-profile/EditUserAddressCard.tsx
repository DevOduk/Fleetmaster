"use client";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import handleProfileUpdate from "@/utils/clients/handleProfileUpdate";
import { Backdrop, CircularProgress } from "@mui/material";
import { hex } from "../client-profile/UserAddressCard";

export default function EditUserAddressCard() {
  const { profile, loading, setProfile } = useUser();
  const [profileDetails, setProfileDetails] = useState(profile || null);
  const { showToast } = useToast();
  const [backDrop, setBackDrop] = useState(false);


  useEffect(() => {
    if (profile && !loading) {
      setProfileDetails(profile)
    }
  }, [profile])

  const handleSave = () => {
    // proceed to update user profile details 
    handleProfileUpdate(profile?.id, profileDetails, setBackDrop, showToast, setProfile);
  };

  if (loading) {
    return <div className="container min-h-[80vh] mx-auto p-5 text-gray-400">Loading profile ...</div>
  } else if (!profile) {
    window.location.href = '/signin';
    return <div className="container min-h-[80vh] mx-auto p-5 text-gray-400">Redirecting to signin ...</div>
  }
  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={backDrop}
        onClick={() => null}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">

        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Update Address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Country</Label>
                  <Input type="text" value={profileDetails?.country} onChange={(e) => setProfileDetails((prev) => ({ ...prev, country: e.target.value }))} placeholder="United States" />
                </div>

                <div>
                  <Label>City/State</Label>
                  <Input type="text" value={profileDetails?.city} onChange={(e) => setProfileDetails((prev) => ({ ...prev, city: e.target.value }))} placeholder="Austin, TX." />
                </div>

                <div>
                  <Label>Postal Code</Label>
                  <Input type="text" value={profileDetails?.postal_code} onChange={(e) => setProfileDetails((prev) => ({ ...prev, postal_code: e.target.value }))} placeholder="ERT 2489" />
                </div>

                <div>
                  <Label>TAX ID</Label>
                  <Input disabled type="text" value={hex(profileDetails?.id)} placeholder="FMS4568384" />
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
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>

    </>
  );
}
