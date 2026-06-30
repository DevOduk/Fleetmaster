"use client";
import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Rating from '@mui/material/Rating';
import { useTheme } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
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
      <ComponentCard title={`User Feedbacks Directory (${filteredFeedbacks.length})`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
          <p className="text-gray-500 text-theme-sm dark:text-gray-400">
            Review performance feedback, bug reports, and features submitted by application operators.
          </p>

          {/* Dashboard Quick Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-theme-sm text-gray-700 dark:text-gray-300 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Performance">Performance</option>
            <option value="Bug Report">Bug Reports</option>
            <option value="Feature Request">Feature Requests</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="max-w-full overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Submitter & Workspace
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Category
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Score Evaluation
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Feedback Details
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Date Logged
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredFeedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                      No matching user feedback logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFeedbacks.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-white/1">
                      {/* Submitter Info */}
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex gap-3 items-center">
                          <Avatar src={item.sender?.profile_pic} alt={item.sender?.first_name} />
                          <div className="w-full flex flex-col">
                            <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate max-w-55">
                              {item.sender?.first_name} {item.sender?.last_name}
                            </span>
                            <span className="text-gray-400 text-nowrap text-theme-xs mt-1">
                              {item.tenant?.name}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category Badge */}
                      <TableCell className="px-5 py-4 text-start text-nowrap">
                        <Badge color={
                          item.category === 'Bug Report' ? 'error' :
                            item.category === 'Feature Request' ? 'primary' : 'info'
                        }>
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
                              '& .MuiRating-iconEmpty': {
                                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : '#cbd5e1'
                              }
                            }}
                          />
                          <span className="text-theme-xs font-semibold text-gray-600 dark:text-gray-400">
                            ({item.rating}/5)
                          </span>
                        </div>
                      </TableCell>

                      {/* Content Description */}
                      <TableCell className="px-5 py-4 text-start max-w-120 min-w-100">
                        <p className="text-gray-600 dark:text-gray-300 text-theme-sm whitespace-pre-wrap">
                          {item.feedback_text}
                        </p>
                        <span className="text-[10px] uppercase text-nowrap font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 mt-2 inline-block">
                          {item.user_role?.replace('_', ' ')}
                        </span>
                      </TableCell>

                      {/* Timestamp */}
                      <TableCell className="px-5 py-4 text-start text-nowrap text-gray-500 dark:text-gray-400 text-theme-sm">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, {
                          dateStyle: 'medium'
                        }) : "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-nowrap text-gray-500 dark:text-gray-400 text-theme-sm">
                       <Button variant="danger" size="sm">Delete</Button>
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