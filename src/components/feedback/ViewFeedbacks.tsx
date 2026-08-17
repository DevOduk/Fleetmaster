"use client";
import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Rating from "@mui/material/Rating";
import { useTheme } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Avatar } from "@mui/material";
import Button from "../ui/button/Button";

// Define strict typing mapping to your SQL Schema
export interface FeedbackLog {
  id: string;
  user_id: string;
  tenant_id: string;
  user_role: string;
  rating: number;
  category: string;
  feedback_text: string;
  created_at: string;
  tenant?: {
    name: string;
    slug: string;
    about: string;
    email: string;
  };
  sender?: {
    first_name: string;
    last_name: string;
    profile_pic: string;
    email: string;
  };
}

interface ViewFeedbacksProps {
  initialFeedbacks: FeedbackLog[];
}

const ViewFeedbacks: React.FC<ViewFeedbacksProps> = ({ initialFeedbacks }) => {
  const theme = useTheme();
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  // Apply dark mode filters if leaflet tiles are integrated downstream
  useEffect(() => {
    const handleModeChange = () => {
      const tiles = document.querySelectorAll(".leaflet-tile");
      tiles.forEach((tile) => {
        const img = tile as HTMLImageElement;
        if (isDarkMode) {
          img.style.filter = "invert(0.93) hue-rotate(180deg) saturate(0.9)";
        } else {
          img.style.filter = "none";
        }
      });
    };

    const observer = new MutationObserver(handleModeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    handleModeChange();
    return () => observer.disconnect();
  }, [isDarkMode]);

  // Filter logic for quick sorting on the dashboard queue
  const filteredFeedbacks = initialFeedbacks.filter((item) => {
    if (filterCategory === "all") return true;
    return item.category?.toLowerCase() === filterCategory.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <ComponentCard
        title={`User Feedbacks Directory (${filteredFeedbacks.length})`}
      >
        <div className="flex flex-col items-start justify-between gap-4 pb-4 sm:flex-row sm:items-center">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Review performance feedback, bug reports, and features submitted by
            application operators.
          </p>

          {/* Dashboard Quick Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-theme-sm rounded-lg border border-gray-200 bg-white p-2 text-gray-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
          >
            <option value="all">All Categories</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Performance">Performance</option>
            <option value="Bug Report">Bug Reports</option>
            <option value="Feature Request">Feature Requests</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="custom-scrollbar max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-white/2">
                <TableRow>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Submitter & Workspace
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Category
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Score Evaluation
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Feedback Details
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Date Logged
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredFeedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No matching user feedback logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFeedbacks.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/1"
                    >
                      {/* Submitter Info */}
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={item.sender?.profile_pic}
                            alt={item.sender?.first_name}
                          />
                          <div className="flex w-full flex-col">
                            <span className="text-theme-sm max-w-55 truncate font-medium text-gray-800 dark:text-white/90">
                              {item.sender?.first_name} {item.sender?.last_name}
                            </span>
                            <span className="text-theme-xs mt-1 text-nowrap text-gray-400">
                              {item.tenant?.name}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category Badge */}
                      <TableCell className="px-5 py-4 text-start text-nowrap">
                        <Badge
                          color={
                            item.category === "Bug Report"
                              ? "error"
                              : item.category === "Feature Request"
                                ? "primary"
                                : "info"
                          }
                        >
                          {item.category || "General"}
                        </Badge>
                      </TableCell>

                      {/* Rating Matrix */}
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-2">
                          <Rating
                            readOnly
                            value={item.rating || 0}
                            max={5} // Adjusted to 5-star metric standard, can set to 10 if needed
                            size="small"
                            sx={{
                              "& .MuiRating-iconEmpty": {
                                color:
                                  theme.palette.mode === "dark"
                                    ? "rgba(255,255,255,0.2)"
                                    : "#cbd5e1",
                              },
                            }}
                          />
                          <span className="text-theme-xs font-semibold text-gray-600 dark:text-gray-400">
                            ({item.rating}/5)
                          </span>
                        </div>
                      </TableCell>

                      {/* Content Description */}
                      <TableCell className="max-w-120 min-w-100 px-5 py-4 text-start">
                        <p className="text-theme-sm whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                          {item.feedback_text}
                        </p>
                        <span className="mt-2 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-nowrap text-gray-500 uppercase dark:bg-white/10 dark:text-gray-400">
                          {item.user_role?.replace("_", " ")}
                        </span>
                      </TableCell>

                      {/* Timestamp */}
                      <TableCell className="text-theme-sm px-5 py-4 text-start text-nowrap text-gray-500 dark:text-gray-400">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              undefined,
                              {
                                dateStyle: "medium",
                              },
                            )
                          : "—"}
                      </TableCell>
                      <TableCell className="text-theme-sm px-5 py-4 text-start text-nowrap text-gray-500 dark:text-gray-400">
                        <Button variant="danger" size="sm">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default ViewFeedbacks;
