"use client";
import React, { useState, useMemo } from "react";
import ComponentCard from "../common/ComponentCard";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import Link from "next/link";
import { ArrowUpIcon } from "@/icons";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined"
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined"
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined"
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined"
import { updateTicket } from "@/app/actions/support";
import { useAdmin } from "@/context/AdminContext";

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  tenant_id: string;
  user_role: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  admin: {
    id: string | any;
    first_name: string | any;
    last_name: string | any;
  } | any;
}

interface SupportDashboardProps {
  initialTickets?: SupportTicket[];
}

const SupportTicketsDashboard: React.FC<SupportDashboardProps> = ({ initialTickets }) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
const {adminProfile} = useAdmin();
  // Calculate real-time metrics overview cards
  const metrics = useMemo(() => {
    if (!initialTickets) return;
    return {
      total: initialTickets?.length,
      open: initialTickets.filter(t => t.status === 'Open').length,
      pending: initialTickets.filter(t => t.status === 'In Progress').length,
      critical: initialTickets.filter(t => t.priority === 'critical' || t.priority === 'High').length,
      resolved: initialTickets.filter(t => t.status === 'Resolved').length,
      closed: initialTickets.filter(t => t.status === 'Closed').length,
    };
  }, [initialTickets]);

  // Combine conditional status + priority dashboard filtering matrices
  const filteredTickets = useMemo(() => {
    return initialTickets?.filter((ticket) => {
      const matchStatus = filterStatus === "all" || ticket.status?.toLowerCase() === filterStatus.toLowerCase();
      const matchPriority = filterPriority === "all" || ticket.priority?.toLowerCase() === filterPriority.toLowerCase();
      return matchStatus && matchPriority;
    });
  }, [initialTickets, filterStatus, filterPriority]);

