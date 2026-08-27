import CallToAction from "@/components/marketing-components/CallToAction";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import { Metadata } from "next";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BluetoothDriveOutlinedIcon from "@mui/icons-material/BluetoothDriveOutlined";
import Link from "next/link";
import Image from "next/image";

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
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              id: "hw-01",
              title: "Pro Wired Vehicle Tracker (FMX-100)",
              category: "GPS Hardware",
              icon: GpsFixedIcon,
              imgSrc: "/images/shop/wired-tracker.webp", // Replace with your webp image asset paths
              price: "6,500",
              badge: "Best Seller",
              specs: [
                "Real-time location refreshing (5s interval)",
                "Ignition detection & remote engine kill cut-off",
                "Internal backup battery safety system (48 hours)",
                "Hardwired 9-36V configuration directly to asset",
              ],
              description:
                "Our standard tamper-proof heavy-duty hardware. Ideal for permanent deployment on standard rental fleets and logistics vehicles.",
            },
            {
              id: "hw-02",
              title: "Magnetic Asset Recovery Tracker",
              category: "Wireless GPS",
              icon: PrecisionManufacturingIcon,
              imgSrc: "/images/shop/magnetic-tracker.webp",
              price: "8,900",
              badge: "Long Battery",
              specs: [
                "Ultra-strong industrial Neodymium magnets",
                "Up to 3 years battery lifespan (1 ping daily)",
                "IP67 water & dustproof ruggedized casing",
                "Light-sensitive anti-removal drop alert switch",
              ],
              description:
                "Zero wiring required. Hide this device anywhere inside high-value machinery or backup fleet rentals as a secondary backup recovery node.",
            },
            {
              id: "hw-03",
              title: "Smart OBD-II Telematics Dongle",
              category: "Diagnostics",
              icon: DeveloperModeIcon,
              imgSrc: "/images/shop/obd-dongle.webp",
              price: "5,000",
              badge: "Plug & Play",
              specs: [
                "Instant port insertion under steering column",
                "Reads live DTC engine fault codes & check engines",
                "Monitors aggressive braking and driver speeding",
                "Low energy power-saving standby configuration",
              ],
              description:
                "Perfect for rapid onboarding. Instantly extract real-time diagnostic parameters, mileage, and driver behavior analytics without running wires.",
            },
            {
              id: "hw-04",
              title: "Advanced Digital Fuel Level Sensor",
              category: "Telemetry",
              icon: LocalGasStationIcon,
              imgSrc: "/images/shop/fuel-sensor.webp",
              price: "12,500",
              badge: "High Precision",
              specs: [
                "99.2% accurate capacitive fuel depth logging",
                "Instant fuel theft SMS/Dashboard push alerts",
                "Siphon & quick drainage detection anomalies",
                "Custom cut-to-length installation scaling metrics",
              ],
              description:
                "Eliminate fuel fraud. Integrates alongside your active wired tracker to map fuel levels against trip distances automatically.",
            },
            {
              id: "hw-05",
              title: "Mini Bluetooth Smart GPS Locator",
              category: "Wireless GPS",
              icon: BluetoothDriveOutlinedIcon, // Make sure to add: import BluetoothIcon from '@mui/icons-material/Bluetooth'; at the top
              imgSrc: "/images/shop/mini_gps_locator_bluetooth.jpg",
              price: "4,500",
              badge: "Compact & Light",
              specs: [
                "Seamless BLE 5.2 proximity pairing and diagnostic link",
                "Compact micro-form factor for ultra-discrete tracking placements",
                "Low Energy (BLE) asset mesh network optimization algorithms",
                "Integrated proximity radar alerting via the FleetMaster dashboard",
              ],
              description:
                "A compact, wireless proximity locator ideal for sub-fleet asset tracking, keys, and boundary-based yard monitoring.",
            },
          ].map((product) => {
            const ProductIcon = product.icon;
            return (
              <div
                key={product.id}
                className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-zinc-500 bg-white shadow-sm shadow-blue-500/10 transition-all hover:shadow-md dark:border-zinc-600 dark:bg-zinc-800 cursor-pointer"
              >
                {/* Product Image Box */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-200/40 text-xs font-medium text-slate-400 dark:bg-zinc-800/40 dark:text-slate-500">
                    {/* Fallback layout before content images load */}
                    <span>{product.title} Visual Asset</span>
                  </div>
                  {/* Dynamic absolute badge overlays */}
                  <span className="absolute top-3 right-3 z-10 flex gap-2">
                    <span className="bg-brand-500 rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-sm">
                      {product.badge}
                    </span>
                    <span className="rounded-md bg-green-500 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-sm">
                      {"10% Off"}
                    </span>
                  </span>
                  <Image
                    src={product.imgSrc}
                    alt={product.title}
                    className="absolute inset-0 h-full w-full bg-gray-200 object-cover transition-transform duration-300 group-hover:scale-105"
                    preload
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Card Main Body Content Elements */}
                <div className="flex grow flex-col justify-between p-4">
                  <div>
                    {/* Category Header metadata badge elements */}
                    <div className="mb-2 flex items-center gap-1.5 font-bold text-amber-500">
                      <ProductIcon className="h-4 w-4" />
                      <span className="text-xs tracking-wider uppercase">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                      {product.title}
                    </h3>
                    <p className="mb-4 text-xs leading-relaxed text-slate-500 dark:text-gray-400">
                      {product.description}
                    </p>

                    {/* Features/Bullet Specs Core Matrix Loop */}
                    {/* <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mb-5 space-y-2">
                      {product.specs.map((spec, specIdx) => (
                        <div key={specIdx} className="flex items-start gap-2">
                          <VerifiedIcon className="text-emerald-500 !w-3.5 !h-3.5 mt-0.5 shrink-0" />
                          <span className="text-xs text-slate-600 dark:text-slate-400">{spec}</span>
                        </div>
                      ))}
                    </div> */}
                  </div>

                  {/* Pricing Matrix & Checkout Action Interceptions */}
                  <div className="mt-0 flex items-center justify-between border-t border-brand-100 pt-2 dark:border-zinc-500">
                    <div>
                      {/* <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">Price</span> */}
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs font-semibold text-slate-400">
                          Ksh &nbsp;
                        </span>
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {" "}
                          {product.price}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="bg-brand-500 hover:bg-brand-600 inline-flex items-center gap-2 rounded-lg px-3 p-2 text-xs font-semibold text-white shadow-sm transition-all active:scale-95"
                    >
                      <ShoppingCartOutlinedIcon fontSize="small" />
                      Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
