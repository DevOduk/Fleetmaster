import React from 'react'

import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useMemo, useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";


function UpcomingMaintenance() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
      <div className="flex justify-between w-full">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Upcoming Maintenance
          </h3>
          <p className="text-theme-sm mt-1 font-normal text-gray-500 dark:text-gray-400">
            View upcoming maintenance task and schedule
          </p>
        </div>
        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              tag="a"
              onItemClick={closeDropdown}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              tag="a"
              onItemClick={closeDropdown}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

    </div>
  )
}

export default UpcomingMaintenance
