// app/page.tsx
import type { Metadata } from "next";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import HttpIcon from "@mui/icons-material/Http";
import CarRentalOutlinedIcon from "@mui/icons-material/CarRentalOutlined";
import SubtitlesOutlinedIcon from "@mui/icons-material/SubtitlesOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import NoCrashOutlinedIcon from "@mui/icons-material/NoCrashOutlined";
import TestimonialsSection from "@/components/marketing-components/Testimonials";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import CallToAction from "@/components/marketing-components/CallToAction";
import Link from "next/link";
import Image from "next/image";
import { getAllFeedbacks } from "../actions/feedbacks";
import { UsageCases } from "@/data/UseCases";

export const metadata: Metadata = {
  title: "Home | FleetMaster - Fleet Management Solution",
  description:
    "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default async function Home() {
  const feedbacks = await getAllFeedbacks();

  return (
    <div>
      <div className="hero h-max-screen relative bg-white select-none dark:bg-zinc-900">
        <div
          className="absolute top-0 right-0 h-100 w-full bg-cover bg-right opacity-40 mix-blend-multiply lg:h-[85vh] lg:bg-center lg:opacity-100 lg:mix-blend-normal"
          style={{
            backgroundImage: `url('/images/product/BMW-MY26-X6-cosy-1-extended.jpg')`,
            // 225deg pushes the visibility to the bottom-right.
            // Starting at 0% to 50% keeping it transparent ensures most of the screen stays clear for text.
            maskImage:
              "linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,2) 90%)",
            WebkitMaskImage:
              "linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,2) 90%)",
          }}
        />

        {/* HERO HERO MAIN CONTENT */}
        <main className="relative mx-auto max-w-7xl px-4 pt-16 pb-48 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Typography & Actions */}
            <div className="max-w-3xl space-y-6 lg:col-span-7">
              {/* Main Headline */}
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-20 rounded bg-green-600"></div>{" "}
                <span className="text-green-600 uppercase">
                  START earning, stop worrying
                </span>
              </div>
              <h1 className="mx-auto max-w-3xl text-4xl leading-[1.1] font-bold tracking-tight text-black sm:text-5xl lg:mx-0 xl:text-6xl dark:text-white">
                Keep your rental fleet moving the{" "}
                <span className="from-brand-500 to-brand-700 bg-linear-to-r bg-clip-text text-transparent">
                  intelligent way
                </span>
              </h1>

              <p className="text-small max-w-xl leading-relaxed font-normal text-gray-600 dark:text-gray-500">
                Streamline your vehicle rentals, track real-time diagnostics,
                and verify user credentials from a single, beautifully unified
                workspace.
                <span className="font-bold text-green-500">
                  Made by Africa for Africa!
                </span>
              </p>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  target="_blank"
                  href="/request-demo"
                  className="cursor-pointer rounded-xl border-gray-500 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:text-black dark:bg-gray-800 dark:text-gray-200 dark:hover:text-white"
                >
                  Request demo
                </Link>
                <Link
                  target="_blank"
                  href="http://app.localhost:3000/register"
                  className="group bg-brand-600 hover:bg-brand-700 flex cursor-pointer items-center gap-1 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-md transition-all"
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
        </main>

        {/* LOWER LAYER / APP MOCKUP OVERLAP Creates that cool dark-mode contrast break stretching across the bottom foldn */}
        <section className="pointer-events-none relative -top-25 m-auto mx-auto max-w-[90%] px-4 select-none sm:px-6 lg:max-w-5xl lg:px-8">
          {/* App Window Wrapper Container */}
          <div className="w-full max-w-5xl rounded-t-2xl border-x border-t border-gray-200 bg-zinc-900 p-2 shadow-2xl dark:border-gray-600">
            {/* Top Bar Window Decorations */}
            <div className="flex items-center gap-2 bg-zinc-900 px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>

            {/* Simulating Internal Dashboard Content */}
            <div className="relative w-full">
              <img
                src="/images/product/light_app.localhost.png"
                alt="Product Dashboard Mockup"
                // sizes="(max-width: 1024px) 100vw, 50vw"
                className="block w-full rounded rounded-t-xl border-0 object-cover object-top dark:hidden"
              />
              <img
                src="/images/product/dark_app.localhost.png"
                alt="Product Dashboard Mockup"
                // sizes="(max-width: 1024px) 100vw, 50vw"
                className="hidden w-full rounded rounded-t-xl border-0 object-cover object-top dark:block"
              />

              {/* Mobile View Dark/Light */}
              <div className="absolute right-[75%] bottom-0 w-[25%] translate-x-[0%] rounded-2xl border-x border-t border-gray-200 bg-zinc-900 p-1 shadow-2xl md:right-0 md:translate-x-[50%] dark:border-gray-600">
                {/* <div className="px-4 py-3 bg-zinc-900 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div> */}
                <img
                  src="/images/product/light_mobile_brave_screenshot_app.localhost.png"
                  alt="Product Dashboard Mockup"
                  // sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-coverobject-top block rounded-xl border-0 dark:hidden"
                />
                <img
                  src="/images/product/dark_mobile_brave_screenshot_app.localhost.png"
                  alt="Product Dashboard Mockup"
                  // sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-coverobject-top hidden rounded-xl border-0 dark:block"
                />
              </div>

              {/* Tablet View Dark/Light */}
              <div className="absolute bottom-0 left-[10%] w-[35%] translate-x-[0%] rounded-t-2xl border-x border-t border-gray-200 bg-zinc-900 p-2 shadow-2xl md:left-0 md:translate-x-[-50%] dark:border-gray-600">
                <div className="flex items-center gap-2 bg-zinc-900 px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>
                <img
                  src="/images/product/light_tab_brave_screenshot_app.localhost.png"
                  alt="Product Dashboard Mockup"
                  // sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-coverobject-top block rounded rounded-t-xl border-0 dark:hidden"
                />
                <img
                  src="/images/product/dark_tab_brave_screenshot_app.localhost.png"
                  alt="Product Dashboard Mockup"
                  // sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-coverobject-top hidden rounded rounded-t-xl border-0 dark:block"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* other home page content will go here */}

      <div>
        <h5 className="mb-4 text-center text-lg text-black dark:text-gray-200">
          Trusted by companies all over Africa & The World
        </h5>
        <div className="pointer-events-none mt-4 flex flex-wrap items-center justify-center gap-10 py-5 select-none">
          <img
            className="h-10 brightness-30 dark:brightness-100"
            src={"/images/logo/company-1.svg"}
            alt="Company 1"
            loading="lazy"
          />
          <img
            className="h-10 brightness-30 dark:brightness-100"
            src={"/images/logo/company-2.svg"}
            alt="Company 2"
            loading="lazy"
          />
          <img
            className="h-10 brightness-30 dark:brightness-100"
            src={"/images/logo/company-3.svg"}
            alt="Company 3"
            loading="lazy"
          />
          <img
            className="h-10 brightness-30 contrast-0 dark:brightness-100"
            src={"/images/logo/company-4.png"}
            alt="Company 4"
            loading="lazy"
          />
        </div>
      </div>

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
          <h2 className="mt-2 mb-3 text-3xl font-bold text-slate-900 dark:text-gray-300">
            Empowering Fleet Operators with Intelligent Technology
          </h2>
          <p className="max-w-175 text-sm leading-relaxed text-slate-600 dark:text-gray-400">
            FleetMaster is the ultimate fleet management dashboard built with
            modern technology and designed for Africa. We streamline vehicle
            rentals, track real-time diagnostics, and verify user credentials
            from a single, beautifully unified workspace ...
          </p>

          <div className="mt-5 flex items-center gap-4 pt-2">
            <Link
              href="/about"
              className="group bg-brand-600 hover:bg-brand-700 flex cursor-pointer items-center gap-1 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-md transition-all"
            >
              Read More
              <KeyboardArrowRightIcon
                className="text-sm transition-transform group-hover:translate-x-0.5"
                fontSize="small"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 mb-8 grid w-full grid-cols-1 gap-3 p-4 md:container lg:grid-cols-12">
        {/* 2. Swapped col-5 for col-span-5 */}
        <div className="col-span-12 mb-8 lg:col-span-5">
          <h3 className="text-green-500">Where We Come In</h3>
          <h2 className="mt-4 mb-3 text-3xl font-bold text-black dark:text-gray-300">
            Focus on Business. Leave the Software Hassle to Us!
          </h2>
          {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
          <p className="max-w-175 text-sm text-gray-500 dark:text-gray-400">
            Our neatly crafted, optimised and easy to set up software helps you
            manage your rental fleet sweatless. You do your daily workflow, we
            automatically let clients know what is happening. Help your clients
            find the perfect car for their needs without loosing them.
          </p>

          <div className="mt-5 flex items-center gap-4 pt-2">
            <Link
              target="_blank"
              href="/request-demo"
              className="cursor-pointer rounded-xl border-gray-500 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:text-black dark:bg-gray-800 dark:text-gray-200 dark:hover:text-white"
            >
              Request demo
            </Link>
            <Link
              target="_blank"
              href="http://app.localhost:3000/register"
              className="group flex cursor-pointer items-center gap-1 rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-green-700"
            >
              Get Started Now
              <KeyboardArrowRightIcon
                className="text-sm transition-transform group-hover:translate-x-0.5"
                fontSize="small"
              />
            </Link>
          </div>
        </div>

        <div className="relative col-span-12 mx-auto max-w-4xl space-y-12 px-4 py-3 lg:col-span-7">
          <h2 className="mb-12 block text-2xl font-bold text-slate-900 md:hidden dark:text-white">
            Core Applications
          </h2>

          {/* Center Timeline Line Indicator: Centered on desktop, shifted to the left edge on mobile screens */}
          <div className="pointer-events-none absolute top-24 bottom-6 left-6.5 w-0.5 -translate-x-1/2 bg-slate-200 md:left-1/2 dark:bg-slate-800" />

          {UsageCases.map((feature, index) => {
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
                  className={`relative mb-0 flex aspect-3/2 overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md md:mb-10 dark:bg-slate-900 ${isEven ? "md:order-first" : "md:order-last"}`}
                >
                  <Image
                    src={feature.imgSrc}
                    alt={feature.badgeText}
                    preload
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    style={{ objectFit: "cover" }}
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
      </div>

      <div className="container m-auto mb-5 border-t border-gray-500"></div>

      <br />
      <div className="p-3">
        <h3 className="text-brand-500 md:text-center">Choose Convenience</h3>
        <h2 className="mt-4 mb-3 text-3xl font-bold text-black md:text-center dark:text-gray-300">
          Be Among Hundreds of our Happy Clients Worldwide!
        </h2>
        <p className="m-auto mb-5 max-w-175 text-sm text-gray-500 md:text-center dark:text-gray-400">
          Browse our extensive collection of well-maintained vehicles across
          divers locations. From compact cars to luxury sedans, we have the
          perfect vehicle for your needs.
        </p>

        <div className="mb-4 grid w-full grid-cols-1 gap-3 md:container md:mx-auto md:grid-cols-2 lg:grid-cols-4">
          <div className="mb-6 rounded-2xl border-l-0 border-l-blue-500 bg-gray-700/9 p-4 shadow shadow-blue-500/60">
            <PeopleAltOutlinedIcon className="text-gray-500" />
            <h2 className="text-brand-500 mt-2 mb-2 text-2xl font-extrabold">
              100+
            </h2>
            <h3 className="mb-1 font-bold text-black dark:text-white">
              Happy Clients
            </h3>
            <p className="truncate text-sm text-gray-500">
              Browse a bunch of our fleet available at our designated yards.
              Want economy, premium SUVs, Minivans? We've got it!
            </p>
          </div>
          <div className="mb-6 rounded-2xl border-l-0 border-l-blue-500 bg-gray-700/9 p-4 shadow shadow-blue-500/60">
            <InventoryOutlinedIcon className="text-gray-500" />
            <h2 className="text-brand-500 mt-2 mb-2 text-3xl font-extrabold">
              1300+
            </h2>
            <h3 className="mb-1 font-bold text-black dark:text-white">
              Successful Bookings
            </h3>
            <p className="truncate text-sm text-gray-500">
              Browse a bunch of our fleet available at our designated yards.
              Want economy, premium SUVs, Minivans? We've got it!
            </p>
          </div>
          <div className="mb-6 rounded-2xl border-l-0 border-l-blue-500 bg-gray-700/9 p-4 shadow shadow-blue-500/60">
            <PublicOutlinedIcon className="text-gray-500" />
            <h2 className="text-brand-500 mt-2 mb-2 text-3xl font-extrabold">
              5+
            </h2>
            <h3 className="mb-1 font-bold text-black dark:text-white">
              Countries Globally
            </h3>
            <p className="truncate text-sm text-gray-500">
              We are in over 5 countries all over A frica and Beyond!
            </p>
          </div>
          <div className="mb-6 rounded-2xl border-l-0 border-l-blue-500 bg-gray-700/9 p-4 shadow shadow-blue-500/60">
            <StarBorderOutlinedIcon className="text-gray-500" />
            <h2 className="text-brand-500 mt-2 mb-2 text-3xl font-extrabold">
              100%
            </h2>
            <h3 className="mb-1 font-bold text-black dark:text-white">
              Satisfaction
            </h3>
            <p className="truncate text-sm text-gray-500">
              Browse a bunch of our fleet available at our designated yards.
              Want economy, premium SUVs, Minivans? We've got it!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 mb-5 grid w-full grid-cols-1 items-center gap-6 p-3 md:container md:mx-auto lg:grid-cols-12">
        {/* 3. Swapped col-7 for col-span-7 */}
        <div className="relative aspect-video lg:col-span-6">
          <Image
            className="w-full rounded-xl"
            alt="What Next ..."
            preload
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            style={{ objectFit: "cover" }}
            src={
              "/images/user/Professional_business_concept_image_showing_a_Flor-1765206733138.webp"
            }
          />
        </div>

        {/* 2. Swapped col-5 for col-span-5 */}
        <div className="lg:col-span-6">
          <h3 className="text-amber-500">SO, WHAT NEXT?</h3>
          <h2 className="mt-4 mb-3 text-3xl font-bold text-black dark:text-gray-300">
            Get a Software that Works for You
          </h2>
          {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
          <p className="max-w-175 text-sm text-gray-500 dark:text-gray-400">
            Fleetmster, we are passionate about providing exceptional car rental
            services that exceed our customers' expectations. With a commitment
            to quality, reliability, and customer satisfaction, we strive to be
            the preferred choice for all your car rental needs. Our extensive
            fleet of well-maintained vehicles, competitive pricing, and
            personalized service make us the go-to destination for travelers
            seeking convenience and comfort on the road.
          </p>

          <div className="mt-5 flex items-center gap-4 pt-2">
            <Link
              target="_blank"
              href="http://app.localhost:3000/register"
              className="group flex cursor-pointer items-center gap-1 rounded-xl bg-amber-600 px-5 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-amber-700"
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

      <br />
      <TestimonialsSection feedbacks={feedbacks} />
      <br />
      <CallToAction />
    </div>
  );
}
