import React from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import AccountSettings from "@/components/account/AccountSettings";

export default function SettingsPage() {
  return (
    <div className="container m-auto min-h-screen">
      <PageBreadCrumb pageTitle="Account Settings" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account information, preferences, and security settings
        </p>
      </div>

      <AccountSettings />
    </div>
  );
}
