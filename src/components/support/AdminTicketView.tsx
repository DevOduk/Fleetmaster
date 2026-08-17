"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  getTicketDetails,
  addSupportResponse,
  updateTicket,
} from "@/app/actions/support";
import TextArea from "@/components/form/input/TextArea";
import { useAdmin } from "@/context/AdminContext";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import Alert from "@/components/ui/alert/Alert";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";

type Response = {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_admin: boolean;
};

type Ticket = {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: string;
  responses: Response[];
  admin: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
};

export default function AdminTicketView() {
  const params = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const { adminProfile, loading } = useAdmin();
  const [resolving, setResolving] = useState(false);
  const [fetching, setFetching] = useState(true);

  const rawTicketNumber = params.ticketNumber as string;
  const displayTicketNumber = `#${rawTicketNumber}`;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTicket = useCallback(async () => {
    if (rawTicketNumber) {
      const res = await getTicketDetails(displayTicketNumber);
      setTicket(res.data);
      if (res) {
        setFetching(false);
      }
    }
  }, [rawTicketNumber, displayTicketNumber]);

  const handleUpdateTicket = async () => {
    setResolving(true);
    const result = await updateTicket(ticket!.id, ticket.admin.id, "Resolved");
    if (result.success) {
      await fetchTicket();
      resetTimer();
    }
    setResolving(false);
  };

  // Function to reset the timer
  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(fetchTicket, 30 * 1000);
  }, [fetchTicket]);

  useEffect(() => {
    fetchTicket();
    resetTimer();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchTicket, resetTimer]);

  const handleReply = async () => {
    if (!reply.trim()) return;

    const result = await addSupportResponse(
      ticket!.id,
      adminProfile.id,
      adminProfile.role,
      reply,
      true,
    );

    if (result.success) {
      setReply("");
      await fetchTicket();
      resetTimer();
    }
  };

  if (!adminProfile || loading || fetching) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-800"></div>
        <div className="mx-auto max-w-4xl animate-pulse space-y-8 px-4 py-10">
          {/* Header Skeleton */}
          <div className="space-y-3 border-b pb-6">
            <div className="h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-1/4 rounded bg-gray-100 dark:bg-gray-800" />
          </div>

          {/* Description Box Skeleton */}
          <div className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800" />

          {/* Conversation Thread Skeletons */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-16 w-80 rounded-xl bg-gray-100 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="mx-auto flex min-h-[85vh] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center">
        {/* Icon Wrapper */}
        <div className="mb-6 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
          <ReportGmailerrorredOutlinedIcon
            style={{ fontSize: 48 }}
            className="text-red-400 dark:text-red-500"
          />
        </div>

        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          Ticket Unavailable
        </h2>
        <p className="mb-8 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          We couldn't locate the ticket you're looking for. It may have been
          archived, deleted, or you might not have the necessary permissions to
          view it.
        </p>

        <Button
          size="sm"
          variant="primary"
          onClick={() => (window.location.href = "/view-support")}
        >
          Return to Support Desk
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Ticket {ticket.ticket_number}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Support conversation thread
        </p>

        <div className="mt-5">
          <Badge size="md" color="success">
            STATUS: {ticket?.status}
          </Badge>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-900">
        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {ticket.subject}
        </p>
        <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-400">
          {ticket.description}
        </p>
      </div>

      {/* Conversation */}
      <div className="space-y-4">
        {ticket.responses?.map((msg) => {
          const isAdmin = msg.is_admin;

          return (
            <div
              key={msg.id}
              className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
            >
              {/* Flex-col wrapper maintains alignment for both bubble and date */}
              <div
                className={`flex flex-col ${isAdmin ? "items-end" : "items-start"} max-w-[75%]`}
              >
                {/* Bubble container */}
                <div
                  className={`min-w-45 rounded-xl px-4 py-3 text-sm shadow-sm ${
                    isAdmin
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  }`}
                >
                  <p className="mb-1 text-xs font-semibold opacity-80">
                    {msg.sender_id === adminProfile.id
                      ? "Support Team"
                      : "Client"}
                  </p>

                  <p className="leading-relaxed">{msg.message}</p>
                </div>

                {/* Date displayed outside the bubble */}
                <p className="mt-1 px-1 text-[10px] text-gray-500 dark:text-gray-400">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {ticket.status !== "Resolved" && (
        <div className="mt-4 flex items-center justify-start">
          <Button
            variant="success-outline"
            onClick={() => handleUpdateTicket()}
            disabled={resolving}
          >
            Mark as Resolved
          </Button>
          {resolving && (
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              Updating...
            </span>
          )}
        </div>
      )}
      {/* Reply */}
      {ticket.status !== "Resolved" && (
        <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <TextArea
            rows={4}
            value={reply}
            onChange={setReply}
            hint="Type your response here..."
            className="w-full border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />

          <div className="flex justify-end">
            <button
              onClick={handleReply}
              className="bg-brand-500 hover:bg-brand-600 rounded-lg px-6 py-2 font-medium text-white transition"
            >
              Send Response
            </button>
          </div>
        </div>
      )}

      {/* message to show ticket has been resolved  */}
      {ticket.status === "Resolved" && (
        <Alert
          variant="success"
          title="Ticket Resolved!"
          message="This ticket has been resolved. If you have any further questions, feel free to open a new ticket. Thank you for your patience and for choosing us!"
        />
      )}
    </div>
  );
}
