"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import TextArea from "../form/input/TextArea";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import { submitSupportRequest, fetchUserTickets } from "@/app/actions/support";
import Pagination from "../tables/Pagination";
import { Table, TableBody, TableHeader, TableRow } from "../ui/table";
import { TableCell, TableHead } from "@mui/material";
import Badge from "../ui/badge/Badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRightIcon, PlusIcon } from "@/icons";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import Link from "next/link";

const Support: React.FC = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const { profile } = useUser();
  const [tickets, setTickets] = useState<any[]>([]);
  const [issueTitle, setIssueTitle] = useState("Another issue");
  const [category, setCategory] = useState("General");
  const [messageTwo, setMessageTwo] = useState("yes. an issue again");
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const [mode, setMode] = useState("Tickets");

  useEffect(() => {
    if (profile?.id) {
      fetchUserTickets(profile.id).then((res) => {
        if (res.data) {
          setLoading(false);
        }
        if (res.success) setTickets(res.data);
      });
    }
  }, [profile?.id]);

  const handleSubmit = async () => {
    const hasOpenTicket = tickets.some((t) => t.status === "Open");

    if (hasOpenTicket) {
      showToast(
        "You already have an open support ticket. Wait for a response to creeate another!",
        "error",
      );
      setMode("Tickets");
      return;
    }

    if (!issueTitle.trim() || !messageTwo.trim() || !category.trim()) {
      showToast("Please fill in all fields.", "error");
      setMode("Tickets");
      return;
    }

    setIsSubmitting(true);
    const ticketNumber = `#STK-${new Date().getTime()}`;

    const result = await submitSupportRequest(
      {
        ticket_number: ticketNumber,
        subject: issueTitle,
        description: messageTwo,
        category: category,
      },
      {
        id: profile!.id,
        role: profile!.role || "Client",
        tenant_id: profile!.tenant_id,
      },
    );

    setIsSubmitting(false);

    if (result.success) {
      showToast(`Ticket ${ticketNumber} has been created.`, "success");
      setIssueTitle("");
      setMessageTwo("");
      const updated = await fetchUserTickets(profile!.id);
      if (updated.success) setTickets(updated.data);
      setMode("Tickets");
    } else {
      showToast(result.error || "Failed to submit.", "error");
      setMode("Tickets");
    }
  };

  const totalResults = tickets.length;
  const [currentPage, setCurrentPage] = useState<number>(urlPage);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));

  // Then use activePage for your math:
  const startIndex =
    totalResults === 0 ? 0 : (activePage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(activePage * itemsPerPage, totalResults);

  useEffect(() => {
    if (currentPage > totalPages && totalResults > 0) {
      params.delete("page");

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [totalPages, totalResults]);

  return (
    <div className="space-y-8">
      {/* 1. Ticket Form Section */}
      {mode === "New Ticket" && (
        <ComponentCard
          className="mx-auto max-w-5xl"
          title="Contact Support Request"
        >
          <p className="text-theme-sm mb-4 font-medium text-gray-800 dark:text-white/90">
            Are you experiencing any issues? Please let us know:
          </p>
          <div className="space-y-4">
            <div>
              <Label>Select Category</Label>
              <Select
                options={[
                  {
                    value: "General",
                    label: "General Support",
                  },
                  {
                    value: "Booking",
                    label: "Booking Support",
                  },
                  {
                    value: "Payment",
                    label: "Payment Support",
                  },
                  {
                    value: "Account",
                    label: "Account Support",
                  },
                  {
                    value: "Other",
                    label: "Other Support",
                  },
                ]}
                defaultValue={category}
                onChange={(e) => setCategory(e)}
              ></Select>
            </div>
            <div>
              <Label>Issue Title</Label>
              <Input
                type="text"
                placeholder="Enter issue title"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
              />
            </div>

            <div>
              <Label>Issue Description</Label>
              <TextArea
                rows={6}
                value={messageTwo}
                onChange={(value) => setMessageTwo(value)}
                hint="Please enter a detailed message."
                className="text-black! dark:text-white!"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-brand-500 text-theme-sm hover:bg-brand-600 ms-auto mt-3 flex items-center justify-center rounded-lg p-2 px-3 font-medium text-white disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Issue"}
            </button>

            {/* {statusMessage && (
            <p className={`mt-2 text-xs ${statusMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {statusMessage.text}
            </p>
          )} */}
          </div>
        </ComponentCard>
      )}

      {/* 2. Recent Tickets Section */}
      {mode === "Tickets" && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Recent Tickets
            </h2>
            <button
              onClick={() => setMode("New Ticket")}
              className="flex items-center gap-2 text-sm text-green-500 hover:underline"
            >
              <PlusIcon /> Create New Ticket
            </button>
          </div>

          <div className="custom-scrollbar mb-4 overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow className="text-sm text-slate-500">
                  <TableCell className="p-3">Ticket No.</TableCell>
                  <TableCell className="p-3">Category</TableCell>
                  <TableCell className="p-3">Subject</TableCell>
                  <TableCell className="p-3">Description</TableCell>
                  <TableCell className="p-3">Opened</TableCell>
                  <TableCell className="p-3">Status</TableCell>
                  <TableCell className="p-3">Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                {!loading ? (
                  tickets.slice(startIndex - 1, endIndex).length > 0 ? (
                    tickets.slice(startIndex - 1, endIndex).map((t) => (
                      <TableRow key={t.id} className="text-sm">
                        <TableCell className="text-brand-500 text-nowrap p-3">
                          {t.ticket_number}
                        </TableCell>
                        <TableCell className="text-brand-500 p-3">
                          <Badge color="info">{t.category}</Badge>
                        </TableCell>
                        <TableCell className="p-3 text-slate-700  min-w-50 dark:text-slate-300">
                          {t.subject}
                        </TableCell>
                        <TableCell className="max-w-120 min-w-50 truncate p-3 text-slate-700 dark:text-slate-300">
                          {t.description}
                        </TableCell>
                        <TableCell className="p-3 text-slate-500">
                          {new Date(t.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="p-3 font-medium text-green-600">
                          {t.status}
                        </TableCell>
                        <TableCell>
                          <Link
                            className="text-brand-600 flex items-center gap-2 p-2"
                            href={`/support/tickets/${t.ticket_number.replace("#", "")}`}
                          >
                            View <ArrowRightIcon />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="flex justify-center p-6 text-center text-slate-400"
                      >
                        <p className="w-full text-center">No tickets found.</p>
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="flex justify-center p-6 text-center text-gray-400"
                    >
                      <p className="w-full text-center">
                        Processing tickets. Just a moment ...
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-8 pb-3 flex-col md:flex-row gap-8">
          <span className="text-gray-800 dark:text-white text-sm">
              Showing {startIndex} to {endIndex} of {totalResults} results
            </span>
            <Pagination
              onPageChange={(page) => {
                setCurrentPage(page);
                page > 1
                  ? params.set("page", page.toString())
                  : params.delete("page");

                router.replace(`${pathname}?${params.toString()}`);
              }}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
