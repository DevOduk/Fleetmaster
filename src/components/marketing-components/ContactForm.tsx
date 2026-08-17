"use client";
import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Select from "@/components/form/Select";
import Input from "../form/input/InputField";
import { ChevronDownIcon } from "@/icons";
import TextArea from "../form/input/TextArea";
import Label from "../form/Label";

export default function ContactForm({ profile }: { profile?: any }) {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="first_name"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            First Name
          </Label>
          <Input
            value={profile?.first_name}
            onChange={() => {}}
            type="text"
            id="first_name"
            placeholder="First Name"
            className="bg-slate-50 dark:bg-slate-800"
          />
        </div>
        <div>
          <Label
            htmlFor="last_name"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Last Name
          </Label>
          <Input
            value={profile?.last_name}
            onChange={() => {}}
            type="text"
            id="last_name"
            placeholder="Last Name"
            className="bg-slate-50 dark:bg-slate-800"
          />
        </div>
      </div>

      <div>
        <Label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Work Email
        </Label>
        <Input
          value={profile?.email}
          onChange={() => {}}
          type="email"
          id="email"
          placeholder="Work Email Address"
          className="bg-slate-50 dark:bg-slate-800"
        />
      </div>

      <div>
        <Label
          htmlFor="subject"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Subject
        </Label>

        <div className="relative">
          <Select
            onChange={() => {}}
            placeholder="Select Subject"
            options={[
              { value: "General Inquiry", label: "General Inquiry" },
              {
                value: "Sales & Enterprise Pricing",
                label: "Sales & Enterprise Pricing",
              },
              { value: "Technical Support", label: "Technical Support" },
              {
                value: "Partnership Opportunities",
                label: "Partnership Opportunities",
              },
            ]}
            className="bg-slate-50 dark:bg-slate-800"
          />

          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      <div>
        <Label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          How can we help?
        </Label>
        <TextArea
          rows={4}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          placeholder="Tell us a bit about your fleet size and what you're looking for..."
        ></TextArea>
      </div>

      <button
        type="submit"
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/10 transition hover:bg-blue-700"
      >
        Submit Request
        <ArrowForwardIcon className="h-4! w-4! transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
