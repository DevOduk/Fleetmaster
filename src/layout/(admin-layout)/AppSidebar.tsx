"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../context/SidebarContext";
import { ChevronDownIcon, HorizontaLDots } from "../../icons/index";
import SidebarWidget from "./SidebarWidget";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import NavigationOutlinedIcon from "@mui/icons-material/NavigationOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import WysiwygOutlinedIcon from "@mui/icons-material/WysiwygOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EmojiTransportationOutlinedIcon from "@mui/icons-material/EmojiTransportationOutlined";
import { useAdminFleet } from "@/context/AdminFleetContext";
import { useAdminBooking } from "@/context/AdminBookingContext";
import { useUser } from "@/context/UserContext";
import SidebarExpiryWidget from "./SidebarExpiryWidget";
import {
  getExpiryString,
  getRemainingDays,
} from "@/components/company-profile/ExpiryBanner";
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined"


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  pro?: boolean;
  expert?: boolean;
  count?: [boolean, number?];
  new?: boolean;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    count?: [boolean, number?];
  }[];
};

export const iconStyle = {
  fontSize: '1.2rem'
}
export const navItems: NavItem[] = [
  {
    icon: <DashboardCustomizeOutlinedIcon sx={iconStyle} />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <CalendarTodayOutlinedIcon sx={iconStyle} />,
    name: " Bookings",
    subItems: [
      { name: "All Bookings", path: "/bookings", pro: false, count: [true] },
      { name: "Calendar", path: "/calendar", pro: false },
      { name: "Payments", path: "/payments", pro: false, new: false },
    ],
  },
  {
    icon: <DirectionsCarFilledOutlinedIcon sx={iconStyle} />,
    name: " Vehicles",
    path: "/vehicles",
    count: [true],
  },
  {
    icon: <TrendingDownOutlinedIcon sx={iconStyle} />,
    name: " Expenses",
    path: "/expenses",
    pro: true,
  },
  {
    icon: <LocationOnOutlinedIcon sx={iconStyle} />,
    name: "Yards",
    path: "/yards",
  },
  {
    icon: <NavigationOutlinedIcon sx={iconStyle} />,
    name: "Live Map",
    path: "/map",
    pro: true,
  },
  {
    icon: <ContentPasteSearchOutlinedIcon sx={iconStyle} />,
    name: "Maintenance",
    path: "/maintenance",
    expert: true,
  },

];

