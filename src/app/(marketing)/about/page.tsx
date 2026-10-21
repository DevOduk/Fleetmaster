import CallToAction from "@/components/marketing-components/CallToAction";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | FleetMaster - Fleet Management Solution",
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
      <div className="mt-8 mb-8 grid w-full grid-cols-1 items-center gap-6 p-4 md:container md:mx-auto lg:grid-cols-12">
        <div className="relative aspect-video lg:col-span-6">
          <Image
            className="aspect-video w-full rounded-xl object-cover shadow-sm"
            alt="FleetMaster Platform"
            preload
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            src="/images/product/BMW-MY26-X6-cosy-1-extended.jpg"
          />
        </div>

        <div className="lg:col-span-6">
          <h3 className="text-sm font-semibold tracking-wider text-amber-600">
            ABOUT US
          </h3>
          <h2 className="mt-2 mb-3 text-3xl font-bold text-zinc-900 dark:text-gray-300">
            Empowering Fleet Operators with Intelligent Technology
          </h2>
          <p className="max-w-175 text-sm leading-relaxed text-zinc-600 dark:text-gray-400">
            FleetMaster is the ultimate fleet management dashboard built with
            modern technology and designed for Africa. We streamline vehicle
            rentals, track real-time diagnostics, and verify user credentials
            from a single, beautifully unified workspace. Our platform is built
            by Africa for Africa, bringing world-class fleet management
            solutions to operators across the continent.
          </p>

          <div className="mt-5 flex items-center gap-4 pt-2">
            <Link
              href="/request-demo"
              className="group bg-brand-600 flex cursor-pointer items-center gap-1 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-amber-700"
            >
              Request Demo
              <KeyboardArrowRightIcon
                className="group-hover:tranzinc-x-0.5 text-sm transition-transform"
                fontSize="small"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Mission, Vision & Aim */}
      <div className="border-t border-zinc-200 bg-linear-to-b from-zinc-50 to-white dark:border-zinc-800/70 dark:from-zinc-950 dark:to-zinc-900/90">
        <div className="w-full p-4 py-16 md:container md:mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold tracking-[0.2em] text-amber-600 uppercase">
              Our Purpose
            </p>
            <h2 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white">
              Mission, Vision & Aim
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              We are building a smarter, safer, and more connected future for
              fleet operations across Africa by combining innovation, trust, and
              operational clarity in one powerful platform.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                M
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Mission
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                To simplify fleet operations by delivering intelligent,
                reliable, and accessible tools that help businesses manage
                vehicles, drivers, and rentals with confidence.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 mb-4 flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold">
                V
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Vision
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                To become Africa&apos;s leading fleet management platform,
                empowering organizations to operate smarter, safer, and more
                sustainably through data-driven innovation.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                A
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Aim
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                To create one seamless workspace where operators can monitor
                vehicles, verify users, reduce downtime, and scale their
                business with greater efficiency, transparency, and control.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:container md:mx-auto">
        <div className="relative aspect-video w-full pointer-events-none">
          <Image
            className="aspect-video w-full rounded-xl object-cover shadow-sm"
            alt="FleetMaster Platform"
            preload
            fill
            // sizes="(max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            src="/images/product/3.webp"
          />
        </div>

        <p className="text-center text-brand-500 text-lg mt-4 font-semibold">A One Stop hub for all you Rental Fleet Mangement Needs!</p>
      </div>
      {/* Features Section */}
      <div className="border-t border-zinc-200 bg-white dark:border-zinc-800/60 dark:bg-zinc-900/40">
        <div className="w-full p-4 py-16 md:container md:mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold text-zinc-900 dark:text-white">
            Why Choose FleetMaster
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-zinc-50 p-6 dark:bg-zinc-800/50">
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                Free Custom Domain
              </h3>
              <p className="line-clamp-2 text-sm text-zinc-600 dark:text-gray-400">
                Get a first and quick custom domain and subdomain tailored for
                your organization.
              </p>
            </div>

            <div className="rounded-lg bg-zinc-50 p-6 dark:bg-zinc-800/50">
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                Super Fast Onboarding
              </h3>
              <p className="line-clamp-2 text-sm text-zinc-600 dark:text-gray-400">
                Monitor your entire fleet in real-time with advanced GPS
                tracking and diagnostics.
              </p>
            </div>

            <div className="rounded-lg bg-zinc-50 p-6 dark:bg-zinc-800/50">
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                AI Verification
              </h3>
              <p className="line-clamp-2 text-sm text-zinc-600 dark:text-gray-400">
                Verify driver credentials and manage access with our
                comprehensive verification system.
              </p>
            </div>

            <div className="rounded-lg bg-zinc-50 p-6 dark:bg-zinc-800/50">
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                Online Booking
              </h3>
              <p className="line-clamp-2 text-sm text-zinc-600 dark:text-gray-400">
                Seamlessly let clients/admins book online which integrates with your existing systems and workflows.
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
