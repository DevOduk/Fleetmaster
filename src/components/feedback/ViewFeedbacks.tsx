"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Rating from "@mui/material/Rating";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined"
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
import { deleteFeedback } from "@/app/actions/feedbacks";
import { useToast } from "@/context/ToastContext";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "../tables/Pagination";

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
  is_feedback: boolean;
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

const ratingsRange = (() => {
  let values: number[] = [];

  for (let i = 5; i >= 0.5; i -= 0.5) {
    values.push(i)
  }

  return values;
})();

const ViewFeedbacks: React.FC<ViewFeedbacksProps> = ({ initialFeedbacks }) => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks || [])
  const [isOpen, setIsOpen] = useState(false);

  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");


  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  // --- 3. PAGINATION MATH MATRICS ---
  const itemsPerPage = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(initialFeedbacks.length / itemsPerPage),
  );

  // Fallback safeguard to handle bounds correctly if users apply filters that shrink the page footprint
  const activePage = Math.max(1, Math.min(urlPage, totalPages));

  const indexStart = (activePage - 1) * itemsPerPage;
  const indexEnd = indexStart + itemsPerPage;
  const paginatedFeedbacks = initialFeedbacks.slice(indexStart, indexEnd);

  const startIndex = initialFeedbacks.length === 0 ? 0 : indexStart + 1;
  const endIndex = Math.min(activePage * itemsPerPage, initialFeedbacks.length);

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      nextParams.set("page", page.toString());
    } else {
      nextParams.delete("page");
    }
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };



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
  const filteredFeedbacks = feedbacks.filter((item) => {
    if (filterCategory === null) return true;
    return item.rating === filterCategory;
  });

  const handleDelete = async (feedbackId: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this item?')
    if (!confirmDelete) {
      return;
    }

    const { success, error } = await deleteFeedback(feedbackId);
    console.log(error)

    const newFeedbacks = feedbacks.filter((f) => f.id !== feedbackId);
    if (success) {
      showToast('Feedback deleted successfully!', 'success');
      setFeedbacks(newFeedbacks);
    } else {
      showToast('Failed to delete Feedback! Try again later. Reason: ' + error.message, 'error')
    }

  }

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
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="text-theme-sm relative cursor-pointer rounded-lg border border-gray-200 bg-white p-2 px-3 text-gray-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
          >
            {
              filterCategory ? (

                <div className="flex items-center gap-2">
                  <Rating
                    readOnly
                    value={filterCategory}
                    max={5} // Adjusted to 5-star metric standard, can set to 10 if needed
                    size="small"
                    precision={.5}
                    sx={{
                      "& .MuiRating-iconEmpty": {
                        color:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.2)"
                            : "#cbd5e1",
                      },
                    }}
                  />
                  ({filterCategory} Stars)
                </div>
              ) : <div className="flex gap-2 items-center"><StarBorderPurple500OutlinedIcon fontSize="small" /> All Ratings</div>
            }

            <Dropdown
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              className="shadow-theme-lg dark:bg-gray-dark absolute top-full right-0 mt-2 flex w-65 flex-col rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800"
            >
              <ul className="flex flex-col gap-1">
                <li key={'rating'}>
                  <DropdownItem
                    key={'rating'}
                    onItemClick={() => {
                      setFilterCategory(null);
                      setIsOpen(!isOpen);
                    }}
                    tag="a"
                    href="#"
                    className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    <div className="flex items-center gap-2">
                      <Rating
                        readOnly
                        value={0}
                        max={5} // Adjusted to 5-star metric standard, can set to 10 if needed
                        size="small"
                        precision={.5}
                        sx={{
                          "& .MuiRating-iconEmpty": {
                            color:
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.2)"
                                : "#cbd5e1",
                          },
                        }}
                      />
                    </div>
                    (All Stars)
                  </DropdownItem>
                </li>
                {
                  (ratingsRange)?.map((rating) => (
                    <li key={rating}>
                      <DropdownItem
                        key={rating}
                        onItemClick={() => {
                          setFilterCategory(rating);
                          setIsOpen(!isOpen);
                        }}
                        tag="a"
                        href="#"
                        className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                      >
                        <div className="flex items-center gap-2">
                          <Rating
                            readOnly
                            value={rating}
                            max={5} // Adjusted to 5-star metric standard, can set to 10 if needed
                            size="small"
                            precision={.5}
                            sx={{
                              "& .MuiRating-iconEmpty": {
                                color:
                                  theme.palette.mode === "dark"
                                    ? "rgba(255,255,255,0.2)"
                                    : "#cbd5e1",
                              },
                            }}
                          />
                        </div>
                        ({rating} Stars)
                      </DropdownItem>
                    </li>
                  ))
                }
              </ul>
            </Dropdown>
          </div>


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
                    Type
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Title
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
                {paginatedFeedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No matching user feedback logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedFeedbacks.map((item) => (
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
                            item.is_feedback ? "success"
                              : "info"
                          }
                        >
                          {item.is_feedback ? 'User Feedback' : 'Booking Review'}
                        </Badge>
                      </TableCell>
                      {/* Category Badge */}
                      <TableCell className="text-theme-sm px-5 py-4 text-start text-nowrap text-gray-400 dark:text-gray-400">
                        {item.category || "General"}
                      </TableCell>

                      {/* Rating Matrix */}
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-2">
                          <Rating
                            readOnly
                            value={item.rating || 0}
                            max={5} // Adjusted to 5-star metric standard, can set to 10 if needed
                            size="small"
                            precision={.5}
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
                        <Button onClick={() => handleDelete(item.id)} variant="danger" size="sm">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>


          {/* Pagination Controls Visibility Rule */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-8 pb-3 dark:border-gray-800">
            <span className="text-sm text-gray-800 dark:text-white">
              Showing {startIndex} to {endIndex} of {initialFeedbacks.length}{" "}
              results
            </span>
            <Pagination
              onPageChange={handlePageChange}
              currentPage={activePage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default ViewFeedbacks;
