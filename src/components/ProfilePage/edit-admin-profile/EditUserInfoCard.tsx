"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { Backdrop, CircularProgress } from "@mui/material";
import handleProfileUpdate from "@/utils/admins/handleProfileUpdate";


export default function EditUserInfoCard() {

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


  const handleInputChange = (field: string, value: string) => {
    setProfileDetails((prev: any) => ({ ...prev, [field]: value }));
  };
  const handleSocialsInputChange = (field: string, value: string) => {
    setProfileDetails((prev: any) => ({
      ...prev,
      socials: {
        ...(prev?.socials || {}),
        [field]: value,
      },
    }));
  };
  if (loading) {
    return <div className="container min-h-[80vh] mx-auto p-5 text-gray-400">Loading profile ...</div>
  } else if (!profile) {
    window.location.href = '/signin';
    return <div className="container min-h-[80vh] mx-auto p-5 text-gray-400">Redirecting to signin ...</div>
  }
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={backDrop}
        onClick={() => null}
      >
        <CircularProgress color="inherit" />
      </Backdrop>


      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Update Personal Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        <form className="flex flex-col">

          <div className="mt-7">
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              Personal Information
            </h5>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <EditableInput placeholder="John" type="text" label="First Name" value={profileDetails?.first_name} onChange={(v) => handleInputChange("first_name", v)} />
              <EditableInput placeholder="Doe" type="text" label="Last Name" value={profileDetails?.last_name} onChange={(v) => handleInputChange("last_name", v)} />
              <EditableInput placeholder="example@email.com" type="email" label="Email Address" value={profileDetails?.email} onChange={(v) => handleInputChange("email", v)} />
              <EditableInput type="tel" label="Phone" value={profileDetails?.phone} onChange={(v) => handleInputChange("phone", v)} />
              <EditableInput placeholder="Write a short bio about yourself" type="text" label="Bio" value={profileDetails?.bio} onChange={(v) => handleInputChange("bio", v)} />

            </div>
          </div>

          <div className="px-2 pt-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Social Links
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <EditableInput placeholder="https://www.facebook.com/" type="text" label="Facebook" value={profileDetails?.socials?.facebook} onChange={(v) => handleSocialsInputChange("facebook", v)} />
                <EditableInput placeholder="https://www.x.com/" type="text" label="x.com" value={profileDetails?.socials?.x} onChange={(v) => handleSocialsInputChange("x", v)} />
                <EditableInput placeholder="https://www.linkedin.com/" type="text" label="Linkedin" value={profileDetails?.socials?.linkedin} onChange={(v) => handleSocialsInputChange("linkedin", v)} />
                <EditableInput placeholder="https://www.instagram.com/" type="text" label="Instagram" value={profileDetails?.socials?.instagram} onChange={(v) => handleSocialsInputChange("instagram", v)} />

              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Link href="/profile" className="mr-2">
              <Button size="sm" variant="outline" >
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
  );
}



function EditableInput({ label, value, onChange, type = "text", disabled, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean; placeholder?: string; }) {
  return (
    <div className="col-span-2 lg:col-span-1 space-y-1 flex flex-col">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{label}</Label>
      <Input placeholder={placeholder} disabled={disabled} type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="h-9" />
    </div>
  );
}