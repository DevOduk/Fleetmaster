"use client";

import { useState } from "react";
import { MoreDotIcon } from "@/icons";
import { useUser } from "@/context/UserContext";
import { allCountriesDB } from "@/data/globalExports";
import CountryMap from "@/components/ecommerce/CountryMap";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { getAllTenants } from "@/app/actions/tenant";
import { CircularProgress } from "@mui/material";

export default function DemographicCard({ tenants }: { tenants: any[]; }) {
    const { loading } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [allTenants, setAllTenants] = useState(tenants || []);
    const countries = [...new Set(allTenants?.flatMap(t => t.country))];

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    const refresh = async () => {
        setRefreshing(true);
        const newTenants = await getAllTenants();

        setAllTenants(newTenants);
        setRefreshing(false);
    }

    // Build countries data for the map
    const mapCountries = countries.map(country => ({
        latLng: allCountriesDB.find(c => c.country === country)?.latlng,
        name: country,
    }));

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 sm:p-6 h-full">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Tenant Demographic
                    </h3>
                    <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                        Number of tenants based on country
                    </p>
                </div>

                <div className="relative flex gap-2 text-gray-400 items-center">
                    {refreshing && <CircularProgress size={'1rem'} color="inherit" />}
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
                            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
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
            <div className="px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
                <div
                    id="mapOne"
                    className="mapOne map-btn -mx-4 -my-6 h-53 w-63 2xsm:w-67 xsm:w-90 sm:-mx-6 md:w-167 lg:w-159.5 xl:w-98 2xl:w-139"
                >
                    <CountryMap countries={mapCountries} />
                </div>
            </div>

            <div className="space-y-5">
                {
                    loading ? <>
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex bg-gray-300 p-2 rounded dark:bg-gray-600 items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="items-center w-full rounded-full max-w-8">
                                        <div
                                            className="h-10 w-10 bg-gray-200 rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <div className="bg-gray-200 mb-2 h-4 w-17">
                                        </div>
                                        <div className="bg-gray-200 h-2.5 w-12">
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full max-w-35 items-center gap-3">

                                    <div className="bg-gray-400 h-2.5 w-20 rounded">
                                    </div>

                                    <div className="bg-gray-200 h-3 w-10">
                                    </div>
                                </div>
                            </div>
                        ))}
                    </> :
                        <div className="flex flex-col gap-4">
                            {countries.map((c, i) => {
                                const percentage = ((allTenants?.filter(m => m.country === c).length) / allTenants.length) * 100;
                                const countryCode = allCountriesDB.find(b => b.country === c).code;

                                return (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-900 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://flagsapi.com/${countryCode || 'US'}/flat/64.png`}
                                                alt={c}
                                                className="w-10 h-10 border rounded-full object-contain"
                                            />

                                            <div>
                                                <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                                                    {c}
                                                </p>
                                                <span className="block w-fit text-nowrap text-gray-500 text-theme-xs dark:text-gray-400">
                                                    {(allTenants?.filter(m => m.country === c).length.toLocaleString() || 0)} Clients
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex w-full max-w-35 items-center gap-3">
                                            <div className="relative block h-2 w-full max-w-25 rounded-sm bg-gray-200 dark:bg-gray-800">
                                                <div style={{ width: `${percentage}%` }} className={`absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white`}></div>
                                            </div>
                                            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                {percentage.toFixed(0)}%
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                }

            </div>
        </div>
    );
}
