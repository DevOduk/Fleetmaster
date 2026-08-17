"use client";

import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import Link from "next/link";
import ContactForm from "../marketing-components/ContactForm";
import { useTenant } from "@/context/TenantContext";
import { useUser } from "@/context/UserContext";

function ContactFormContainer() {
  const { tenant } = useTenant();
  const { profile } = useUser();

  return (
    <div>
      <section className="container mx-auto max-w-3xl px-4 py-12 text-center">
        <span className="text-sm font-semibold tracking-wider text-amber-500 uppercase">
          Contact Us
        </span>
        <h2 className="mt-4 mb-3 text-center text-3xl font-bold text-black dark:text-white">
          We’re here to help keep your fleet moving
        </h2>
        <p className="m-auto mb-5 max-w-175 text-center text-sm text-gray-500 dark:text-gray-400">
          Have questions about features, pricing, or enterprise custom
          solutions? Drop us a message, and our fleet experts will get right
          back to you.
        </p>
      </section>

      {/* Main Content: Form & Info Grid */}
      <main className="container mx-auto px-4 pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Column: Contact Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
              {/* <ChatBubbleOutlineOutlinedIcon className="text-blue-600 w-5 h-5" />  */}
              Send us a message
            </h2>
            <ContactForm profile={profile} />
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
