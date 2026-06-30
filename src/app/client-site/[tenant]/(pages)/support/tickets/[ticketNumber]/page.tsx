"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTicketDetails, addSupportResponse } from "@/app/actions/support";
import TextArea from "@/components/form/input/TextArea";
import { useAdmin } from "@/context/AdminContext";
import { useUser } from "@/context/UserContext";

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
  responses: Response[];
};

export default function ManageTicketPage() {
  const params = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const { profile, loading } = useUser();



  const rawTicketNumber = params.ticketNumber as string;
  const displayTicketNumber = `#${rawTicketNumber}`;

  useEffect(() => {
    if (rawTicketNumber) {
      getTicketDetails(displayTicketNumber).then((res) => {
        setTicket(res.data);
      });
    }
  }, [rawTicketNumber]);

  const handleReply = async () => {
    if (!reply.trim()) return;

    const result = await addSupportResponse(
      ticket!.id,
      profile.id,
      profile.role,
      reply,
      false
    );

    if (result.success) {
      setReply("");
      getTicketDetails(displayTicketNumber).then((res) =>
        setTicket(res.data)
      );
    }
  };
  if (!profile || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-300">
        Just a moment...
      </div>
    );
  }
  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-300">
        There is a problem with this ticket!
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Ticket {ticket.ticket_number}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Support conversation thread
        </p>
      </div>

      {/* Ticket Details */}
      <div className="rounded-xl text-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
        <p className=" font-bold text-xl text-gray-800 dark:text-gray-200">
          {ticket.subject}
        </p>
        <p className="text-sm mt-1 text-center text-gray-600 dark:text-gray-400">
          {ticket.description}
        </p>
      </div>

      {/* Conversation */}
      <div className="space-y-4 min-h-[70vh] rounded-2xl p-3">
        {ticket.responses?.map((msg) => {
          const isAdmin = msg.is_admin;

          return (
            <div
              key={msg.id}
              className={`flex ${!isAdmin ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] min-w-45 rounded-xl px-4 py-3 shadow-sm text-sm
                  ${
                    !isAdmin
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  }`}
              >
                <p className="text-xs font-semibold mb-1 opacity-80">
                  {msg.sender_id === profile.id
                    ? ""
                    : "Support Team"}
                </p>

                <p className="leading-relaxed">{msg.message}</p>

                <p className="text-[10px] mt-2 opacity-70">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <TextArea
          rows={4}
          value={reply}
          onChange={setReply}
          hint="Type your response here..."
          className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        />

        <div className="flex justify-end">
          <button
            onClick={handleReply}
            className="px-6 py-2 rounded-lg font-medium bg-brand-500 hover:bg-brand-600 text-white transition"
          >
            Send Response
          </button>
        </div>
      </div>
    </div>
  );
}