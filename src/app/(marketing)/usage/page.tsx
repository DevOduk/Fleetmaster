import CallToAction from "@/components/marketing-components/CallToAction";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import { Metadata } from "next";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// MUI Icon Imports for Use Case Features
import CarRentalOutlinedIcon from "@mui/icons-material/CarRentalOutlined";
import HttpIcon from "@mui/icons-material/Http";
import SubtitlesOutlinedIcon from "@mui/icons-material/SubtitlesOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import NoCrashOutlinedIcon from "@mui/icons-material/NoCrashOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// MUI Icon Imports for the Downward Stepper Workflow
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import LayersIcon from "@mui/icons-material/Layers";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Use Cases | FleetMaster - Fleet Management Solution",
  description:
    "Explore how fleet operators use FleetMaster to automate vehicle rentals, manage domain allocations, track telematics diagnostics, and handle secure client bookings efficiently.",
};

export default function UseCasesPage() {
  const pages = [
    { label: "Home", href: "/" },
    { label: "Use Cases", href: "/use-cases" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header Block */}
      <SecondaryHero
        pages={pages}
        title="Discover our platform"
        highlightedText="Use Cases"
        description="See how business operators use FleetMaster's built-in tool suite to eliminate scattered management software, scale assets safely, and reduce operational overhead."
      />

      <div className="container m-auto mt-5 mb-5 grid grid-cols-1 items-center gap-6 p-4 lg:grid-cols-12">
        {/* 3. Swapped col-7 for col-span-7 */}
        <div className="lg:col-span-6">
          <img
            className="w-full rounded-xl"
            alt="What Next ..."
            src={
              "/images/user/Professional_business_concept_image_showing_a_Flor-1765206733138.webp"
            }
          />
        </div>

        {/* 2. Swapped col-5 for col-span-5 */}
        <div className="lg:col-span-6">
          <h3 className="text-amber-500">WHAT PROBLEM DO WE SOLVE?</h3>
          <h2 className="mt-4 mb-3 text-3xl font-bold text-black dark:text-white">
            Get a Software that Works for You
          </h2>
          {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
          <p className="mb-4 max-w-175 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            FleetMaster is an all-in-one fleet management platform designed
            specifically for small to medium-sized car rental agencies looking
            to eliminate technical complexity and significantly lower
            operational costs. We manage the entire digital
            infrastructure—including hosting, routine updates, robust security,
            and technical maintenance—allowing operators to bypass the expensive
            overhead associated with hiring software engineering teams. In
            competitive markets like Kenya, many operators lack dedicated
            software to handle bookings or optimize client navigation, which
            often leads to underutilized assets.
          </p>
          <p className="max-w-175 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            By establishing a powerful online presence backed by built-in SEO
            optimizations, FleetMaster ensures your business remains highly
            visible to prospective clients, maximizing your vehicle utilization
            rates. Our automated system streamlines vehicle dispatch, digital
            documentation, and real-time client booking interfaces. Contact our
            technical team today to launch a professional, secure, and
            production-ready fleet portal configured for your business in just
            ten minutes.
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
          Capabilities Matrix
        </span>
        <h2 className="mt-4 mb-3 text-3xl font-bold text-black dark:text-white">
          Engineered for Modern Fleet Management
        </h2>
        <p className="mx-auto max-w-xl text-sm text-gray-500 dark:text-gray-400">
          From independent rental providers to commercial enterprise fleets,
          explore how our integrated capabilities solve complex daily logistics
          tasks out-of-the-box.
        </p>
      </section>

      {/* Main Grid Content Area */}
      <main className="container mx-auto px-4 pb-24">
        <div className="grid w-full grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Full Width Container: Essential for the alternating layout effect */}
          <div className="relative mx-auto max-w-4xl space-y-12 px-4 lg:col-span-8">
            {/* <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-12 text-center">
              Core Applications
            </h2> */}

            {/* Center Timeline Line Indicator: Centered on desktop, shifted to the left edge on mobile screens */}
            <div className="pointer-events-none absolute top-24 bottom-6 left-6.5 w-0.5 -translate-x-1/2 bg-slate-200 md:left-1/2 dark:bg-slate-800" />

            {[
              {
                imgSrc: "/images/product/3.webp",
                badgeText: "Overview",
                icon: CarRentalOutlinedIcon,
                title: "1. Centralized Dispatch & Fleet Overview",
                description:
                  "One single source of truth. Eliminate messy spreadsheets and scattered communication. Manage vehicle assignments, active rentals, invoicing, and contract history from a single, unified dashboard designed for quick decision-making.",
                imgClassName:
                  "rounded-t-2xl mb-3 aspect-4/2 w-full object-cover",
              },
              {
                imgSrc: "/images/product/2.webp",
                badgeText: "Easy Setup",
                icon: HttpIcon,
                title: "2. Free Domain & Zero-Config",
                description:
                  "We handle the infrastructure. Avoid the hidden costs of buying, configuring, and maintaining separate web domains. Launch instantly with a secure, fully-managed yourbrand.fleetmaster.com portal completely free.",
                imgClassName:
                  "rounded-t-2xl bg-gray-200 mb-3 aspect-4/2 w-full object-cover",
              },
              {
                imgSrc: "/images/product/4.webp",
                badgeText: "Live Dashboard",
                icon: SubtitlesOutlinedIcon,
                title: "3. Live Fleet Telematics",
                description:
                  "We help you setup Real-time tracking and other features. Monitor vehicle diagnostics, live locations, and battery health on a unified map. Catch mechanical issues and unauthorized route deviations instantly before they become costly repairs.",
                imgClassName:
                  "rounded-t-2xl bg-gray-200 mb-3 aspect-4/2 w-full object-cover",
              },
              {
                imgSrc: "/images/product/5.webp",
                badgeText: "AI Automation",
                icon: VerifiedUserOutlinedIcon,
                title: "4. Automated Driver Vetting",
                description:
                  "Security-first verification. Protect high-value vehicles from liability risks. The onboarding pipeline automatically scans and verifies driver's licenses and credentials before a vehicle can ever be booked.",
                imgClassName:
                  "rounded-t-2xl mb-3 aspect-4/2 w-full object-cover",
              },
              {
                imgSrc: "/images/product/6.webp",
                badgeText: "Easy Management",
                icon: NoCrashOutlinedIcon,
                title: "5. Manage Bookings in One Place",
                description:
                  "Easily view and manage all your vehicles on one place. Our live vehicle status checks lets clients know which cars are available and which are not. Preview all bookings before a booking even commence.",
                imgClassName:
                  "rounded-t-2xl mb-3 aspect-4/2 w-full object-cover",
              },
              {
                imgSrc: "/images/product/1.webp",
                badgeText: "Save Time",
                icon: CalendarMonthIcon,
                title: "6. Saves you Time & Money",
                description:
                  "Save time with our built in Calendar that helps you plan dropoffs and pickups helping you keep track of all pending bookings. All in one place!",
                imgClassName:
                  "rounded-t-2xl mb-3 aspect-4/2 w-full object-cover",
              },
            ].map((feature, index) => {
              const FeatureIcon = feature.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className="relative grid min-h-75 grid-cols-1 items-center gap-8 pl-12 md:grid-cols-2 md:gap-16 md:pl-0"
                >
                  {/* Center/Left Number Node Badge */}
                  <div className="absolute top-0 left-0 z-10 flex h-12 w-12 translate-x-0 items-center justify-center rounded-full border-4 border-slate-50 bg-slate-100 text-sm font-bold text-slate-800 shadow-sm md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 dark:border-slate-950 dark:bg-slate-900 dark:text-slate-200">
                    {index + 1}
                  </div>

                  {/* Content Card Wrapper (Image Container) */}
                  {/* md:order-first and md:order-last push the image dynamically based on item index */}
                  <div
                    className={`mb-10 flex overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md dark:bg-slate-900 ${isEven ? "md:order-first" : "md:order-last"}`}
                  >
                    <img
                      src={feature.imgSrc}
                      alt={feature.badgeText}
                      className="aspect-3/2 w-full bg-gray-200 object-cover"
                    />
                  </div>

                  {/* Text Context Content Block */}
                  {/* Optional alignment adjustment: alignment shifts to match the timeline spacing flow layout */}
                  <div
                    className={`mb-10 flex flex-col justify-center ${isEven ? "md:pl-4" : "md:pr-4"}`}
                  >
                    <div className="mt-4 flex items-center gap-2 font-bold">
                      <div className="bg-brand-500/10 dark:bg-brand-500/20 flex h-9 w-9 items-center justify-center rounded-full">
                        <FeatureIcon className="text-brand-500 h-5 w-5" />
                      </div>
                      <span className="text-brand-500 text-sm tracking-wide">
                        {feature.badgeText}
                      </span>
                    </div>
                    <h3 className="mt-3 mb-2 text-lg font-bold text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (Span 5): Downward Interactive Vertical Stepper */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                Deployment Timeline
              </h3>

              {/* Stepper Downward Container */}
              <div className="relative space-y-8 pl-6 before:absolute before:top-2 before:bottom-2 before:left-4.75 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {[
                  {
                    stepIcon: HowToRegIcon,
                    iconColorClass:
                      "bg-blue-50 dark:bg-blue-950/50 text-blue-600",
                    title: "Step 1: Account Registration",
                    description:
                      "Create your secure master administrator account in under two minutes. No payment method or onboarding parameters are required to configure your development space.",
                  },
                  {
                    stepIcon: DomainAddIcon,
                    iconColorClass:
                      "bg-purple-50 dark:bg-purple-950/50 text-purple-600",
                    title: "Step 2: Allocate Subdomain",
                    description:
                      "Choose your entry routing node name (e.g., yourname.fleetmaster.com). This provisions your isolated database cluster and customer front-end pipeline automatically.",
                  },
                  {
                    stepIcon: LayersIcon,
                    iconColorClass:
                      "bg-amber-50 dark:bg-amber-950/50 text-amber-600",
                    title: "Step 3: Select Pricing Tier",
                    description:
                      "Pick an operational volume model tailored to your fleet active size. Tiers can be scaled up or hot-swapped down fluidly at any time directly from your dashboard billing settings without breaking operations.",
                  },
                  {
                    stepIcon: RocketLaunchIcon,
                    iconColorClass:
                      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600",
                    title: "Step 4: Live Environment Deployment",
                    description:
                      "Upload your vehicle profiles, sync integrated eTIMS billing metadata parameters, hook up dispatch parameters, and start collecting bookings globally.",
                  },
                ].map((step, stepIdx) => {
                  const StepIcon = step.stepIcon;
                  return (
                    <div
                      key={stepIdx}
                      className="group relative flex items-start gap-4"
                    >
                      {/* Step Indicator Node Badge */}
                      <div
                        className={`absolute -left-0.75 z-10 flex items-center justify-center rounded-full border-4 border-white p-2 dark:border-slate-900 ${step.iconColorClass}`}
                      >
                        <StepIcon className="h-4 w-4" />
                      </div>

                      {/* Step Description Content */}
                      <div className="pl-4">
                        <h4 className="group-hover:text-brand-500 text-sm font-semibold text-slate-900 transition-colors dark:text-white">
                          {step.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick System Support Availability Notification */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 dark:bg-zinc-900">
              <h4 className="text-brand-400 mb-2 text-sm font-semibold tracking-wider uppercase">
                Need Help Provisioning?
              </h4>
              <p className="text-xs leading-relaxed text-slate-400">
                Our support engineering team offers free white-glove setup
                strategies. We can map legacy operational spreadsheets over to
                your secure isolated database configuration in real-time.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Dynamic CTA Component Footer Wrapper */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <CallToAction />
      </div>
    </div>
  );
}
