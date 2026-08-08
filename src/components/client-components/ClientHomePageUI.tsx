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

export default function ClientHomePageUI() {
  const { tenant: tenantData } = useTenant();

  return (
    <div>
      <div className="container m-auto grid grid-cols-1 xl:grid-cols-2 mt-3">
        <SearchForm tenant={tenantData} />
        <HeroSlider />
      </div>

      <br />
      <br />

      <StatisticsBanner tenant={tenantData} />
      <br />

      <div className="grid items-center container m-auto grid-cols-1 lg:grid-cols-12 gap-5 p-4">
        <div className="lg:col-span-7">
          <ViewAllCategories tenantData={tenantData} />
        </div>

        <div className="lg:col-span-5">
          <h3 className="text-amber-500">ABOUT US</h3>
          <h2 className="text-3xl mt-4 mb-3 font-bold text-black dark:text-white">
            Welcome to {tenantData?.name}
          </h2>
          <p className="text-sm mb-4 text-gray-500 dark:text-gray-400 max-w-175">
            {tenantData?.about ? (
              tenantData.about
            ) : (
              <>
                At {tenantData?.name}, we are passionate about providing
                exceptional car rental services that exceed our customers'
                expectations. With a commitment to quality, reliability, and
                customer satisfaction, we strive to be the preferred choice for
                all your car rental needs.
              </>
            )}
          </p>

          <Button
            variant="primary"
            size="sm"
            className="px-8! py-2! ml-auto"
          >
            Read More <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-brand-500 text-center">Affordable and Reliable</h3>
        <h2 className="text-3xl mt-4 mb-3 font-bold text-black text-center dark:text-white">
          Explore All Vehicles
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-175 m-auto">
          Browse our extensive collection of well-maintained vehicles. From
          compact cars to luxury sedans, we have the perfect vehicle for your
          needs.
        </p>
        <div className="mt-5 container m-auto">
          <ViewAllSnapshots tenant={tenantData?.slug} />

          <div className="flex items-center">
            <p className="text-gray-500 dark:text-gray-500">
              View our fleet across the country ...
            </p>
            <Button
              variant="primary"
              size="sm"
              className="px-8! py-2! ml-auto"
            >
              View All <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>

      <br />
      <div>
        <h3 className="text-brand-500 text-center">Available Countrywide</h3>
        <h2 className="text-3xl mt-4 mb-3 font-bold text-black text-center dark:text-white">
          Explore Our Locations
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-175 m-auto">
          Browse our extensive collection of well-maintained vehicles across
          diverse locations. From compact cars to luxury sedans, we have the
          perfect vehicle for your needs.
        </p>

        <ViewAllLocations tenantData={tenantData} />
      </div>
      <div className="border-gray-500 border-t container m-auto mb-5"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4">
        <div className="lg:col-span-5">
          <h3 className="text-amber-500">For all Activities</h3>
          <h2 className="text-3xl mt-4 mb-3 font-bold text-black dark:text-white">
            Explore all Categories
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-175">
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