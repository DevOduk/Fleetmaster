import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";

export default function CallToAction() {
  return (
    <div className="pb-7">
      <div className="mx-auto mb-10 max-w-7xl border-t border-gray-500"></div>

      <div className="mx-auto mt-5 mb-10 max-w-5xl p-0 md:text-center">
        {/* Inner Card Container */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gray-100 px-6 py-12 shadow-xs sm:p-16 dark:border-zinc-800/80 dark:bg-zinc-950/60">
          {/* Minimalist Background Light Flare */}
          <div className="bg-brand-500/10 dark:bg-brand-500/5 pointer-events-none absolute -bottom-24 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full blur-[60px]" />

          <div className="relative z-10 mx-auto max-w-2xl space-y-4">
            {/* Main Hook */}
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              Ready to Optimize Your Fleet Operations?
            </h2>

            {/* Value Prop Subtext */}
            <p className="mx-auto max-w-md text-gray-500 dark:text-gray-400">
              Claim your free domain today and deploy a premium, security-first
              booking engine in under five minutes.
            </p>

            {/* Action Row */}
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Link
                href={"/contact"}
                className="w-full cursor-pointer text-center rounded-lg border border-gray-200 bg-white px-6 py-2 text-sm font-semibold shadow-xs transition-all hover:bg-gray-100 sm:w-auto dark:border-zinc-700/80 dark:bg-zinc-800/40 dark:text-gray-50 dark:hover:bg-zinc-800"
              >
                Talk to an expert
              </Link>

              <Link
                target="_blank"
                href={"http://app.localhost:3000/register"}
                className="group bg-brand-500 dark:bg-brand-500 dark:text-brand-50 hover:bg-brand-900 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-medium text-white shadow-md transition-all sm:w-auto"
              >
                Start for free
                <ArrowForwardIcon className="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Small Guarantee Disclaimer */}
            <p className="pt-2 text-xs text-gray-400 dark:text-zinc-500">
              No credit card required. Cancel or transfer custom domains
              anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
