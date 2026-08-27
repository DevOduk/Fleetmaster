import CallToAction from "@/components/marketing-components/CallToAction";
import ClientRentalTerms from "@/components/marketing-components/ClientRentalTerms";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Rental Terms & Vehicle Usage Conditions | FleetMaster - Fleet Management Solution",
  description:
    "Review the mandatory legal framework, active telemetry tracking consents, speed boundaries, and physical asset liability covenants required for renting or operating fleet vehicles.",
};

export default function ClientTermsPage() {
  const pages = [
    { label: "Home", href: "/" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
  ];

  return (
    <div className="m-auto min-h-screen w-full">
      {/* Hero Header Block */}
      <SecondaryHero
        pages={pages}
        title="Rental Terms &"
        highlightedText="Usage Conditions"
        className="dark:bg-zinc-950"
        description="Please read these client terms carefully before taking physical possession or keys of any managed fleet vehicle."
      />

      {/* Info Split Section */}
      <div className="container m-auto mt-8 mb-8 grid grid-cols-1 items-center gap-6 p-4 lg:grid-cols-12">
        <div className="lg:col-span-6 relative aspect-video">
          <Image
            className="aspect-video w-full rounded-xl object-cover shadow-sm"
            alt="Driver Liability Framework"
            preload
            fill
                sizes="(max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            src="/images/user/why-you-should-provide-terms-and-conditions-for-your-website.webp"
          />
        </div>

        <div className="lg:col-span-6">
          <h3 className="text-sm font-semibold tracking-wider text-emerald-600">
            DRIVER ACCOUNTABILITY
          </h3>
          <h2 className="mt-2 mb-3 text-3xl font-bold text-slate-900 dark:text-white">
            An Airtight Custody & Real-Time Tracking Agreement.
          </h2>
          <p className="max-w-175 text-sm leading-relaxed text-slate-600 dark:text-gray-400">
            By leasing or operating a vehicle managed within our infrastructure
            ecosystem across Kenya, you assume complete civil, financial, and
            criminal accountability. This document establishes legal custody,
            tracking compliance protocols, speed limitations, and insurance
            deductible frameworks.
          </p>

          <div className="mt-5 flex items-center gap-4 pt-2">
            <Link
              href="/terms-conditions/tenants"
              className="group flex cursor-pointer items-center gap-1 rounded-xl bg-green-800 px-5 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-green-900"
            >
              Review Tenants Clauses
              <KeyboardArrowRightIcon
                className="text-sm transition-transform group-hover:translate-x-0.5"
                fontSize="small"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Terms System */}
      <div
        id="terms-root"
        className="border-t border-slate-200 bg-white dark:border-slate-800/60 dark:bg-zinc-950/40"
      >
        <ClientRentalTerms />
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <CallToAction />
      </div>
    </div>
  );
}
