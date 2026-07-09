"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function EditUserInfoCard() {
  const { profile } = useUser();

  const handleSave = () => {
    // Handle save logic here
  };
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">

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
          <div className="px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Social Links
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Facebook</Label>
                  <Input
                    type="text"
                    value={profile.socials?.facebook}
                    placeholder="https://www.facebook.com/"
                  />
                </div>

                <div>
                  <Label>X.com</Label>
                  <Input type="text"
                    value={profile.socials?.x} placeholder="https://x.com/" />
                </div>

                <div>
                  <Label>Linkedin</Label>
                  <Input
                    type="text"
                    value={profile.socials?.linkedin}
                    placeholder="https://www.linkedin.com/company/"
                  />
                </div>

                <div>
                  <Label>Instagram</Label>
                  <Input
                    type="text"
                    value={profile.socials?.instagram}
                    placeholder="https://instagram.com/"
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Personal Information
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>First Name</Label>
                  <Input type="text" placeholder="John" />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Last Name</Label>
                  <Input type="text" placeholder="Doe" />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Email Address</Label>
                  <Input type="text" placeholder="example@email.com" />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Phone</Label>
                  <Input type="text" placeholder="+1 093 633 9846" />
                </div>

                <div className="col-span-2">
                  <Label>Bio</Label>
                  <Input type="text" placeholder="Team Manager & Operations Supretendant" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Link href="/profile" className="mr-2">
              <Button size="sm" variant="outline" >
                Cancel
              </Button>
            </Link>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
