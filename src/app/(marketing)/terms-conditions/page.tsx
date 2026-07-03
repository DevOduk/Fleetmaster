import CallToAction from "@/components/marketing-components/CallToAction";
import ClientRentalTerms from "@/components/marketing-components/ClientRentalTerms";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rental Terms & Vehicle Usage Conditions - FleetMaster",
  description: "Review the mandatory legal framework, active telemetry tracking consents, speed boundaries, and physical asset liability covenants required for renting or operating fleet vehicles.",
};

export default function ClientTermsPage() {
  const pages = [
    { label: "Home", href: "/" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Header Block */}
      <SecondaryHero
        pages={pages}
        title="Rental Terms &"
        highlightedText="Usage Conditions"
        description="Please read these client terms carefully before taking physical possession or keys of any managed fleet vehicle."
      />

      {/* Info Split Section */}
      <div className="grid items-center container m-auto grid-cols-1 lg:grid-cols-12 gap-6 p-4 mt-8 mb-8">
        <div className="lg:col-span-6">
          <img 
            className='rounded-xl w-full object-cover shadow-sm aspect-video' 
            alt='Driver Liability Framework' 
            src='/images/user/why-you-should-provide-terms-and-conditions-for-your-website.webp' 
          />
        </div>

        <div className="lg:col-span-6">
          <h3 className="text-emerald-600 font-semibold tracking-wider text-sm">DRIVER ACCOUNTABILITY</h3>
          <h2 className="text-3xl mt-2 mb-3 font-bold text-slate-900 dark:text-white">An Airtight Custody & Real-Time Tracking Agreement.</h2>
          <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed max-w-175">
            By leasing or operating a vehicle managed within our infrastructure ecosystem across Kenya, you assume complete civil, financial, and criminal accountability. This document establishes legal custody, tracking compliance protocols, speed limitations, and insurance deductible frameworks.
          </p>

          <div className="flex mt-5 items-center gap-4 pt-2">
            <Link
              href="/terms-conditions/tenants"
              className="group px-5 py-3 bg-green-800 text-white text-sm font-medium rounded-xl flex items-center gap-1 hover:bg-green-900 transition-all shadow-md cursor-pointer"
            >
              Review Tenants Clauses
              <KeyboardArrowRightIcon className="text-sm transition-transform group-hover:translate-x-0.5" fontSize="small" />
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Terms System */}
      <div id="terms-root" className="border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
        <ClientRentalTerms />
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <CallToAction />
      </div>
    </div>
  );
}