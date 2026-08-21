"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import Link from "next/link";
import React, { useState, useEffect, useRef, useMemo } from "react";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useTenant } from "@/context/TenantContext";
import { useFleet } from "@/context/FleetContext";
import { fetchUserTickets } from "@/app/actions/support";
import SearchModal from "@/components/header/SearchModal";
import { getNotifications } from "@/app/actions/notifications";
import { fetchBookingsForClient } from "@/app/actions/bookings";
import { userVerified } from "@/utils/clients/checkverification";

export default function ClientHeader() {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const pathname = usePathname();
  const { profile, logout, loading: authLoading } = useUser();
  const { vehicles } = useFleet();
  const { tenant, loading: tenantLoading } = useTenant();
  const [cachedTickets, setCachedTickets] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [cachedBookings, setCachedBookings] = useState([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const navLinks = [
    {
      name: "Find a car",
      description:
        "Browse our available vehicles available for rentals all accross our yards",
      href: "/vehicles",
    },
    {
      name: "Lease your car",
      description: "Learn about our leasing options",
      href: "/lease",
    },
    {
      name: "About us",
      description: "Get to know our company",
      href: "/about",
    },
    {
      name: "Contact us",
      description:
        "Reach out to our team of experts,call us, email us, chat with us on whatsapp",
      href: "/contact",
    },
    { name: "Our yards", description: "Visit our locations", href: "/yards" },
  ];

  const fetchUserBookings = async (userId: string) => {
    const { data, error } = await fetchBookingsForClient(userId);
    return { data, error };
  };

  const PageLinks = navLinks.map((link, index) => {
    return {
      title: link.name,
      description: link.description,
      link: link.href,
    };
  });
  // client component
  const CLIENT_PAGES = useMemo(
    () => [
      {
        title: "Terms and Conditions",
        description: "Review our terms and conditions",
        link: "/terms-conditions",
      },
      {
        title: "Support Tickets",
        description: "Submit and track support tickets",
        link: "/support",
      },
      {
        title: "View Profile",
        description: "View my profile information",
        link: "/profile",
      },
      {
        title: "Edit Profile",
        description:
          "Update my profile information. Change my details name, email, phone number etc.",
        link: "/profile",
      },
      {
        title: "Account Settings",
        description:
          "Manage your account settings, change password, preferences, 2FA, Two Factor Authentication, dark/light theme, notifications preferences etc.",
        link: "/profile/account-settings",
      },
      ...PageLinks,
    ],
    [PageLinks],
  );

  useEffect(() => {
    if (!profile?.id) return;

    const loadSearchData = async () => {
      const [ticketsRes, bookingsRes] = await Promise.all([
        fetchUserTickets(profile.id),
        fetchUserBookings(profile.id),
      ]);

      setCachedTickets(ticketsRes?.data || []);
      setCachedBookings(bookingsRes?.data || []);
    };

    const fetchNotifications = async () => {
      const notificationsRes = await getNotifications(profile.id);

      if (notificationsRes.error) {
        console.error("Error fetching notifications:", notificationsRes.error);
        return;
      }

      setNotifications(notificationsRes.data || []);
    };

    loadSearchData();
    fetchNotifications();
  }, [profile?.id]);

  useEffect(() => {
    // 1. Wait until both authentication and tenant contexts have fully finished loading
    if (authLoading || tenantLoading) return;

    // 2. If a user profile exists, but their role is NOT 'Client', kick them out safely
    if (profile && profile.role !== "Client") {
      console.warn(
        "Unauthorized role detected in client workspace. Executing logout...",
      );
      logout();
    }
  }, [profile, authLoading, tenantLoading, logout]);

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const t = setTimeout(() => {
      const verified = userVerified(profile);
      if (!verified) setShowVerificationMessage(true);
    }, 10000);
    return () => clearTimeout(t);
  }, [profile]);

  const shortName = tenant?.name.split(" ").slice(0, 2).join(" ");
  const logoShort = `${shortName?.split(" ")[0].charAt(0)}${shortName?.split(" ")[1].charAt(0)}`;

  return (
    <>
      {showVerificationMessage && (
        <div className="border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15 relative z-40 container m-2 mx-auto flex items-center gap-3 rounded-xl border p-3">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.3499 12.0004C20.3499 16.612 16.6115 20.3504 11.9999 20.3504C7.38832 20.3504 3.6499 16.612 3.6499 12.0004C3.6499 7.38881 7.38833 3.65039 11.9999 3.65039C16.6115 3.65039 20.3499 7.38881 20.3499 12.0004ZM11.9999 22.1504C17.6056 22.1504 22.1499 17.6061 22.1499 12.0004C22.1499 6.3947 17.6056 1.85039 11.9999 1.85039C6.39421 1.85039 1.8499 6.3947 1.8499 12.0004C1.8499 17.6061 6.39421 22.1504 11.9999 22.1504ZM13.0008 16.4753C13.0008 15.923 12.5531 15.4753 12.0008 15.4753L11.9998 15.4753C11.4475 15.4753 10.9998 15.923 10.9998 16.4753C10.9998 17.0276 11.4475 17.4753 11.9998 17.4753L12.0008 17.4753C12.5531 17.4753 13.0008 17.0276 13.0008 16.4753ZM11.9998 6.62898C12.414 6.62898 12.7498 6.96476 12.7498 7.37898L12.7498 13.0555C12.7498 13.4697 12.414 13.8055 11.9998 13.8055C11.5856 13.8055 11.2498 13.4697 11.2498 13.0555L11.2498 7.37898C11.2498 6.96476 11.5856 6.62898 11.9998 6.62898Z"
              fill="#F04438"
            />
          </svg>
          <p className="w-full text-sm text-gray-500 dark:text-gray-400">
            Your account is not verified. Some features may not work.{" "}
            <Link className="text-brand-500" href={"/profile/edit#documents"}>
              Verify Now
            </Link>
          </p>
          <CloseOutlinedIcon
            fontSize="small"
            className="cursor-pointer text-red-500"
            onClick={() => setShowVerificationMessage(false)}
          />
        </div>
      )}
      <header className="sticky top-0 z-40 flex w-full border-gray-200 bg-white lg:border-b dark:border-gray-800 dark:bg-gray-900">
        <div className="container m-auto flex grow flex-col items-center justify-between lg:flex-row lg:px-2">
          <div className="flex w-full items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4 dark:border-gray-800">
            <Link href="/" className="lg:block">
              {tenantLoading ? (
                <div className="h-8 w-40 animate-pulse rounded bg-gray-500"></div>
              ) : tenant.tenant_logo ? (
                <img
                  style={{
                    width: 154,
                    height: 32,
                  }}
                  className="w-auto rounded object-cover"
                  src={tenant.tenant_logo}
                // alt={`${tenant.name} Logo`}
                />
              ) : (
                <div className="flex items-center gap-2 font-bold text-nowrap text-black dark:text-white">
                  <span className="bg-brand-500 flex aspect-square! h-10 items-center justify-center rounded-lg p-2 font-extrabold text-white uppercase">
                    {logoShort}
                  </span>
                  {shortName}
                </div>
              )}
            </Link>

            <button
              onClick={toggleApplicationMenu}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {isApplicationMenuOpen ? (
                <CloseOutlinedIcon />
              ) : (
                <MenuOutlinedIcon />
              )}

              {/* <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                                fill="currentColor"
                            />
                        </svg> */}
            </button>
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={index}
                  href={link.href}
                  className={`hover:text-brand-500 dark:hover:text-brand-500 text-theme-sm p-2 text-nowrap ${isActive ? "text-brand-500 dark:text-brand-600 font-semibold" : "text-gray-500 dark:text-gray-400"} hidden lg:block`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div
            className={`${isApplicationMenuOpen ? "flex w-full" : "hidden"
              } shadow-theme-md ms-auto items-center justify-between gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0 lg:shadow-none`}
          >
            <div className="hidden xl:block">
              <div>
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
                    ref={inputRef}
                    onClick={() => setIsOpen(true)}
                    type="text"
                    placeholder="hold ctrl + k to search"
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-107.5 dark:border-gray-800 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-white/30"
                  />

                  <button className="absolute top-1/2 right-2.5 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-1.75 py-[4.5px] text-xs tracking-[-0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/3 dark:text-gray-400">
                    <span> ⌘ </span>
                    <span> K </span>
                  </button>
                </div>

                <SearchModal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  Tickets={cachedTickets}
                  Bookings={cachedBookings}
                  Vehicles={vehicles}
                  PAGES={CLIENT_PAGES}
                />
              </div>
            </div>
            <div className="2xsm:gap-3 flex items-center gap-2">
              {/* <!-- Dark Mode Toggler --> */}
              <ThemeToggleButton />
              {/* <!-- Dark Mode Toggler --> */}

              <NotificationDropdown
                notifications={notifications}
                setNotifications={setNotifications}
              />
              {/* <!-- Notification Menu Area --> */}
            </div>
            {/* <!-- User Area --> */}
            <UserDropdown />
          </div>

          {isApplicationMenuOpen && (
            <div className="flex w-full flex-col gap-2 p-2 lg:hidden">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    onClick={toggleApplicationMenu}
                    key={index}
                    href={link.href}
                    className={`hover:text-brand-500 dark:hover:text-brand-500 text-theme-sm p-2 text-nowrap ${isActive ? "text-brand-500 dark:text-brand-600 font-semibold" : "text-gray-500 dark:text-gray-400"} block lg:hidden`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
