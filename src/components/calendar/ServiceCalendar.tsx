"use client";

import React, { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventContentArg } from "@fullcalendar/core";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { useAdminFleet } from "@/context/AdminFleetContext";
import { createMaintenanceLog, getAllMaintenanceLogs, updateMaintenanceLog } from "@/app/actions/maintenance";
import { toast, Toaster } from "sonner";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Table, TableBody } from "../ui/table";
import { formatedTimestamp } from "../company-profile/ExpiryBanner";
import { TableRow } from "@mui/material";
import { useUser } from "@/context/UserContext";
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import Radio from "../form/input/Radio";
import Badge from "../ui/badge/Badge";

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

const normalizeDateInput = (value?: string | null) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(`${value}`);
  if (Number.isNaN(date.getTime())) return value;
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
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip describeChild {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const ServiceCalendar: React.FC = () => {
  const { vehicles } = useAdminFleet();
  const { profile } = useUser();
  const { isOpen, openModal, closeModal } = useModal();
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [serviceDate, setServiceDate] = useState("");
  const [mileage, setMileage] = useState("");
  const [nextServiceDate, setNextServiceDate] = useState("");
  const [nextServiceMileage, setNextServiceMileage] = useState("");
  const [activitiesDone, setActivitiesDone] = useState("");
  const [repeatSchedule, setRepeatSchedule] = useState(false);
  const [isFutureLog, setIsFutureLog] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadMaintenanceLogs = async () => {
    const logs = await getAllMaintenanceLogs();
    setMaintenanceLogs(logs.map((log) => normalizeMaintenanceLog(log)));
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

      const baseDate = new Date(baseDateStr);
      const currentMonth = new Date().getUTCMonth() + 1; //i.e 7 for August

      for (let index = currentMonth; index < 11; index += 1) {
        baseDate.setMonth(index + 1);

        const repeatDate = getDateOnly(
          `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, "0")}-${String(baseDate.getDate()).padStart(2, "0")}`
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
        start: log.date ?? new Date().toISOString().split("T")[0],
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

  const openCreateModal = () => {
    const today = new Date().toISOString().split("T")[0];
    setServiceDate(today);
    setMileage("");
    setNextServiceDate("");
    setNextServiceMileage("");
    setActivitiesDone("");
    setRepeatSchedule(false);
    setIsFutureLog(false);
    setSelectedLogId(null);
    openModal();
    setSelectedVehicleId(null);
  };

  const handleSubmit = async () => {
    if (!selectedVehicleId || !serviceDate || !mileage) {
      toast.error("Please select a vehicle, service date and service mileage.");
      return;
    }

    setSaving(true);

    const vehicle = vehicles.find((entry) => entry.id === selectedVehicleId);

    const resultPayload = {
      tenant_id: profile?.tenant_id,
      vehicle_id: selectedVehicleId,
      date: serviceDate,
      title: `${getVehicleLabel(vehicle)} service`,
      description: activitiesDone.trim(),
      mileage: Number(mileage),
      next_service_date: isFutureLog ? null : (nextServiceDate || null),
      next_service_mileage: isFutureLog ? null : (nextServiceMileage ? Number(nextServiceMileage) : null),
      recurring: isFutureLog ? repeatSchedule : false,
      is_future: isFutureLog,
    };

    let result: { error?: any; success?: boolean; };

    if (!selectedLogId) {
      result = await createMaintenanceLog(resultPayload, {
        id: profile?.id,
        role: profile?.role
      });
    } else {
      result = await updateMaintenanceLog({
        id: selectedLogId,
        ...resultPayload,
      }, {
        id: profile?.id,
        role: profile?.role
      });
    }

    setSaving(false);

    if (!result.success) {
      toast.error(result.error?.message || "Unable to save the maintenance log.");
      return;
    }

    toast.success("Maintenance log details saved.");
    closeModal();

    setServiceDate(new Date().toISOString().split("T")[0]);
    setMileage("");
    setNextServiceDate("");
    setNextServiceMileage("");
    setActivitiesDone("");
    setRepeatSchedule(false);
    setIsFutureLog(false);
    setSelectedVehicleId(null);
    setSelectedLogId(null);

    await loadMaintenanceLogs();
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="min-h-[60vh] custom-calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            selectable={true}
            select={(info) => {
              setServiceDate(info.startStr.slice(0, 10));
              setMileage("");
              setNextServiceDate("");
              setNextServiceMileage("");
              setActivitiesDone("");
              setRepeatSchedule(false);
              setIsFutureLog(false);
              setSelectedLogId(null);
              openModal();
            }}
            events={calendarEvents}
            eventContent={renderMaintenanceEventContent}
            eventClick={(e) => {
              const rawId = e.event.id.startsWith("repeat-")
                ? e.event.id.split("-")[1]
                : e.event.id;

              const log = maintenanceLogs.find((l) => String(l.id) === rawId);

              if (log) {
                setSelectedLogId(log.id);
                setServiceDate(log.date ? new Date(log.date).toISOString().split("T")[0] : '');
                setMileage(String(log.mileage || ""));
                setNextServiceDate(log.next_service_date || "");
                setNextServiceMileage(String(log.next_service_mileage || ""));
                setActivitiesDone(log.description || "");
                setRepeatSchedule(log.recurring || false);
                setIsFutureLog(log.is_future || false);
                setSelectedVehicleId(log.vehicle_id);
                openModal();
              }
            }}
            customButtons={{
              addEventButton: {
                text: "Add service log",
                click: () => openCreateModal(),
              },
            }}
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="overflow-x-auto">
          <Table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
            <TableBody className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600 dark:bg-gray-900 dark:text-gray-400">
              <TableRow>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Mileage</th>
                <th className="px-4 py-3">Next service date</th>
                <th className="px-4 py-3">Next service mileage</th>
                <th className="px-4 py-3">Notes</th>
              </TableRow>
            </TableBody>
            <TableBody>
              {maintenanceLogs.length === 0 && (
                <TableRow>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    No service logs yet. Add your first service entry.
                  </td>
                </TableRow>
              )}

              {maintenanceLogs.map((log) => (
                <TableRow key={log.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 align-top">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${log.is_future ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}>
                      {log.is_future ? "Future / Scheduled" : "History"}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">{formatDate(log.date)}</td>
                  <td className="px-4 py-3 align-top">{formatMileage(log.mileage)}</td>
                  <td className="px-4 py-3 align-top">
                    {log.is_future && log.recurring ? formatedTimestamp(new Date(log.date) < new Date() ? new Date(new Date(log.date).setMonth(new Date(log.date).getMonth() + 1)).toDateString() : new Date(log.date).toDateString()) : formatedTimestamp(log.next_service_date)}
                  </td>
                  <td className="px-4 py-3 align-top">{formatMileage(log.next_service_mileage)}</td>
                  <td className="max-w-md whitespace-pre-wrap px-4 py-3 align-top text-gray-600 dark:text-gray-300">
                    {parseDescription(log.description) || "-"}
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => {
        closeModal();
        setServiceDate(new Date().toISOString().split("T")[0]);
        setMileage("");
        setNextServiceDate("");
        setNextServiceMileage("");
        setActivitiesDone("");
        setRepeatSchedule(false);
        setIsFutureLog(false);
        setSelectedVehicleId(null);
        setSelectedLogId(null);
      }} className="max-w-2xl p-6 lg:p-8">
        <div className="space-y-5">
          <div>
            <h5 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {selectedLogId ? "Edit service log" : "Add service log"}
            </h5>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Record past maintenance history or schedule future upcoming services.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Log Type
              </label>
              <div className="flex gap-4 py-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <Radio
                    id="servicehistory"
                    label="Service History"
                    name="logType"
                    checked={!isFutureLog}
                    value={String(!isFutureLog)}
                    onChange={() => {
                      setIsFutureLog(false);
                      setRepeatSchedule(false);
                    }}
                    className="text-brand-500 focus:ring-brand-500"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <Radio
                    id="ScheduledMaintenance"
                    label="Scheduled Maintenance"
                    name="logType"
                    checked={isFutureLog}
                    value={String(isFutureLog)}
                    onChange={() => {
                      setIsFutureLog(true);
                      setNextServiceDate("");
                      setNextServiceMileage("");
                    }}
                    className="text-brand-500 focus:ring-brand-500"
                  />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Vehicle
              </label>
              <select
                value={selectedVehicleId ?? ""}
                onChange={(event) => setSelectedVehicleId(Number(event.target.value))}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">Select vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.license_plate}: {vehicle.year} {vehicle.make} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {isFutureLog ? "Scheduled Date" : "Service Date"}
              </label>
              <input
                type="date"
                value={serviceDate}
                onChange={(event) => setServiceDate(event.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {isFutureLog ? "Current / Estimated Mileage" : "Mileage at service"}
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={mileage}
                onChange={(event) => setMileage(event.target.value)}
                placeholder="e.g. 45600"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {!isFutureLog && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Next service date
                  </label>
                  <input
                    type="date"
                    value={nextServiceDate}
                    onChange={(event) => setNextServiceDate(event.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Next service mileage
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={nextServiceMileage}
                    onChange={(event) => setNextServiceMileage(event.target.value)}
                    placeholder="e.g. 48000"
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Notes
              </label>
              <textarea
                rows={6}
                value={activitiesDone}
                onChange={(event) => setActivitiesDone(event.target.value)}
                placeholder="Oil change, brake inspection, tyre rotation, fluid top-up..."
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                style={{ resize: "vertical", whiteSpace: "pre-wrap" }}
              />
            </div>

            {isFutureLog && (
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Checkbox
                    checked={repeatSchedule}
                    onChange={(event) => setRepeatSchedule(event)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  Repeat service monthly
                </label>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  When enabled, this upcoming schedule will automatically repeat monthly on the calendar.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                closeModal();
                setServiceDate(new Date().toISOString().split("T")[0]);
                setMileage("");
                setNextServiceDate("");
                setNextServiceMileage("");
                setActivitiesDone("");
                setRepeatSchedule(false);
                setIsFutureLog(false);
                setSelectedVehicleId(null);
                setSelectedLogId(null);
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || !selectedVehicleId || !serviceDate || !mileage}
              className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save service log"}
            </button>
          </div>
        </div>
      </Modal>

      <Toaster richColors position="top-right" />
    </>
  );
};

const renderMaintenanceEventContent = (eventInfo: EventContentArg) => {
  const title = eventInfo.event.title;
  const mileage = eventInfo.event.extendedProps.mileage;
  const next = eventInfo.event.extendedProps.nextServiceDate;
  const description = eventInfo.event.extendedProps.description;
  const isFuture = eventInfo.event.extendedProps.is_future;
  const isRecurring = eventInfo.event.id.startsWith("repeat-");

  const badgeColor = isFuture ? "bg-blue-500" : "bg-green-500";

  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <div className="min-w-0 py-1">
            <div className="w-full relative aspect-video mb-1">
              {isRecurring && <div className="absolute right-1 top-1 text-sm"><Badge size="sm" variant="solid" color="primary">Every Month</Badge></div>}
              <img className="w-full rounded bg-white h-full object-cover object-center" src={eventInfo.event.extendedProps.image_url ?? '/images/default-yard.png'} />
            </div>
            <div className="text-xs font-semibold">{title}</div>
            <div className="text-[10px] text-gray-600">
              {eventInfo.event.extendedProps.license_plate} - {" "}
              {mileage ? `${Number(mileage).toLocaleString()} km` : "Service"}
              {!isFuture && next ? ` • Next: ${new Date(`${next}T00:00:00`).toLocaleDateString()}` : ""}
              {isFuture ? " • Scheduled" : " • History"}
            </div>
            <div className="pt-1 whitespace-pre-wrap">
              <strong>Notes / Activities:<br /></strong>
              {parseDescription(description) || "-"}
            </div>
          </div>
        </React.Fragment>
      }
    >
      <div className="flex items-start gap-2 rounded-md bg-brand-500/15 p-2 pb-1.5 text-left text-gray-800 dark:text-white cursor-grab">
        <span className={`mt-1 h-2 w-2 flex-none rounded-full ${badgeColor}`} />
        <div className="min-w-0">
          <div className="flex relative gap-2 items-center uppercase mb-2">
            <div className="w-13 aspect-video relative">
              <img className="w-full rounded bg-white h-full object-cover object-center" src={eventInfo.event.extendedProps.image_url ?? '/images/default-yard.png'} />
            </div>
            <div className="truncate text-xs font-semibold">{eventInfo.event.extendedProps.license_plate}</div>
          </div>
          <div className="truncate text-xs font-semibold">{title}</div>
          <div className="truncate text-[10px] text-gray-600 dark:text-gray-300">
            {mileage ? `${Number(mileage).toLocaleString()} km` : "Service"}
            {!isFuture && next ? ` • Next ${new Date(`${next}T00:00:00`).toLocaleDateString()}` : ""}
            {isFuture ? " (Upcoming)" : " (Record)"}
          </div>
        </div>
      </div>
    </HtmlTooltip>
  );
};

export default ServiceCalendar;