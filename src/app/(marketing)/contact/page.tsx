import CallToAction from "@/components/marketing-components/CallToAction";
import { Metadata } from "next";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined"
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined"
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import ContactForm from "@/components/marketing-components/ContactForm";



export const metadata: Metadata = {
  title: "Contact | FleetMaster - Get in Touch with Our Team",
  description: "Have questions about FleetMaster? Reach out to our support, sales, or technical teams. We're here to help you optimize your fleet management operations.",
};

export default function Page() {
  const pages = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Contact',
      href: '/contact',
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <SecondaryHero
        pages={pages}
        title="Get in touch with"
        highlightedText="Our Team"
        description="Have questions about features, setup, or scaling your enterprise operations? Drop us a message and our fleet experts will handle the rest."
      />
      <section className="container mx-auto px-4 py-12 text-center max-w-3xl">
        <span className="text-amber-500 text-sm font-semibold tracking-wider uppercase">
          Contact Us
        </span>
        <h2 className="text-3xl mt-4 mb-3 font-bold text-black text-center dark:text-white">
          We’re here to help keep your fleet moving
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-175 m-auto mb-5">
          Have questions about features, pricing, or enterprise custom solutions? Drop us a message, and our fleet experts will get right back to you.
        </p>
      </section>

      {/* Main Content: Form & Info Grid */}
      <main className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">

          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              {/* <ChatBubbleOutlineOutlinedIcon className="text-blue-600 w-5 h-5" />  */}
              Send us a message
            </h2>
            <ContactForm />
          </div>

          {/* Right Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">

            {/* Quick Contact Info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl flex items-center justify-center">
                    <MailOutlinedIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Email Us</h4>
                    <p className="text-sm text-brand-600 dark:text-brand-400 mt-0.5">support@fleetmaster.co.ke</p>
                    <p className="text-sm text-brand-600 dark:text-brand-400">info@fleetmaster.co.ke</p>
                    <p className="text-sm text-brand-600 dark:text-brand-400">sales@fleetmaster.co.ke</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <LocalPhoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Call Us</h4>
                    <p className="text-sm text-brand-600 dark:text-brand-400 mt-0.5">+254 (768) 927-61793</p>
                    <p className="text-slate-400 text-xs">Mon-Fri from 8am to 6pm EAT</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-violet-50 dark:bg-violet-950/50 text-violet-600 rounded-xl flex items-center justify-center">
                    <LocationOnIcon className="w-5! h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Headquarters</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                      100 Logistics Blvd, Suite 400<br />
                      Nairobi, NRB 00100
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Hours Card */}
            <div className="bg-slate-900 dark:bg-zinc-900 text-slate-100 rounded-2xl p-6 shadow-sm border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <AccessTimeIcon className="w-5 h-5" />
                <h3 className="font-semibold">24/7 Enterprise Support</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Already a FleetMaster Enterprise customer? Your dedicated account managers and emergency infrastructure support lines are available 24/7/365 via your custom dashboard portal.
              </p>
            </div>

            {/* Interactive Map Placeholder */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Location</h3>

            <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <div className="absolute w-full h-full">
                <iframe className="w-full h-full" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.810367892287!2d36.8198217!3d-1.2879239999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d9f83340e1%3A0xe968a48f77fd41de!2sParliament%20Road%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1781904695362!5m2!1sen!2ske" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
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