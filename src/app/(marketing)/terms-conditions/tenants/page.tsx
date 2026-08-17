import CallToAction from "@/components/marketing-components/CallToAction";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import TermsConditions from "@/components/marketing-components/Terms&Conditions";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Tenant Merchant & Platform Service Agreement | FleetMaster - Fleet Management Solution",
  description:
    "Review the core cloud SaaS infrastructure rules, diagnostic hardware liability exclusions, M-PESA webhook verification policies, and terms of service governing commercial operators.",
};

export default function TenantTermsPage() {
  const pages = [
    { label: "Home", href: "/" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: "Tenant Terms", href: "/terms-conditions/tenants" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header Block */}
      <SecondaryHero
        pages={pages}
        title="Tenant Merchant &"
        highlightedText="Platform Terms"
        description="Core Service Level Agreements (SLA), hardware calibration limits, and transactional frameworks for commercial fleet management operators."
      />

      {/* Info Split Section */}
      <div className="container m-auto mt-8 mb-8 grid grid-cols-1 items-center gap-6 p-4 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <img
            className="aspect-video w-full rounded-xl object-cover shadow-sm"
            alt="Fleet B2B Governance Framework"
            src="/images/user/why-you-should-provide-terms-and-conditions-for-your-website.webp"
          />
        </div>

        <div className="lg:col-span-6">
          <h3 className="text-sm font-semibold tracking-wider text-amber-500">
            B2B MERCHANT COMPLIANCE
          </h3>
          <h2 className="mt-2 mb-3 text-3xl font-bold text-slate-900 dark:text-white">
            Securing System Integrations & Commercial Liabilities.
          </h2>
          <p className="max-w-175 text-sm leading-relaxed text-slate-600 dark:text-gray-400">
            Designed specifically for fleet rental merchants, safari operators,
            and automotive logistical agencies deploying FleetMaster software
            and sensor infrastructure across Kenya. Understand your
            configuration risks, payment verification parameters, and data
            sovereignty definitions.
            <span className="text-brand-600 uppercase">
              ensure due delligence before accepting a booking
            </span>
          </p>

          <div className="mt-5 flex items-center gap-4 pt-2">
            <Link
              href="/terms-conditions"
              className="group flex cursor-pointer items-center gap-1 rounded-xl bg-amber-600 px-5 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-amber-700"
            >
              Review Renter Clauses
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
        className="border-t border-slate-200 bg-white dark:border-slate-800/60 dark:bg-slate-900/40"
      >
        <TermsConditions />
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <CallToAction />
      </div>
    </div>
  );
}