export const othersItems: NavItem[] = [
  {
    icon: <FeedbackOutlinedIcon sx={iconStyle} />,
    name: "Feedback",
    path: "/feedback",
  },
  {
    icon: <WysiwygOutlinedIcon sx={iconStyle} />,
    name: "System Logs",
    path: "/system-logs",
  },
  {
    icon: <PeopleAltOutlinedIcon sx={iconStyle} />,
    name: "System Users",
    path: "/system-users",
  },
];
export const accountItems: NavItem[] = [
  {
    icon: <SupportAgentOutlinedIcon sx={iconStyle} />,
    name: "Support",
    path: "/support",
  },
  {
    icon: <AccountCircleOutlinedIcon sx={iconStyle} />,
    name: "User Profile",
    path: "/profile",
  },
  {
    icon: <EmojiTransportationOutlinedIcon sx={iconStyle} />,
    name: "Company",
    subItems: [
      { name: "Company Profile", path: "/company-profile", pro: false },
      {
        name: "Subscriptions",
        path: "/company-profile/subscription",
      },
    ],
  },
  {
    icon: <ManageAccountsOutlinedIcon sx={iconStyle} />,
    name: "Account Settings",
    path: "/profile/account-settings",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { profile } = useUser();
  const { bookings } = useAdminBooking();
  const { vehicles } = useAdminFleet();

  const hydratedNavItems = useMemo(() => {
    return navItems.map((nav) => {
      // Create a copy so we don't mutate the original exported constant
      const updatedNav = { ...nav };

      // 1. Inject count for Vehicles
      if (updatedNav.path === "/vehicles") {
        updatedNav.count = [true, vehicles.length];
      }

      // 2. Inject count for nested Bookings
      if (updatedNav.subItems) {
        updatedNav.subItems = updatedNav.subItems.map((sub) => {
          const updatedSub = { ...sub };
          if (updatedSub.path === "/bookings") {
            updatedSub.count = [true, bookings.length];
          }
          return updatedSub;
        });
      }

      return updatedNav;
    });
  }, [vehicles.length, bookings.length]); // Re-run only when counts change

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others" | "account",
  ) => (
    <ul className="flex flex-col gap-3">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto h-5 w-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                      ? "text-brand-500 rotate-180"
                      : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}

                {nav.pro && (
                  <span
                    className={`ml-auto ${isActive("/")
                        ? "menu-dropdown-badge-active"
                        : "menu-dropdown-badge-inactive"
                      } menu-dropdown-badge`}
                  >
                    pro
                  </span>
                )}
                {nav.expert && (
                  <span
                    className={`ml-auto ${isActive("/")
                        ? "menu-dropdown-badge-success"
                        : "menu-dropdown-badge-success-inactive"
                      } menu-dropdown-badge text-green-500!`}
                  >
                    expert
                  </span>
                )}
                {nav.count?.[0] && (
                  <span
                    className={`ml-auto ${isActive("/")
                        ? "menu-dropdown-badge-active"
                        : "menu-dropdown-badge-inactive"
                      } menu-dropdown-badge`}
                  >
                    {nav.count?.[1] || 0}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 ml-9 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="ml-auto flex items-center gap-1">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}

                {nav.expert && (
                  <span
                    className={`ml-auto ${isActive("/")
                        ? "menu-dropdown-badge-success"
                        : "menu-dropdown-badge-success-inactive"
                      } menu-dropdown-badge text-green-500!`}
                  >
                    expert
                  </span>
                )}
                        {subItem.count?.[0] && (
                          <span
                            className={`ml-auto ${isActive("/bookings")
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            {subItem.count?.[1] || 0}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others" | "account";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others", "account"].forEach((menuType) => {
      const items =
        menuType === "main"
          ? hydratedNavItems
          : menuType === "others"
            ? othersItems
            : accountItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others" | "account",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: "main" | "others" | "account",
  ) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const isSidebarVisible = isExpanded || isHovered || isMobileOpen;
  const tenant = profile?.fleetmaster_tenants;

  const daysLeft = getRemainingDays(tenant?.expiry_date);
  const expiryString = getExpiryString(tenant?.expiry_date);

  const isExpired = tenant?.subscription_status === "Expired" || daysLeft <= 0;
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 14; // <= 14 days (2 weeks)

  // ✅ FIX: Only show expiry widget if the plan is actually Expired or Expiring Soon AND sidebar is visible
  const shouldShowExpiryWidget =
    isSidebarVisible && (isExpired || isExpiringSoon);

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${isExpanded || isMobileOpen ? "w-72.5" : isHovered ? "w-72.5" : "w-22.5"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-8 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              {profile?.fleetmaster_tenants?.subscription_plan === "Expert" ? (
                <>
                  <Image
                    width={154}
                    height={32}
                    sizes="154px"
                    priority
                    className="dark:hidden"
                    src="/images/logo/logo_expert.svg"
                    alt=""
                  />
                  <Image
                    width={154}
                    height={32}
                    sizes="154px"
                    priority
                    className="hidden dark:block"
                    src="/images/logo/logo_expert_dark.svg"
                    alt=""
                  />
                </>
              ) : profile?.fleetmaster_tenants?.subscription_plan === "Pro" ? (
                <>
                  <Image
                    width={154}
                    height={32}
                    sizes="154px"
                    priority
                    className="dark:hidden"
                    src="/images/logo/logo_pro.svg"
                    alt=""
                  />
                  <Image
                    width={154}
                    height={32}
                    sizes="154px"
                    priority
                    className="hidden dark:block"
                    src="/images/logo/logo_pro_dark.svg"
                    alt=""
                  />
                </>
              ) : (
                <>
                  <Image
                    width={154}
                    height={32}
                    sizes="154px"
                    priority
                    className="dark:hidden"
                    src="/images/logo/logo.svg"
                    alt=""
                  />
                  <Image
                    width={154}
                    height={32}
                    sizes="154px"
                    priority
                    className="hidden dark:block"
                    src="/images/logo/logo-dark.svg"
                    alt=""
                  />
                </>
              )}
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt=""
              width={32}
              height={32}
              sizes="32px"
              priority
            />
          )}
        </Link>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs leading-5 text-gray-400 uppercase ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(hydratedNavItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 flex text-xs leading-5 text-gray-400 uppercase ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Settings"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>

            <div className="">
              <h2
                className={`mb-4 flex text-xs leading-5 text-gray-400 uppercase ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Account"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(accountItems, "account")}
            </div>
          </div>
        </nav>

        {/* Expiry Widget: Shows if Expired, Expiring in <14 days, OR Sidebar is opened/hovered */}
        {shouldShowExpiryWidget && (
          <SidebarExpiryWidget
            plan={tenant?.subscription_plan}
            expiry={expiryString}
          />
        )}

        {/* Standard Widget */}
        {isSidebarVisible && <SidebarWidget plan={tenant?.subscription_plan} />}
      </div>
    </aside>
  );
};

export default AppSidebar;
