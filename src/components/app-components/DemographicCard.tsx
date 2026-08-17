"use client";

import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import { useUser } from "@/context/UserContext";
import { allCountriesDB } from "@/data/globalExports";
import CountryMap from "@/components/ecommerce/CountryMap";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { CircularProgress } from "@mui/material";
import { fetchClientsForTenant } from "@/app/actions/client";

export default function DemographicCard({ clients }: { clients: any[] }) {
  const { loading, profile } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allClients, setAllClients] = useState(clients || []);

  const countries = [
    ...new Set(allClients?.map((client) => client?.country).filter(Boolean)),
  ];

  useEffect(() => {
    if (clients) {
      setAllClients(clients);
    }
  }, [clients]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const refresh = async () => {
    setRefreshing(true);
    const newClients = await fetchClientsForTenant(profile?.tenant_id);

    setAllClients(newClients.data);
    setRefreshing(false);
  };

  // Build countries data for the map
  const mapCountries = countries.map((country) => ({
    latLng: allCountriesDB.find((c) => c.country === country)?.latlng,
    name: country,
  }));

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Tenant Demographic
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            Number of tenants based on country
          </p>
        </div>

        <div className="relative flex items-center gap-2 text-gray-400">
          {refreshing && <CircularProgress size={"1rem"} color="inherit" />}
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={() => {
                closeDropdown();

                refresh();
              }}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Refresh
            </DropdownItem>
            {/* <DropdownItem
                            onItemClick={closeDropdown}
                            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            Delete
                        </DropdownItem> */}
          </Dropdown>
        </div>
      </div>
      <div className="border-gary-200 my-6 overflow-hidden rounded-2xl border bg-gray-50 px-4 py-6 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
        <div
          id="mapOne"
          className="mapOne map-btn 2xsm:w-67 xsm:w-90 -mx-4 -my-6 h-53 w-63 sm:-mx-6 md:w-167 lg:w-159.5 xl:w-98 2xl:w-139"
        >
          <CountryMap countries={mapCountries} />
        </div>
      </div>

      <div className="space-y-5">
        {loading ? (
          <>
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded bg-gray-300 p-2 dark:bg-gray-600"
              >
                <div className="flex items-center gap-3">
                  <div className="w-full max-w-8 items-center rounded-full">
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                  </div>
                  <div>
                    <div className="mb-2 h-4 w-17 bg-gray-200"></div>
                    <div className="h-2.5 w-12 bg-gray-200"></div>
                  </div>
                </div>

                <div className="flex w-full max-w-35 items-center gap-3">
                  <div className="h-2.5 w-20 rounded bg-gray-400"></div>

                  <div className="h-3 w-10 bg-gray-200"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col gap-4">
            {countries.map((c, i) => {
              const percentage =
                (allClients?.filter((m) => m.country === c).length /
                  allClients.length) *
                100;
              const countryCode = allCountriesDB.find(
                (b) => b.country === c,
              ).code;

              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl bg-gray-200 p-3 dark:bg-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://flagsapi.com/${countryCode || "US"}/flat/64.png`}
                      alt={c}
                      className="h-10 w-10 rounded-full border object-contain"
                    />

                    <div>
                      <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                        {c}
                      </p>
                      <span className="text-theme-xs block w-fit text-nowrap text-gray-500 dark:text-gray-400">
                        {allClients
                          ?.filter((m) => m.country === c)
                          .length.toLocaleString() || 0}{" "}
                        Clients
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full max-w-35 items-center gap-3">
                    <div className="relative block h-2 w-full max-w-25 rounded-sm bg-gray-200 dark:bg-gray-800">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`bg-brand-500 absolute top-0 left-0 flex h-full items-center justify-center rounded-sm text-xs font-medium text-white`}
                      ></div>
                    </div>
                    <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                      {percentage.toFixed(0)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
