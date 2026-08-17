"use client";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import FileOpenOutlinedIcon from "@mui/icons-material/FileOpenOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";

const getIcon = (category: string) => {
  switch (category) {
    case "Vehicles":
      return <DirectionsCarFilledOutlinedIcon />;
    case "Bookings":
      return <EventAvailableOutlinedIcon />;
    case "Support Tickets":
      return <SupportAgentOutlinedIcon />;
    default:
      return <FileOpenOutlinedIcon />;
  }
};

function SearchModal({
  isOpen,
  setIsOpen,
  Tickets,
  Bookings,
  Vehicles,
  PAGES,
}: any) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 150);

    return () => clearTimeout(timer);
  }, [search]);

  const searchResults = useMemo(() => {
    if (!debouncedSearch.trim()) return [];

    return performGlobalSearch(debouncedSearch.trim());
  }, [debouncedSearch, Tickets, Bookings, Vehicles]);

  function performGlobalSearch(query: string) {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();

    const tickets = Tickets;
    const bookings = Bookings;

    // Filter and aggregate local data
    const results = [
      {
        category: "Vehicles",
        items: Vehicles.filter((v) =>
          `${v.make} ${v.model} ${v.year} ${v.category} ${v.description}`
            .toLowerCase()
            .includes(lowerQuery),
        ).map((v) => ({
          title: `${v.make} ${v.model}`,
          desc: `Ksh. ${v.daily_rate.toLocaleString()} | ${v.status} | ${v.description}`,
          link: `/vehicles/${v.id}`,
        })),
      },
      {
        category: "Bookings",
        items: bookings
          .filter((b) =>
            `${b.id} ${b.renter_name} ${b.booking_status} ${b.vehicleDetails.make} ${b.vehicleDetails.model}`
              ?.toLowerCase()
              .includes(lowerQuery),
          )
          .map((b) => ({
            title: `Booking #${b.id}`,
            desc: `View rental booking | Date created: ${new Date(b.created_at).toLocaleString()}`,
            link: `/bookings/${b.id}`,
          })),
      },
      {
        category: "Support Tickets",
        items: tickets
          .filter((t) =>
            `${t.ticket_number} ${t.subject} ${t.description}`
              ?.toLowerCase()
              .includes(lowerQuery),
          )
          .map((t) => ({
            title: t.ticket_number,
            desc: `${t.status} | ${t.category} | ${t.description}`,
            link: `/support/tickets/${t.ticket_number.replace("#", "")}`,
          })),
      },
      {
        category: "Help & Info",
        items: PAGES.filter((p) =>
          `${p.title} ${p.description}`?.toLowerCase().includes(lowerQuery),
        ).map((p) => ({ title: p.title, desc: p.description, link: p.link })),
      },
    ];

    // Return only groups that contain matches
    return results.filter((group) => group.items.length > 0);
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      className="max-w-175 p-5 lg:p-8"
    >
      <p className="text-medium mb-6 font-semibold text-gray-800 dark:text-white/90">
        Search
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation(); // Stop event bubbling just in case
        }}
      >
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
            <svg
              className="fill-gray-500 dark:fill-gray-400"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                fill=""
              />
            </svg>
          </span>
          <input
            value={search}
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="type to search"
            className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-800 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-white/30"
          />
        </div>
      </form>

      <div className="custom-scrollbar flex max-h-125 flex-col gap-3 overflow-auto">
        {searchResults.length > 0 ? (
          searchResults?.map((group) => (
            <div key={group.category} className="pt-5">
              {/* Category Header */}
              <h5 className="mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase">
                {group.category}
              </h5>

              <div className="flex flex-col gap-3 p-2">
                {group.items.map((item, idx) => (
                  <Link
                    key={idx}
                    target="_blank"
                    href={item.link}
                    className="group hover:border-brand-500 hover:text-brand-500 hover:bg-brand-500/10 hover:dark:border-brand-500 hover:dark:text-brand-500 flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 p-3 text-gray-500 transition-all duration-200 dark:border-gray-800"
                  >
                    {/* Dynamic Icon Helper */}
                    {getIcon(group.category)}

                    <div className="relative w-full overflow-hidden">
                      <p className="text-md group-hover:text-brand-500 dark:group-hover:text-brand-500 text-black dark:text-white">
                        {item.title}
                      </p>
                      <p className="group-hover:text-brand-500/80 dark:group-hover:text-brand-500/80 w-full truncate text-sm text-gray-500 dark:text-gray-600">
                        {item.desc}
                      </p>
                    </div>

                    <KeyboardArrowRightOutlinedIcon />
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : search.trim() === "" ? (
          <div className="flex h-40 w-full items-center justify-center text-gray-500">
            <p>Start typing to search...</p>
          </div>
        ) : (
          <div className="flex h-40 w-full items-center justify-center text-gray-500">
            <p>
              No results found for your search with keyword "{debouncedSearch}"
            </p>
          </div>
        )}

        {/* <div className="pt-5">
                                        <h5 className="text-gray-500">SEARCH RESULTS</h5>
                                        <div className="flex flex-col gap-3 pt-3 p-2">
                                            {[...Array(4)].map((S, i) => (
                                                <div key={i} className="group flex gap-3 items-center text-gray-500 border border-gray-300 dark:border-gray-800 p-3 rounded-xl cursor-pointer hover:border-brand-500 hover:text-brand-500 hover:bg-brand-500/10 hover:dark:border-brand-500 hover:dark:text-brand-500">
                                                    <FileOpenOutlinedIcon />
                                                    <div className="w-full">
                                                        <p className="text-black dark:text-white text-m group-hover:text-brand-500 dark:group-hover:text-brand-500">Some larger title</p>
                                                        <p className="text-gray-500 dark:text-gray-600 text-sm group-hover:text-brand-500/80 dark:group-hover:text-brand-500/80">A smaller dimmer description fof this item</p>
                                                    </div>
                                                    <KeyboardArrowRightOutlinedIcon />
                                                </div>
                                            ))}
                                        </div>
                                    </div> */}

        {/* <div className="pt-5">
                                        <h5 className="text-gray-500">RECENTS</h5>
                                        <div className="flex flex-col gap-3 pt-3 p-2">
                                            {[...Array(4)].map((s, i) => (
                                                <div key={i} className="group flex gap-3 items-center text-gray-500 border border-gray-300 dark:border-gray-800 p-3 rounded-xl cursor-pointer hover:border-brand-500 hover:text-brand-500 hover:bg-brand-500/10 hover:dark:border-brand-500 hover:dark:text-brand-500">
                                                    <HistoryOutlinedIcon />
                                                    <div className="w-full">
                                                        <p className="text-black dark:text-white text-m group-hover:text-brand-500 dark:group-hover:text-brand-500">Some larger title</p>
                                                        <p className="text-gray-500 dark:text-gray-600 text-sm group-hover:text-brand-500/80 dark:group-hover:text-brand-500/80">A smaller dimmer description fof this item</p>
                                                    </div>
                                                    <KeyboardArrowRightOutlinedIcon />
                                                </div>
                                            ))}
                                        </div>
                                    </div> */}
      </div>
      <div className="mt-8 flex w-full items-center justify-end gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          Close Search
        </Button>
      </div>
    </Modal>
  );
}

export default SearchModal;
