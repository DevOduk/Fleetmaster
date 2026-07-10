"use client";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";

export default function EditUserAddressCard() {
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
                  <Input type="text" value={profileDetails?.country} placeholder="United States" />
                </div>

                <div>
                  <Label>City/State</Label>
                  <Input type="text" value={profileDetails?.city} placeholder="Austin, TX." />
                </div>

                <div>
                  <Label>Postal Code</Label>
                  <Input type="text" value={profileDetails?.postal_code} placeholder="ERT 2489" />
                </div>

                <div>
                  <Label>TAX ID</Label>
                  <Input type="text" value={profileDetails?.tax_id} placeholder="AS4568384" />
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
