import React, { useEffect } from 'react'

import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useMemo, useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useUser } from '@/context/UserContext';
import { getAllMaintenanceLogs } from '@/app/actions/maintenance';
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined"
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined"
import Link from 'next/link';



interface MaintenanceLog {
  id: number;
  created_at: string;
  vehicle_id: number;
  date?: string | null;
  title?: string | null;
  description?: string | null;
  mileage?: number | null;
  next_service_date?: string | null;
  next_service_mileage?: number | null;
  recurring?: boolean | null;
  is_future?: boolean | null;
  vehicle?: {
    id?: number;
    name?: string;
    make?: string;
    model?: string;
    year?: number;
    license_plate?: string;
    image_url?: string;
  } | null;
}

const toCalendarDateString = (value?: Date | string | null) => {
  if (!value) return "";

  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const raw = String(value).trim();
  if (!raw) return "";

  const dateOnlyMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateOnlyMatch) return dateOnlyMatch[1];

  const candidate = raw.split(/[T\s]/)[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(candidate)) return candidate;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeDateInput = (value?: string | null) => toCalendarDateString(value);

const toLocalDateInput = (value?: Date | string | null) => toCalendarDateString(value);

const formatDate = (value?: string | null) => {
  const normalized = normalizeDateInput(value);
  if (!normalized) return value ? String(value) : "-";

  const [year, month, day] = normalized.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toDateString();
};

const formatMileage = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return `${Number(value).toLocaleString()} km`;
};

const getVehicleLabel = (vehicle: any) => {
  if (!vehicle) return "Vehicle";
  return `${vehicle.year || ""} ${vehicle.make || ""} ${vehicle.model || ""}`.trim() || vehicle.license_plate || "Vehicle";
};

const getDateOnly = (value?: string | null) => {
  const normalized = normalizeDateInput(value);
  return normalized || null;
};

