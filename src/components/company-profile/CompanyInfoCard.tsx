"use client";

import { fetchTenantDetails } from "@/app/actions/tenant";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import ExpiryBanner from "./ExpiryBanner";
import { formatedValue } from "../ecommerce/MonthlyTarget";
import Checkbox from "../form/input/Checkbox";

export default function CompanyInfoCard() {
  const { profile } = useUser();
  const [company, setCompany] = useState<any>(null);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(true);

  useEffect(() => {
    const getTenantDetails = async () => {
      if (!profile?.tenant_id) {
        setLoadingCompany(false);
        return;
      }
      if (profile?.tenant_id) {
        const res = await fetchTenantDetails(profile.tenant_id);

        setCompany(res.data);
        if (res) {
          setLoadingCompany(false);
        }
      }
    };

    getTenantDetails();
  }, [profile?.tenant_id]);

  if (!profile || !profile.tenant_id || loadingCompany) {
    return (
      <div className="mx-auto w-full animate-pulse space-y-6 p-6">
        {/* Header Section Placeholder */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-6 dark:border-gray-800">
          <div className="space-y-2">
            <div className="h-6 w-48 rounded-md bg-gray-200 dark:bg-gray-600"></div>
            <div className="h-4 w-32 rounded-md bg-gray-100 dark:bg-gray-600"></div>
          </div>
          <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-600"></div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-xl border border-gray-100 p-5 dark:border-gray-700"
            >
              <div className="h-4 w-34 rounded-md bg-gray-100 dark:bg-gray-600"></div>
              <div className="h-8 w-19 rounded-md bg-gray-200 dark:bg-gray-600"></div>
            </div>
          ))}
        </div>

        {/* Main Content Area / List Placeholder */}
        <div className="space-y-4 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
          <div className="mb-2 h-5 w-36 rounded-md bg-gray-200 dark:bg-gray-500"></div>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0 dark:border-gray-600"
            >
              <div className="flex w-full items-center space-x-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                <div className="w-full max-w-[60%] space-y-2">
                  <div className="h-4 w-3/4 rounded-md bg-gray-200 dark:bg-gray-600"></div>
                  <div className="h-3 w-1/2 rounded-md bg-gray-100 dark:bg-gray-600"></div>
                </div>
              </div>
              <div className="h-4 w-12 rounded-md bg-gray-100 dark:bg-gray-600"></div>
            </div>
          ))}
        </div>

        {/* Subtle Loading Text Indicator */}
        <div className="flex items-center justify-center space-x-2 pt-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
          <span className="pl-1 text-xs font-medium text-gray-400">
            Syncing workspace...
          </span>
        </div>
      </div>
    );
  }
  if (!company) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800">
        <div className="mb-4 text-4xl">🏢</div>
        <h3 className="text-lg font-semibold text-red-600">
          Company Not Found
        </h3>
        <p className="mt-2 max-w-sm text-gray-500">
          We couldn't locate a profile associated with your account. If you
          believe this is an error, please contact support.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <ExpiryBanner
        plan={company.subscription_plan}
        expiryDate={company.expiry_date}
      />

      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            {company.tenant_logo ? (
              <img
                src={company.tenant_logo}
                alt="Company Logo"
                className="h-full w-full bg-white object-contain p-1"
              />
            ) : (
              <span className="text-xl font-bold text-gray-400">
                {company.name?.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {company.name}
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-gray-500">
                {company.slug}.fleetmaster.co.ke{" "}
                {company.website && ` - ${company.website}`}
              </p>
              <span className="text-xs text-gray-400">|</span>
              <p className="text-xs font-medium text-gray-500">
                {company.subscription_plan || "N/A"} Plan
              </p>
              <span className="text-xs text-gray-400">|</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${company.subscription_status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600"}`}
              >
                {company.subscription_status || "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/company-profile/edit"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Edit Profile
        </Link>
      </div>

      <div className="space-y-8 p-6">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {company.description || "No description available."}
        </p>

        {/* Contact Details */}
        <ComponentCard title="Contact Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DataPoint label="Email Address" value={company.email} />
            <DataPoint label="Primary Phone Number" value={company.phone} />
            <DataPoint
              label="Location"
              value={`${company.county || "N/A"}, ${company.country}`}
            />
            <DataPoint label="City" value={`${company.city || "N/A"}`} />
            <DataPoint
              label="Zip Code"
              value={`${company.zip_code || "N/A"}`}
            />
            <DataPoint label="Address" value={`${company.address || "N/A"}`} />
          </div>
        </ComponentCard>

        {/* Operational Settings */}
        <ComponentCard title="System Settings">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DataPoint label="Timezone" value={company.timezone} />
            <DataPoint label="Language" value={company.language} />
            <DataPoint label="Currency" value={company.currency} />
            <DataPoint
              label="Buffer (Hours)"
              value={`${company.buffer || "N/A"} hrs`}
            />
            <DataPoint
              label="Color Preference"
              value={`${company.color || "Default"}`}
            />
            <DataPoint
              label="Monthly Target"
              value={formatedValue(company?.monthly_target)}
            />
          </div>
        </ComponentCard>

        <ComponentCard title="Leasing Options">
          <div className="mt-auto flex flex-col items-center justify-between gap-3 rounded-2xl bg-gray-50 p-6 sm:flex-row dark:bg-gray-900/50">
            <Checkbox
              label="Allow leasing options?"
              checked={company?.leasing_accepted}
              onChange={() => {}}
            />
          </div>
        </ComponentCard>

        {/* Yards Section */}
        {company?.yards?.length > 0 && (
          <ComponentCard title="Yards & Depots">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {company?.yards.map((yard: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30"
                >
                  <img
                    src={yard.image_url || "/images/brand/default-yard.png"}
                    alt={yard.title || "Yard"}
                    className="mb-2 aspect-video h-auto w-full rounded-lg object-cover"
                  />
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {yard.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                    {yard.description}
                  </p>
                </div>
              ))}
            </div>
          </ComponentCard>
        )}
      </div>

      {/* Footer / About Section */}
      {company.about && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <p className="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            About
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {company.about}
          </p>
        </div>
      )}
    </div>
  );
}

function DataPoint({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col rounded-lg bg-gray-50 p-3 dark:bg-gray-800/30">
      <span className="mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        {label}
      </span>
      <span className="flex items-center text-sm font-semibold text-gray-900 dark:text-gray-100">
        {label === "Color Preference" && (
          <span
            className="mr-2 inline-block h-4 w-4 rounded-full"
            style={{ backgroundColor: value }}
          ></span>
        )}{" "}
        {value || <span className="font-normal text-gray-300 italic">N/A</span>}
      </span>
    </div>
  );
}
