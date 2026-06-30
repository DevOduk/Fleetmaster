"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTicketDetails, addSupportResponse } from "@/app/actions/support";
import TextArea from "@/components/form/input/TextArea";

export default function ManageTicketPage() {
    const params = useParams();
    const [ticket, setTicket] = useState<any>(null);
    const [reply, setReply] = useState("");

    const rawTicketNumber = params.ticketNumber as string;

    const displayTicketNumber = `#${rawTicketNumber}`;

    useEffect(() => {
        if (rawTicketNumber) {
            getTicketDetails(displayTicketNumber)
            .then(res => {
                setTicket(res.data);
            });
        }
    }, [rawTicketNumber]);

    const handleReply = async () => {
        if (!reply.trim()) return;
        const result = await addSupportResponse(ticket.id, reply, true);

        console.log(result)
        if (result.success) {
            setReply("");
            // Re-fetch ticket to show new reply
            getTicketDetails(displayTicketNumber as string).then(res => setTicket(res.data));
        }
    };

    if (!ticket) return <div>Loading conversation...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Ticket: {ticket.ticket_number}</h1>
            <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="font-semibold">{ticket.subject}</p>
                <p className="text-sm text-gray-600">{ticket.description}</p>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-4">
                {ticket.responses?.map((msg: any) => (
                    <div key={msg.id} className={`p-3 rounded-lg ${msg.is_admin ? 'bg-blue-100 ml-10' : 'bg-gray-100 mr-10'}`}>
                        <p className="text-xs font-bold">{msg.is_admin ? "Support Team" : "Client"}</p>
                        <p>{msg.response_text}</p>
                    </div>
                ))}
            </div>

            {/* Reply Form */}
            <div className="mt-6">
                <TextArea rows={4} value={reply} onChange={setReply} hint="Type your response here..." />
                <button onClick={handleReply} className="mt-2 bg-brand-500 text-white px-6 py-2 rounded-lg">
                    Send Response
                </button>
            </div>
        </div>
    );
}