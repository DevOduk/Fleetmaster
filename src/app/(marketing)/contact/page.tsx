import CallToAction from "@/components/marketing-components/CallToAction";
import { Metadata } from "next";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import ContactForm from "@/components/marketing-components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | FleetMaster - Get in Touch with Our Team",
  description:
    "Have questions about FleetMaster? Reach out to our support, sales, or technical teams. We're here to help you optimize your fleet management operations.",
};

export default function Page() {
  const pages = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ];

  return (
    <div className="m-auto min-h-screen w-full">
      {/* Hero Section */}
      <SecondaryHero
        pages={pages}
        title="Get in touch with"
        highlightedText="Our Team"
        className="dark:bg-zinc-950"
        description="Have questions about features, setup, or scaling your enterprise operations? Drop us a message and our fleet experts will handle the rest."
      />
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
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-7 dark:border-slate-800 dark:bg-zinc-950">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
              {/* <ChatBubbleOutlineOutlinedIcon className="text-blue-600 w-5 h-5" />  */}
              Send us a message
            </h2>
            <ContactForm />
          </div>

          {/* Right Column: Contact Cards & Info */}
          <div className="space-y-6 lg:col-span-5">
            {/* Quick Contact Info */}
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-zinc-950">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-xl bg-blue-50 p-3 text-blue-500 dark:bg-blue-950/50">
                    <MailOutlinedIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Email Us
                    </h4>
                    <p className="text-brand-500 dark:text-brand-400 mt-0.5 text-sm">
                      support@fleetmaster.co.ke
                    </p>
                    {/* <p className="text-brand-600 dark:text-brand-400 text-sm">
                      info@fleetmaster.co.ke
                    </p> */}
                    <p className="text-brand-500 dark:text-brand-400 text-sm">
                      sales@fleetmaster.co.ke
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
                    <p className="text-brand-600 dark:text-brand-400 mt-0.5 text-sm">
                      +254 (768) 927-61793
                    </p>
                    <p className="text-xs text-slate-400">
                      Mon-Fri from 8am to 6pm EAT
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-950/50">
                    <LocationOnIcon className="h-5 w-5!" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Headquarters
                    </h4>
                    <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                      100 Logistics Blvd, Suite 400
                      <br />
                      Nairobi, NRB 00100
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Hours Card */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-sm dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-amber-400">
                <AccessTimeIcon className="h-5 w-5" />
                <h3 className="font-semibold">24/7 Enterprise Support</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                Already a FleetMaster Enterprise customer? Your dedicated
                account managers and emergency infrastructure support lines are
                available 24/7/365 via your custom dashboard portal.
              </p>
            </div>

            {/* Interactive Map Placeholder */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Our Location
            </h3>

            <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-zinc-800">
              <div className="absolute h-full w-full">
                <iframe
                  className="h-full w-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.810367892287!2d36.8198217!3d-1.2879239999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d9f83340e1%3A0xe968a48f77fd41de!2sParliament%20Road%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1781904695362!5m2!1sen!2ske"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              {/* <span className="text-sm text-slate-500 font-medium z-10">Interactive Office Map Loading...</span> */}
            </div>
          </div>
        </div>
      </main>

      {/* Dynamic CTA at the bottom */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <CallToAction />
      </div>
    </div>
  );
}
