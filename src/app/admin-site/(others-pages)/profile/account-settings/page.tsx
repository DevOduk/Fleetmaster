import React from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import AccountSettings from "@/components/account/AccountSettings";

export default function SettingsPage() {
  return (
    <div>
      <PageBreadCrumb pageTitle="Account Settings" />

      <div className="mb-8">
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm p-2">
          Manage your account information, preferences, and security settings
        </p>
      </div>

      <AccountSettings />
    </div>
  );
}
