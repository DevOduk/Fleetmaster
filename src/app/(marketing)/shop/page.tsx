import CallToAction from "@/components/marketing-components/CallToAction";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import { Metadata } from "next";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Link from "next/link";
import Image from "next/image";
import ShopProducts from "./ShopProducts";

export const metadata: Metadata = {
  title: "Shop | FleetMaster - Fleet Hardware & GPS Trackers",
  description:
    "Equip your fleet with commercial-grade vehicle hardware. Purchase pre-configured wired GPS trackers, magnetic asset trackers, and advanced fuel telemetry sensors fully integrated with your FleetMaster dashboard.",
};

export default function ShopPage() {
  const pages = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
  ];

  return (
    <div className="m-auto min-h-screen w-full">
      {/* Hero Header Block */}
      <SecondaryHero
        pages={pages}
        title="Hardware & Operational"
        highlightedText="Equipment"
        className="dark:bg-zinc-950"
        description="Get commercial-grade, pre-configured trackers and telemetry sensors built to link directly with your FleetMaster dashboard right out of the box."
      />

      <div className="container m-auto mt-5 mb-5 grid grid-cols-1 items-center gap-6 p-4 lg:grid-cols-12">
        {/* 3. Swapped col-7 for col-span-7 */}
        <div className="lg:col-span-6 aspect-video relative">
          <Image
            className="w-full rounded-xl"
            alt="What Next ..."
            preload
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            src={"/images/user/How-Does-GPS-Tracking-Work-on-Cars.webp"}
          />
        </div>

        {/* 2. Swapped col-5 for col-span-5 */}
        <div className="lg:col-span-6">
          <h3 className="text-amber-500">SHOP EQUIPMENT</h3>
          <h2 className="mt-4 mb-3 text-3xl font-bold text-black dark:text-white">
            Stay Safe & Secure w/ our variety of Hardware tools.
          </h2>
          {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
          <p className="max-w-175 text-sm text-gray-500 dark:text-gray-400">
            Protect your automotive assets and access deep telemetry insight.
            All equipment includes complimentary pre-configuration protocols to
            map to your system subdomains instantly.{" "}
          </p>

          <div className="mt-5 flex items-center gap-4 pt-2">
            <Link
              target="_blank"
              href={"http://app.localhost:3000/register"}
              className="group flex cursor-pointer items-center gap-1 rounded-xl bg-green-800 px-5 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-green-900"
            >
              Get Started Now
              <KeyboardArrowRightIcon
                className="text-sm transition-transform group-hover:translate-x-0.5"
                fontSize="small"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Section Sub-Header Title */}
      <section className="container mx-auto max-w-3xl px-4 py-12 text-center">
        <span className="text-sm font-semibold tracking-wider text-amber-500 uppercase">
          Hardware Ecosystem
        </span>
        <h2 className="mt-4 mb-3 text-3xl font-bold text-black dark:text-white">
          Secured, Hardwired & Plug-and-Play Solutions
        </h2>
        <p className="mx-auto max-w-xl text-sm text-gray-500 dark:text-gray-400">
          Protect your automotive assets and access deep telemetry insight. All
          equipment includes complimentary pre-configuration protocols to map to
          your system subdomains instantly.
        </p>
      </section>

      {/* Main Grid Content Area */}
      <main className="container mx-auto max-w-6xl px-4 pb-24">
        <ShopProducts />

        {/* Informative Shipping Notice Banner Footnote */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-center md:flex-row md:text-left dark:border-slate-800 dark:bg-zinc-900">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Need Installation Assistance across Kenya?
            </h4>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              We provide free delivery to your premises within Nairobi. For
              vehicle tracking hardware variants, our technicians can perform
              discrete onsite wire installation at your convenience.
            </p>
          </div>
          <a
            href="/contact"
            className="text-brand-500 border-brand-500/30 hover:border-brand-500 shrink-0 rounded-xl border px-4 py-2 text-xs font-bold transition-all"
          >
            Request Installation Guide
          </a>
        </div>
      </main>

      {/* Dynamic CTA at the bottom */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <CallToAction />
      </div>
    </div>
  );
}
