"use client";

import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import Link from "next/link";
import { useTenant } from "@/context/TenantContext";
import { useUser } from "@/context/UserContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Select from "@/components/form/Select";
import Input from "../form/input/InputField";
import { ChevronDownIcon } from "@/icons";
import TextArea from "../form/input/TextArea";
import Label from "../form/Label";

function ContactFormContainer() {
  const { tenant } = useTenant();
  const { profile } = useUser();

  return (
    <div>
      <section className="w-full md:container md:m-auto px-4 py-12 text-center">
        <span className="text-sm font-semibold tracking-wider text-amber-500 uppercase">
          Contact Us
        </span>
        <h2 className="mt-4 mb-3 text-center text-3xl font-bold text-black dark:text-white">
          We’re here to help
        </h2>
        <p className="m-auto mb-5 max-w-175 text-center text-sm text-gray-500 dark:text-gray-400">
          Have questions about the app, features, pricing, or enterprise custom pricing
          solutions? Drop us a message, and our team of experts will get right
          back to you.
        </p>
      </section>

      {/* Main Content: Form & Info Grid */}
      <main className="w-full px-4 pb-24 md:container md:m-auto">
        <div className="mx-auto grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Column: Contact Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
              {/* <ChatBubbleOutlineOutlinedIcon className="text-blue-600 w-5 h-5" />  */}
              Send us a message
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label
                    htmlFor="first_name"
                    className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    First Name
                  </Label>
                  <Input
                    value={profile?.first_name}
                    onChange={() => {}}
                    type="text"
                    id="first_name"
                    placeholder="First Name"
                    className="bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="last_name"
                    className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Last Name
                  </Label>
                  <Input
                    value={profile?.last_name}
                    onChange={() => {}}
                    type="text"
                    id="last_name"
                    placeholder="Last Name"
                    className="bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Work Email
                </Label>
                <Input
                  value={profile?.email}
                  onChange={() => {}}
                  type="email"
                  id="email"
                  placeholder="Work Email Address"
                  className="bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div>
                <Label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
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
                      {
                        value: "Technical Support",
                        label: "Technical Support",
                      },
                      {
                        value: "Partnership Opportunities",
                        label: "Partnership Opportunities",
                      },
                      {
                        value: "Report Issue",
                        label: "Report Issue",
                      },
                      {
                        value: "Other",
                        label: "Other",
                      },
                    ]}
                    className="bg-zinc-50 dark:bg-zinc-800"
                  />

                  <span className="-tranzinc-y-1/2 pointer-events-none absolute top-1/2 right-3 text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  How can we help?
                </Label>
                <TextArea
                  rows={4}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="Tell us a bit about your fleet size and what you're looking for..."
                ></TextArea>
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-lg shadow-blue-500/10 transition hover:bg-blue-700"
              >
                Submit Request
                <ArrowForwardIcon className="group-hover:tranzinc-x-1 h-4! w-4! transition-transform" />
              </button>
            </form>
          </div>

          {/* Right Column: Contact Cards & Info */}
          <div className="space-y-6 lg:col-span-5">
            {/* Quick Contact Info */}
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50">
                    <MailOutlinedIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Email Us
                    </h4>
                    <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                      {tenant?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50">
                    <LocalPhoneIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Call Us
                    </h4>
                    <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                      {tenant?.phone}
                    </p>
                    <p className="text-xs text-slate-400">
                      Mon-Fri from 8am to 6pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-950/50">
                    <LocationOnIcon className="h-5 w-5!" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Head Office
                    </h4>
                    <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                      {tenant?.address || tenant?.yards?.[0]?.title}
                    </p>
                    <p className="text-brand-500 mt-1 text-xs">
                      {tenant?.city}, {tenant?.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Placeholder */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Location
            </h3>

            <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800">
              <div className="absolute h-full w-full">
                <iframe
                  className="h-full w-full"
                  src={`https://maps.google.com/maps?q=${tenant?.yards?.[0]?.location[0]},${tenant?.yards?.[0]?.location[1]}&output=embed`}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <Link className="text-brand-500" href="/yards">
              View all locations?
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContactFormContainer;
