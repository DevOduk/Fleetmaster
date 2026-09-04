"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";
import { Avatar } from "@mui/material";
import { User } from "@/data/globalExports";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import { useToast } from "@/context/ToastContext";

export const Clipboard = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Item Copied to Clipboard!');

      window.setTimeout(() => setCopied(false), 4000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      className="flex items-center justify-center rounded-md p-1 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? (
        <InventoryOutlinedIcon
          className="cursor-pointer text-success-500"
          sx={{ fontSize: "1rem" }}
          color="inherit"
        />
      ) : (
        <ContentCopyOutlinedIcon
          className="cursor-pointer text-brand-500"
          sx={{ fontSize: "1rem" }}
        />
      )}
    </button>
  );
};

export default function TopUsers({
  clients,
}: {
  clients: User[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/3 min-h-85">
      <div className="mb-4 flex gap-2 justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Top Users
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link href={"/system-users/clients"}>
            <button className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200">
              See all
            </button>
          </Link>
        </div>
      </div>
      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-w-170">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-y border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Profile Details
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Joined
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {
                clients.length > 0 ? (
                  clients?.slice(0, 3).map((client, index) => {
                    const isActive =
                      !!client.last_seen &&
                      Date.now() - new Date(client.last_seen).getTime() <
                      7 * 24 * 60 * 60 * 1000;

                    return (
                      <TableRow key={client.id ?? index}>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={client.profile_pic || "/images/user/default-avatar.png"}
                              className="h-12 w-12 rounded-full object-cover object-center"
                            />
                            <div>
                              <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                                {client.first_name} {client.last_name}
                              </p>
                              <span className="text-theme-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                {client.email} <Clipboard text={client.email} />
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                          {client.role}
                        </TableCell>
                        <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            {client.phone || "N/A"} <Clipboard text={client.phone} />
                          </div>
                        </TableCell>
                        <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                          {new Date(client.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={isActive ? "success" : "warning"}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="flex h-80 items-center justify-center rounded-lg border text-center text-sm text-red-500 dark:border-gray-600">
                        You don't have any users yet! Share your website to get more users
                      </div>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