const getLocalDate = (value?: string | null) => {
  const normalized = normalizeDateInput(value);
  if (!normalized) return null;

  const [year, month, day] = normalized.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const parseDescription = (value?: string | null) => {
  if (!value) return "";
  return value
    .split(/\r?\n/)
    .filter((line) => !/^Next service date:/i.test(line.trim()))
    .filter((line) => !/^Next service mileage:/i.test(line.trim()))
    .filter((line) => !/^Recurring schedule:/i.test(line.trim()))
    .filter((line) => !/^Log type:/i.test(line.trim()))
    .join("\n")
    .trim();
};

const normalizeMaintenanceLog = (entry: any): MaintenanceLog => {
  const description = entry?.description ?? "";
  const nextServiceDateMatch = description.match(/Next service date:\s*([^\n]+)/i);
  const nextServiceMileageMatch = description.match(/Next service mileage:\s*([^\n]+)/i);
  const recurringMatch = description.match(/Recurring schedule:\s*(Yes|No)/i);
  const typeMatch = description.match(/Log type:\s*(Future|History)/i);

  const mileageValue = entry?.mileage ?? null;
  const rawNextServiceDate =
    entry?.next_service_date ?? entry?.nextServiceDate ?? nextServiceDateMatch?.[1]?.trim() ?? null;
  const rawNextServiceMileage =
    entry?.next_service_mileage ?? entry?.nextServiceMileage ??
    (nextServiceMileageMatch ? Number(nextServiceMileageMatch[1].replace(/[^0-9.]/g, "")) : null);
  const rawRecurring = entry?.recurring ?? entry?.is_recurring ?? entry?.isRecurring ??
    (recurringMatch ? recurringMatch[1] : null);

  const rawIsFuture = entry?.is_future ?? entry?.isFuture ??
    (typeMatch ? typeMatch[1].toLowerCase() === "future" : (entry?.date ? new Date(entry.date) > new Date() : false));

  return {
    ...entry,
    mileage: mileageValue,
    description: parseDescription(description),
    next_service_date: normalizeDateInput(rawNextServiceDate),
    next_service_mileage: rawNextServiceMileage === "" || rawNextServiceMileage == null
      ? null
      : Number(rawNextServiceMileage),
    recurring: rawRecurring === true || rawRecurring === 1 ||
      (typeof rawRecurring === "string" && /^(true|yes|1)$/i.test(rawRecurring)),
    is_future: Boolean(rawIsFuture),
    vehicle: entry?.vehicle ?? null,
  };
};

function UpcomingMaintenance() {
  const [open, setIsOpen] = useState(false);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useUser();
  const plan = profile?.fleetmaster_tenants?.subscription_plan || '...';


  const loadMaintenanceLogs = async () => {
    setLoading(true);
    const logs = await getAllMaintenanceLogs();
    setMaintenanceLogs(logs.map((log) => normalizeMaintenanceLog(log)));
    setLoading(false);
  };

  useEffect(() => {
    void loadMaintenanceLogs();
  }, []);

  const recurringEvents = useMemo(() => {
    const entries: Array<{
      id: string;
      title: string;
      start: string;
      allDay: boolean;
      extendedProps: {
        kind: string;
        mileage?: number | null;
        nextServiceDate?: string | null;
        description?: string | null;
        license_plate: string | null;
        image_url: string | null;
        is_future: boolean;
      };
    }> = [];

    maintenanceLogs.forEach((log) => {
      if (log.recurring !== true) return;

      const baseDateStr = log.date;

      if (!baseDateStr) return;

      const baseDate = getLocalDate(baseDateStr);
      const currentMonth = new Date().getMonth();

      for (let index = currentMonth; index < 11; index += 1) {
        const nextMonthDate = new Date(baseDate);
        nextMonthDate.setMonth(index + 1);

        const repeatDate = getDateOnly(
          `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, "0")}-${String(nextMonthDate.getDate()).padStart(2, "0")}`
        );
        if (!repeatDate) continue;

        entries.push({
          id: `repeat-${log.id}-${index}`,
          title: `${getVehicleLabel(log.vehicle)} • Scheduled`,
          start: repeatDate,
          allDay: true,
          extendedProps: {
            kind: "recurring",
            mileage: log.mileage ? log.mileage + (index * 5000) : null,
            license_plate: log.vehicle?.license_plate ?? null,
            image_url: log.vehicle?.image_url ?? null,
            nextServiceDate: repeatDate,
            description: log.description,
            is_future: true,
          },
        });
      }
    });

    return entries;
  }, [maintenanceLogs]);

  const calendarEvents = useMemo(() => {
    const baseEvents = maintenanceLogs.map((log) => {
      return {
        id: String(log.id),
        title: `${getVehicleLabel(log.vehicle)}`,
        start: normalizeDateInput(log.date) || toLocalDateInput(new Date()),
        allDay: true,
        extendedProps: {
          kind: log.is_future ? "future" : "history",
          mileage: log.mileage,
          nextServiceDate: log.next_service_date,
          nextServiceMileage: log.next_service_mileage,
          description: log.description,
          license_plate: log.vehicle?.license_plate ?? null,
          image_url: log.vehicle?.image_url ?? null,
          is_future: log.is_future,
        },
      };
    });

    return [...baseEvents, ...recurringEvents];
  }, [maintenanceLogs, recurringEvents]);



  const toggleDropdown = () => {
    setIsOpen(!open);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const upcomingMaintenanceEvents: any[] = useMemo(() => {
    const today = toCalendarDateString(new Date());

    const nextEventDate = calendarEvents
      .map((event) => normalizeDateInput(event.start))
      .filter((date): date is string => Boolean(date) && date > today)
      .sort()[0];

    return nextEventDate
      ? calendarEvents.filter(
        (event) => normalizeDateInput(event.start) === nextEventDate,
      )
      : [];
  }, [calendarEvents]);

  void upcomingMaintenanceEvents;


  return (
    <div className="px-3.5 mb-7 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="flex justify-between w-full px-3">
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
            isOpen={open}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              tag="a"
              href="/maintenance"
              onItemClick={closeDropdown}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              tag="button"
              onItemClick={() => {
                closeDropdown();
                void loadMaintenanceLogs();
              }}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Reload
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="mt-4">
        {
          plan !== 'Expert' ? (
            <div className='border border-error-600 rounded-xl '>
              <div className="text-theme-sm text-error-500 whitespace-pre-wrap max-w-[80%] h-68 mx-auto flex items-center justify-center flex-col text-center gap-3">
                <EventBusyOutlinedIcon fontSize='large' className="text-3xl mr-2" />
                Service and Maintenance tracking is not available in this plan ({plan}). Upgrade to Expert to access detailed maintenance scheduling, history and reports.
              </div>
            </div>
          ) :
            loading ? (
              <div className="flex flex-col min-h-68 space-y-4 p-2 px-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/3 p-1">
                    <div className="flex gap-3 flex-col md:flex-row h-full relative shrink-0 items-start md:items-center">
                      <div className="shrink-0 w-full aspect-square rounded-lg bg-gray-300 animate-pulse dark:bg-gray-700 md:w-30" />
                      <div className="w-full p-1 space-y-2">
                        <div className="h-4 w-28 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
                        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
                        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
                        <div className="h-4 w-full animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingMaintenanceEvents.length > 0 ? (
              <ul className="space-y-4 min-h-65">
                {upcomingMaintenanceEvents.slice(0, 2).map((event) => (
                  <li key={event.id} className="rounded-2xl border cursor-pointer border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/3 p-1">
                    <Link href={`/maintenance?event=${event.id}`}>
                      <div className="flex gap-3 flex-col md:flex-row h-full relative shrink-0 items-start md:items-center">
                        <img src={event.extendedProps.image_url} alt={''} className="shrink-0 object-cover object-center rounded-lg w-full aspect-square md:w-30" />
                        <div className='p-1 relative'>
                          <div className="text-gray-700 text-sm dark:text-brand-400 flex items-center gap-1">
                            <div className="shrink-0">
                              <EventAvailableOutlinedIcon fontSize='small' />
                            </div>
                            {formatDate(event.start)}
                          </div>
                          <h4 className="font-semibold mt-2 text-sm text-gray-800 dark:text-white/90">
                            {event.title} {event.extendedProps.license_plate ? ` (${event.extendedProps.license_plate})` : "V-001"}
                          </h4>

                          <strong className='text-theme-sm text-gray-500 dark:text-gray-400'>Notes:</strong> <br />
                          <p className="text-theme-xs text-gray-500 dark:text-gray-400 text-wrap">
                            {event.extendedProps.description.replaceAll(/\n/g, ", ")}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-theme-sm text-gray-500 whitespace-pre-wrap dark:text-gray-400 h-32 flex items-center justify-center text-center">
                No upcoming maintenance events.
              </p>
            )}
      </div>
    </div>
  )
}

export default UpcomingMaintenance
