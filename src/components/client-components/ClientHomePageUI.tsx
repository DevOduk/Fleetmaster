// src/components/client-components/ClientHomePageUI.tsx
"use client";

import HeroSlider from "@/components/client-components/hero/slider";
import SearchForm from "@/components/client-components/hero/searchform";
import StatisticsBanner from "@/components/client-components/hero/statistics";
import Button from "@/components/ui/button/Button";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ViewAllLocations from "@/components/client-components/locations";
import ViewAllCategories from "@/components/client-components/categories";
import ViewAllSnapshots from "@/components/client-components/Vehicles/viewallvehiclesSnapshot";
import { useTenant } from "@/context/TenantContext";
import Link from "next/link";

export default function ClientHomePageUI() {
  const { tenant: tenantData } = useTenant();

  return (
    <div>
      <div className="container m-auto mt-3 grid grid-cols-1 xl:grid-cols-2">
        <SearchForm tenant={tenantData} />
        <HeroSlider />
      </div>

      <br />
      <br />

      <StatisticsBanner tenant={tenantData} />
      <br />

      <div className="container m-auto grid grid-cols-1 items-center gap-5 p-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ViewAllCategories tenantData={tenantData} />
        </div>

        <div className="lg:col-span-5">
          <h3 className="text-amber-500">ABOUT US</h3>
          <h2 className="mt-4 mb-3 text-3xl font-bold text-black dark:text-white">
            Welcome to {tenantData?.name}
          </h2>
          <p className="mb-4 max-w-175 text-sm text-gray-500 dark:text-gray-400">
            {tenantData?.about ? (
              tenantData.about
            ) : (
              <>
                At {tenantData?.name}, we are passionate about providing
                exceptional car rental services that exceed our customers'
                expectations.
              </>
            )}
          </p>
          <Link href={'/about'}>
            <Button variant="primary" size="sm" className="ml-auto px-8! py-2!">
              Read More <ChevronRightIcon />
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <h3 className="text-brand-500 text-center">Affordable and Reliable</h3>
        <h2 className="mt-4 mb-3 text-center text-3xl font-bold text-black dark:text-white">
          Explore All Vehicles
        </h2>
        <p className="m-auto max-w-175 text-center text-sm text-gray-500 dark:text-gray-400">
          Browse our extensive collection of well-maintained vehicles. From
          compact cars to luxury sedans, we have the perfect vehicle for your
          needs.
        </p>
        <div className="container m-auto mt-5">
          <ViewAllSnapshots tenant={tenantData?.slug} />

          <div className="flex items-center justify-between">
            <p className="text-gray-500 dark:text-gray-500">
              View our fleet across the country ...
            </p>
            <Link href={'/vehicles'}>
              <Button variant="primary" size="sm" className="ml-auto px-8! py-2!">
                View All <ChevronRightIcon />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <br />
      <div>
        <h3 className="text-brand-500 text-center">Available Countrywide</h3>
        <h2 className="mt-4 mb-3 text-center text-3xl font-bold text-black dark:text-white">
          Explore Our Locations
        </h2>
        <p className="m-auto max-w-175 text-center text-sm text-gray-500 dark:text-gray-400">
          Browse our extensive collection of well-maintained vehicles across
          diverse locations. From compact cars to luxury sedans, we have the
          perfect vehicle for your needs.
        </p>

        <ViewAllLocations tenantData={tenantData} />
      </div>
      <div className="container m-auto mb-5 border-t border-gray-500"></div>

      <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h3 className="text-amber-500">For all Activities</h3>
          <h2 className="mt-4 mb-3 text-3xl font-bold text-black dark:text-white">
            Explore all Categories
          </h2>
          <p className="max-w-175 text-sm text-gray-500 dark:text-gray-400">
            Browse our extensive collection of well-maintained vehicles across
            diverse locations. From compact cars to luxury sedans, we have the
            perfect vehicle for your needs.
          </p>
        </div>

        <div className="lg:col-span-7">
          <ViewAllCategories tenantData={tenantData} />
        </div>
      </div>
    </div>
  );
}
