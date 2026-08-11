"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Backdrop, CircularProgress } from "@mui/material";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { PencilIcon, TrashBinIcon } from "@/icons";
import { useUser } from "@/context/UserContext";
import Select from "../form/Select";
import { updatePassword } from "@/app/actions/client";
import { useToast } from "@/context/ToastContext";


export default function AccountSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const { profile, setProfile } = useUser();
  const { showToast  } = useToast();
  const [profileDetails, setProfileDetails] = useState(null);


  const handleInputChange = (field: string, value: string) => {
    setProfileDetails((prev: any) => ({ ...prev, [field]: value }));
  };
const handlePasswordChange = async ()=>{
  setIsSaving(true)
  const res = await updatePassword(profile.id, profileDetails);

  if(res.success){
    showToast('Your password was changed successfully! You will be logged out in all devices.','success');
    setProfile(res.data);
  }
  setIsSaving(false)
}

  return (
    <>    
          <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={isSaving}
            onClick={() => null}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

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

          <div>Email</div>
          <div>Phone</div>
          <div>Gogle</div>
          <div>Third Party Authenticator</div>

          <div className="p-3 rounded-xl mt-3 border border-green-500/50 w-full">
            <p className="text-muted mb-3 text-gray-400 text-sm text-center p-4">No 2FA Added.</p>
            <Button endIcon={<PencilIcon />} variant="success" size="sm">
              Add 2FA
            </Button>
          </div>
        </div>
      </div>




      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Security
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        <form className="flex flex-col" onSubmit={(e)=>{
          e.preventDefault();
          e.stopPropagation();

          handlePasswordChange()
        }}>
          <div className="px-2 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <EditableInput placeholder="Enter old password" type="password" label="Old Password" value={profileDetails?.old_password} onChange={(v) => handleInputChange("old_password", v)} />
              <EditableInput placeholder="Enter password" type="password" label="New Password" value={profileDetails?.password} onChange={(v) => handleInputChange("password", v)} />
              <EditableInput placeholder="Confirm password" type="password" label="Confirm Password" value={profileDetails?.confirm_password} onChange={(v) => handleInputChange("confirm_password", v)} />
            </div>
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
    </>
  );
}


export function EditableInput({ label, value, onChange, type = "text", disabled, placeholder, options }: { label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean; placeholder?: string; options?: any[]; }) {
  return (
    <div className="col-span-2 lg:col-span-1 space-y-1 flex flex-col">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{label}</Label>
      {
        type === "select" ?
          <Select value={value || ""} defaultValue={value || ""} placeholder={placeholder} onChange={(e) => onChange(e)} options={(options || [])} />
          :
          <Input placeholder={placeholder} disabled={disabled} type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="h-9" />
      }
    </div >
  );
}