"use client";
import React, { useState, useMemo, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
// MUI Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FilterListIcon from "@mui/icons-material/FilterList";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { TrashBinIcon } from "@/icons";

type LogLevel = "info" | "warning" | "error" | "security";

interface LogEntry {
  id: number;
  timestamp: Date;
  level: LogLevel;
  event: string;
  details: string;
}

const SystemLogs: React.FC = () => {
  const [timeRange, setTimeRange] = useState("all");
  const dummyLogs: LogEntry[] = useMemo(() => {
    const events = [
      {
        level: "info",
        event: "GPS Ping Received",
        details: "Vehicle KCK 402J updated coordinates.",
      },
      {
        level: "warning",
        event: "Engine Overheat",
        details: "Toyota Land Cruiser (B-902) high temp alert.",
      },
      {
        level: "error",
        event: "Payment Failed",
        details: "Renter ID: 8829 - Transaction refused by bank.",
      },
      {
        level: "security",
        event: "Geofence Breach",
        details: "Vehicle KBZ 110L moved outside Nairobi perimeter.",
      },
      {
        level: "info",
        event: "Maintenance Log",
        details: "Oil change scheduled for Fleet #09.",
      },
      {
        level: "security",
        event: "New Login",
        details: "Admin login from recognized IP: 197.248.31.66.",
      },
      {
        level: "warning",
        event: "Fuel Level Low",
        details: "Vehicle KDA 552P at 12% capacity.",
      },
      {
        level: "info",
        event: "Renter Vetted",
        details: "ID verification cleared for user 'a_maina'.",
      },
    ];

    return Array.from({ length: 35 }).map((_, i) => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      return {
        id: i,
        timestamp: new Date(Date.now() - i * 1000 * 60 * 12), // 12 mins apart
        ...randomEvent,
      } as LogEntry;
    });
  }, []);

  const filteredLogs = useMemo(() => {
    if (timeRange === "all") return dummyLogs;

    const now = Date.now();
    const msMap: Record<string, number> = {
      "15m": 900000,
      "1hr": 3600000,
      "24hr": 86400000,
      "1w": 604800000,
      "1m": 2592000000,
    };

    return dummyLogs.filter(
      (log) => now - new Date(log.timestamp).getTime() <= msMap[timeRange],
    );
  }, [timeRange, dummyLogs]);

  const getLevelBadge = (level: LogLevel) => {
    const iconSize = { fontSize: 16 };
    switch (level) {
      case "error":
        return (
          <Badge color="error">
            <ErrorOutlineOutlinedIcon sx={iconSize} /> Error
          </Badge>
        );
      case "warning":
        return (
          <Badge color="warning">
            <ErrorOutlineOutlinedIcon sx={iconSize} /> Warning
          </Badge>
        );
      case "security":
        return (
          <Badge color="warning">
            <GppMaybeOutlinedIcon sx={iconSize} /> Security
          </Badge>
        );
      default:
        return (
          <Badge color="info">
            <InfoOutlinedIcon sx={iconSize} /> Info
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="System Activity Logs">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">
              Monitoring real-time events for the fleet dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <AccessTimeIcon
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                sx={{ fontSize: 18 }}
              />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="cursor-pointer appearance-none rounded-lg border border-gray-200 bg-transparent py-2 pr-8 pl-10 text-sm text-gray-700 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:text-gray-300"
              >
                <option value="all" className="dark:bg-gray-900">
                  All Time
                </option>
                <option value="15m" className="dark:bg-gray-900">
                  Last 15 minutes
                </option>
                <option value="1hr" className="dark:bg-gray-900">
                  Last hour
                </option>
                <option value="24hr" className="dark:bg-gray-900">
                  Last 24 hours
                </option>
                <option value="1w" className="dark:bg-gray-900">
                  Last week
                </option>
                <option value="1m" className="dark:bg-gray-900">
                  Last month
                </option>
              </select>
            </div>

            <button className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5">
              <FilterListIcon sx={{ fontSize: 20 }} />
            </button>
            <button className="rounded-lg border border-red-200 p-2 text-red-500 transition-colors hover:bg-red-50 dark:border-red-800/80 dark:hover:bg-white/5">
              <TrashBinIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.5]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Time
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Severity
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Event
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Details
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <div className="flex -space-x-2">
                          {new Date(order.timestamp).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {getLevelBadge(order.level)}
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-gray-500 dark:text-gray-400">
                        {order.event}
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-gray-500 dark:text-gray-400">
                        {order.details}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {/* {order.id} */}1
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {/* <div className="flex -space-x-2">
                        {new Date(order.timestamp).toLocaleString()}
                      </div> */}
                      1
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {/* {getLevelBadge(order.level)} */}1
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500 dark:text-gray-400">
                      {/* {order.event} */}1
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500 dark:text-gray-400">
                      {/* {order.details} */}1
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default SystemLogs;
