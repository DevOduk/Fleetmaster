import CallToAction from "@/components/marketing-components/CallToAction";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "About Us | FleetMaster - Fleet Management Solution",
  description:
    "Learn about FleetMaster, the intelligent fleet management platform designed to streamline vehicle rentals, real-time diagnostics, and user verification from a unified workspace.",
};

export default function AboutPage() {
  const pages = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  return (
    <div className="m-auto min-h-screen w-full">
      {/* Hero Header Block */}
      <SecondaryHero
        pages={pages}
        title="About"
        highlightedText="FleetMaster"
        className="dark:bg-zinc-950"
        description="Discover how we're revolutionizing fleet management across Africa with intelligent technology and customer-focused solutions."
      />

      {/* Info Split Section */}
      <div className="container m-auto mt-8 mb-8 grid grid-cols-1 items-center gap-6 p-4 lg:grid-cols-12">
        <div className="lg:col-span-6 relative aspect-video">
          <Image
            className="aspect-video w-full rounded-xl object-cover shadow-sm"
            alt="FleetMaster Platform"
            preload
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            src="/images/product/BMW-MY26-X6-cosy-1-extended.jpg"
          />
        </div>

        <div className="lg:col-span-6">
          <h3 className="text-sm font-semibold tracking-wider text-amber-600">
            OUR MISSION
          </h3>
          <h2 className="mt-2 mb-3 text-3xl font-bold text-zinc-900 dark:text-white">
            Empowering Fleet Operators with Intelligent Technology
          </h2>
          <p className="max-w-175 text-sm leading-relaxed text-zinc-600 dark:text-gray-400">
            FleetMaster is the ultimate fleet management dashboard built with modern technology and designed for Africa. We streamline vehicle rentals, track real-time diagnostics, and verify user credentials from a single, beautifully unified workspace. Our platform is built by Africa for Africa, bringing world-class fleet management solutions to operators across the continent.
          </p>

          <div className="mt-5 flex items-center gap-4 pt-2">
            <Link
              href="/request-demo"
              className="group flex cursor-pointer items-center gap-1 rounded-xl bg-amber-600 px-5 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-amber-700"
            >
              Request Demo
              <KeyboardArrowRightIcon
                className="text-sm transition-transform group-hover:tranzinc-x-0.5"
                fontSize="small"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-zinc-200 bg-white dark:border-zinc-800/60 dark:bg-zinc-900/40">
        <div className="container m-auto p-4 py-16">
          <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-white mb-12">
            Why Choose FleetMaster
          </h2>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-zinc-50 p-6 dark:bg-zinc-800/50">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Real-Time Tracking
              </h3>
              <p className="text-sm text-zinc-600 dark:text-gray-400">
                Monitor your entire fleet in real-time with advanced GPS tracking and diagnostics.
              </p>
            </div>

            <div className="rounded-lg bg-zinc-50 p-6 dark:bg-zinc-800/50">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                User Verification
              </h3>
              <p className="text-sm text-zinc-600 dark:text-gray-400">
                Verify driver credentials and manage access with our comprehensive verification system.
              </p>
            </div>

            <div className="rounded-lg bg-zinc-50 p-6 dark:bg-zinc-800/50">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Easy Integration
              </h3>
              <p className="text-sm text-zinc-600 dark:text-gray-400">
                Seamlessly integrate with your existing systems and workflows.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <CallToAction />
      </div>
    </div>
  );
}
