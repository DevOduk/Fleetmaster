"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getTicketDetails, addSupportResponse } from "@/app/actions/support";
import TextArea from "@/components/form/input/TextArea";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined"
import { useUser } from "@/context/UserContext";
import Badge from "@/components/ui/badge/Badge";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";

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
};

export default function ClientTicketView() {
    const params = useParams();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [reply, setReply] = useState("");
    const { profile, loading } = useUser();
    const [fetching, setFetching] = useState(true);
    const rawTicketNumber = params.ticketNumber as string;
    const displayTicketNumber = `#${rawTicketNumber}`;
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchTicket = useCallback(async () => {
        setFetching(true);
        if (rawTicketNumber) {
            const res = await getTicketDetails(displayTicketNumber);
            setTicket(res.data);
            if (res) {
                setFetching(false);
            }
        }
    }, [rawTicketNumber, displayTicketNumber]);

    // Function to reset the timer
    const resetTimer = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(fetchTicket, 60000); // 60 seconds
    }, [fetchTicket]);

    // 1. Initial fetch and timer setup
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
            profile.id,
            profile.role,
            reply,
            false
        );

        if (result.success) {
            setReply("");
            await fetchTicket();
            resetTimer();
        }
    };

    if (loading || !profile || fetching) {
        return (
            <div className="space-y-6">
                <div className="w-full h-40 bg-gray-100 dark:bg-gray-800"></div>
                <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-pulse">
                    {/* Description Box Skeleton */}
                    <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl" />

                    {/* Conversation Thread Skeletons */}
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                                <div className="space-y-2">
                                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
                                    <div className="h-16 w-80 bg-gray-100 dark:bg-gray-800 rounded-xl" />
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
            <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center min-h-[85vh]">
                {/* Icon Wrapper */}
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6">
                    <ReportGmailerrorredOutlinedIcon
                        style={{ fontSize: 48 }}
                        className="text-red-400 dark:text-red-500"
                    />
                </div>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Ticket Unavailable
                </h2>
                <p className="text-gray-500 text-sm dark:text-gray-400 max-w-sm mb-8">
                    We couldn't locate the ticket you're looking for. It may have been archived,
                    deleted, or you might not have the necessary permissions to view it.
                </p>

                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => window.location.href = '/support'}
                >
                    Return to Support Desk
                </Button>
            </div>
        );
    }

    const pages = [{ label: 'Home', href: '/' }, { label: 'Support', href: '/support' }, { label: `Ticket ${ticket.ticket_number}`, href: `/support/tickets/${ticket.ticket_number}` }];

    return (
        <div className="space-y-6">
            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl mb-2 font-semibold text-gray-900 dark:text-gray-100">
                        Ticket {ticket.ticket_number}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Support conversation thread
                    </p>

                    <div className="mt-5">
                        <Badge size="md" color="success">STATUS: {ticket?.status}</Badge>
                    </div>
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
                <div className="space-y-4 rounded-2xl p-3">
                    {ticket.responses?.map((msg) => {
                        const isAdmin = msg.is_admin;

                        return (
                        <div
                            key={msg.id}
                            className={`flex ${!isAdmin ? "justify-end" : "justify-start"}`}
                        >
                            {/* Added a flex-col wrapper to keep the bubble and date together */}
                            <div className={`flex flex-col ${!isAdmin ? "items-end" : "items-start"} max-w-[75%]`}>

                                {/* Bubble remains intact */}
                                <div className={`min-w-45 rounded-xl px-4 py-3 shadow-sm text-sm ${!isAdmin
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
                                </div>

                                {/* Date moved outside the bubble */}
                                <p className="text-[10px] mt-1 px-1 text-gray-500 dark:text-gray-400">
                                    {new Date(msg.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        );
                    })}
                </div>

                {/* Reply */}

                {(ticket.status === "In Progress") && (
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
                )}


                {/* message to show ticket has been resolved  */}
                {ticket.status === "Resolved" && (
                    <Alert variant="success" title="Ticket Resolved!" message="This ticket has been resolved. If you have any further questions, feel free to open a new ticket. Thank you for your patience and for choosing us!" />
                )}
            </div>
        </div>
    );
}