// console.log(initialTickets, "initialTickets");

  return (
    <div className="space-y-8">

      {/* KPI Overview Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {
          [
            {
              title: "Total Tickets",
              label: 'All-time support tickets logged across the platform.',
              count: metrics.total,
              style: "bg-gray-50 border-gray-100 dark:bg-white/3 dark:border-white/5",
              icon: <ConfirmationNumberOutlinedIcon fontSize="large" className="text-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 dark:text-white/90" />
            },
            {
              title: "Open Tickets",
              label: 'New tickets awaiting initial admin review and triage.',
              count: metrics.open,
              style: "bg-blue-50/40 border-blue-100 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/10 dark:text-blue-400",
              icon: <PendingActionsOutlinedIcon fontSize="large" className="text-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 dark:text-white/90" />
            },
            {
              title: "In Progress",
              label: 'Active incidents currently undergoing investigation or reply.',
              count: metrics.pending,
              style: "bg-amber-50/40 border-amber-100 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/10 dark:text-amber-400",
              icon: <PendingOutlinedIcon fontSize="large" className="text-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 dark:text-white/90" />
            },
            {
              title: "Urgent Escalations",
              label: 'High-priority system failures requiring immediate attention.',
              count: metrics.critical,
              style: "bg-rose-50/40 border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/10 dark:text-rose-400",
              icon: <ReportGmailerrorredOutlinedIcon fontSize="large" className="text-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 dark:text-white/90" />
            }
          ].map((card, idx) => (
              <div key={idx} className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 bg-brand-500/5 md:p-6">
                <div className="flex gap-3 items-center">
                  {/* <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            <AttachMoneyOutlinedIcon className="text-gray-800 dark:text-white/90" />
                          </div> */}

                  <span className="text-xl font-bold text-gray-200 dark:text-gray-300">
                    {card.title}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <h4 className="mt-2 font-bold text-gray-800 flex gap-2 items-center text-title-sm dark:text-white/90">
                      {card.icon} {card.count.toLocaleString()}
                    </h4>
                  </div>

                  <Badge color="success">
                    <ArrowUpIcon className="text-success-500" />
                    0.0%
                  </Badge>
                </div>
                <div className="text-sm truncate mt-3 text-gray-500 dark:text-gray-400">
                  {card.label}
                </div>
              </div>
          ))}
      </div>

      {/* Main Grid View Controller */}
      <ComponentCard title="Active Incident Reports Queue">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-gray-100 dark:border-white/5 mb-4">
          <p className="text-gray-500 text-theme-sm dark:text-gray-400">
            Click &apos;Manage Conversation&apos; to view logs or respond to individual customer updates.
          </p>

          {/* Dual Control Filtering Utility Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="flex-1 md:flex-initial p-2 px-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-theme-sm text-gray-700 dark:text-gray-300 outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Support Registry Ledger Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="p-3">
            {
              [
                'All', 'Open', 'In Progress', 'Resolved', 'Closed'
              ].map((status) => (
                <Button key={status} variant={filterStatus === status.toLowerCase() ? "primary" : "outline"} size="sm" className="mr-2 mb-2 text-theme-xs px-3 min-w-35! py-1.5! rounded!" onClick={() => setFilterStatus(status.toLowerCase())}>
                  {status} Tickets (
                  {
                    status === "All" ? metrics.total :
                      status === "Open" ? metrics.open :
                        status === "In Progress" ? metrics.pending :
                          status === "Resolved" ? metrics.resolved :
                            status === "Closed" ? metrics.closed : 0})
                </Button>
              ))
            }
          </div>
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Ticket Ref & Submitter
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Core Subject
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Category
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Priority
                  </TableCell>
                  <TableCell isHeader className="px-5 text-nowrap py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Workflow Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Assigned To
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Last Action
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      No active support service tickets match your chosen criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-gray-50/50 dark:hover:bg-white/1">

                      {/* Ticket # and Tenant Identity metadata */}
                      <TableCell className="px-5 py-4 text-start text-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-brand-500 text-theme-sm">
                            {ticket.ticket_number}
                          </span>
                          <span className="text-gray-400 text-[11px] mt-0.5">
                            Tenant: {ticket.tenant_id ? `${ticket.tenant_id.slice(0, 8)}...` : "System"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Subject + Problem Detail */}
                      <TableCell className="px-5 py-4 text-start max-w-xs truncate">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800 text-theme-sm dark:text-white/90 truncate">
                            {ticket.subject}
                          </span>
                          <span className="text-gray-500 text-theme-xs truncate max-w-60 mt-1">
                            {ticket.description}
                          </span>
                        </div>
                      </TableCell>

                      {/* Domain category */}
                      <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-300">
                        {ticket.category || "General Inquiry"}
                      </TableCell>

                      {/* Priority Tag Rendering Matrix */}
                      <TableCell className="px-5 py-4 text-start">
                        <Badge color={
                          ticket.priority === 'critical' || ticket.priority === 'high' ? 'error' :
                            ticket.priority === 'medium' ? 'warning' : 'info'
                        }>
                          {ticket.priority || "Medium"}
                        </Badge>
                      </TableCell>

                      {/* Workflow Status Tracker Badge */}
                      <TableCell className="px-5 py-4 text-nowrap text-start">
                        <Badge color={
                          ticket.status === 'open' ? 'primary' :
                            ticket.status === 'in_progress' ? 'warning' : 'success'
                        } >
                          {ticket.status?.replace('_', ' ')}
                        </Badge>
                      </TableCell>

                      {/* Updated Date Tracker */}
                      <TableCell className="px-5 py-4 text-start text-nowrap text-gray-500 dark:text-gray-400 text-theme-xs">
                        {ticket.updated_at ? new Date(ticket.updated_at).toLocaleString(undefined, {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        }) : "—"}
                      </TableCell>

                      {/* Domain category */}
                      <TableCell className="px-5 text-nowrap py-4 text-start text-theme-sm text-gray-600 dark:text-gray-300">
                        {ticket.admin ? `${ticket.admin.first_name} ${ticket.admin.last_name}${ticket.admin.id === adminProfile.id ? " (You)" : ""}` : <span className="text-gray-500 italic text-sm">Unassigned</span>}
                      </TableCell>
                      {/* Action trigger passing Ticket reference parameters to details route */}
                      <TableCell className="px-5 py-4 text-start text-nowrap">
                        <Link onClick={async () => {
                          if (ticket.status !== "Resolved") {
                            await updateTicket(ticket!.id, adminProfile.id, ticket.status === "Resolved" ? ticket.status : "In Progress");
                          }
                        }} href={`/view-support/tickets/${ticket.ticket_number.replace('#', '')}`}>                          <Button variant="primary" size="sm" className="font-medium text-theme-xs px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white">
                            Open Ticket
                          </Button>
                        </Link>
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

export default SupportTicketsDashboard;