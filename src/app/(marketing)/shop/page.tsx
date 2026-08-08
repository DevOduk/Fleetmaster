import CallToAction from "@/components/marketing-components/CallToAction";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import { Metadata } from "next";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BluetoothDriveOutlinedIcon from "@mui/icons-material/BluetoothDriveOutlined"
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop | FleetMaster - Fleet Hardware & GPS Trackers",
  description: "Equip your fleet with commercial-grade vehicle hardware. Purchase pre-configured wired GPS trackers, magnetic asset trackers, and advanced fuel telemetry sensors fully integrated with your FleetMaster dashboard.",
};

export default function ShopPage() {
  const pages = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Header Block */}
      <SecondaryHero
        pages={pages}
        title="Hardware & Operational"
        highlightedText="Equipment"
        description="Get commercial-grade, pre-configured trackers and telemetry sensors built to link directly with your FleetMaster dashboard right out of the box."
      />


      <div className="grid items-center container m-auto grid-cols-1 lg:grid-cols-12 gap-6 p-4 mt-5 mb-5">

        {/* 3. Swapped col-7 for col-span-7 */}
        <div className="lg:col-span-6">
          <img className='rounded-xl w-full' alt='What Next ...' src={'/images/user/How-Does-GPS-Tracking-Work-on-Cars.webp'} />
        </div>

        {/* 2. Swapped col-5 for col-span-5 */}
        <div className="lg:col-span-6">
          <h3 className="text-amber-500">SHOP EQUIPMENT</h3>
          <h2 className="text-3xl mt-4 mb-3 font-bold text-black dark:text-white">Stay Safe & Secure w/ our variety of Hardware tools.</h2>
          {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-175">
            Protect your automotive assets and access deep telemetry insight. All equipment includes complimentary pre-configuration protocols to map to your system subdomains instantly.          </p>


          <div className="flex mt-5 items-center gap-4 pt-2">
            <Link target='_blank' href={'http://app.localhost:3000/register'} className="group px-5 py-3 bg-green-800 text-white text-sm font-medium rounded-xl flex items-center gap-1 hover:bg-green-900 transition-all shadow-md cursor-pointer">
              Get Started Now
              <KeyboardArrowRightIcon className="text-sm transition-transform group-hover:translate-x-0.5" fontSize="small" />
            </Link>
          </div>
        </div>

      </div>

      {/* Section Sub-Header Title */}
      <section className="container mx-auto px-4 py-12 text-center max-w-3xl">
        <span className="text-amber-500 text-sm font-semibold tracking-wider uppercase">
          Hardware Ecosystem
        </span>
        <h2 className="text-3xl mt-4 mb-3 font-bold text-black dark:text-white">
          Secured, Hardwired & Plug-and-Play Solutions
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Protect your automotive assets and access deep telemetry insight. All equipment includes complimentary pre-configuration protocols to map to your system subdomains instantly.
        </p>
      </section>

      {/* Main Grid Content Area */}
      <main className="container mx-auto px-4 pb-24 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">

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
                "Hardwired 9-36V configuration directly to asset"
              ],
              description: "Our standard tamper-proof heavy-duty hardware. Ideal for permanent deployment on standard rental fleets and logistics vehicles."
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
                "Light-sensitive anti-removal drop alert switch"
              ],
              description: "Zero wiring required. Hide this device anywhere inside high-value machinery or backup fleet rentals as a secondary backup recovery node."
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
                "Low energy power-saving standby configuration"
              ],
              description: "Perfect for rapid onboarding. Instantly extract real-time diagnostic parameters, mileage, and driver behavior analytics without running wires."
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
                "Custom cut-to-length installation scaling metrics"
              ],
              description: "Eliminate fuel fraud. Integrates alongside your active wired tracker to map fuel levels against trip distances automatically."
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
                "Integrated proximity radar alerting via the FleetMaster dashboard"
              ],
              description: "A compact, wireless proximity locator ideal for sub-fleet asset tracking, keys, and boundary-based yard monitoring."
            }
          ].map((product) => {
            const ProductIcon = product.icon;
            return (
              <div
                key={product.id}
                className="rounded-2xl overflow-hidden shadow-sm shadow-blue-500/10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full transition-all hover:shadow-md group"
              >
                {/* Product Image Box */}
                <div className="relative bg-slate-100 dark:bg-slate-800 aspect-4/3 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium text-xs dark:text-slate-500 bg-zinc-200/40 dark:bg-zinc-800/40">
                    {/* Fallback layout before content images load */}
                    <span>{product.title} Visual Asset</span>
                  </div>
                  {/* Dynamic absolute badge overlays */}
                  <span className="absolute top-3 right-3 z-10 flex gap-2">
                    <span className="bg-brand-500 text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm">{product.badge}</span>
                    <span className="bg-green-500 text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm">{'10% Off'}</span>

                  </span>
                  <img
                    src={product.imgSrc}
                    alt={product.title}
                    className="absolute bg-gray-200 inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  // onError={(e) => {
                  //   // Hides image marker elements cleanly if file asset does not exist yet
                  //   e.currentTarget.style.display = 'none';
                  // }}
                  />
                </div>

                {/* Card Main Body Content Elements */}
                <div className="p-5 grow flex flex-col justify-between">
                  <div>
                    {/* Category Header metadata badge elements */}
                    <div className="flex gap-1.5 font-bold items-center text-amber-500 mb-2">
                      <ProductIcon className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">{product.category}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mb-4 leading-relaxed">
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
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto flex items-center justify-between">
                    <div>
                      {/* <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">Price</span> */}
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs font-semibold text-slate-400">Ksh &nbsp;</span>
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white"> {product.price}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-sm transition-all active:scale-95"
                    >
                      <ShoppingCartOutlinedIcon className="w-4 h-4" />
                      Order Hardware
                    </button>
                  </div>
                </div>

              </div>
            );
          })}

        </div>

        {/* Informative Shipping Notice Banner Footnote */}
        <div className="mt-12 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between text-center md:text-left">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Need Installation Assistance across Kenya?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              We provide free delivery to your premises within Nairobi. For vehicle tracking hardware variants, our technicians can perform discrete onsite wire installation at your convenience.
            </p>
          </div>
          <a
            href="/contact"
            className="shrink-0 text-xs font-bold text-brand-500 border border-brand-500/30 hover:border-brand-500 px-4 py-2 rounded-xl transition-all"
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