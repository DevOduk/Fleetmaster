// app/page.tsx
import type { Metadata } from "next";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined"
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import HttpIcon from "@mui/icons-material/Http"
import CarRentalOutlinedIcon from "@mui/icons-material/CarRentalOutlined"
import SubtitlesOutlinedIcon from "@mui/icons-material/SubtitlesOutlined"
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined"
import NoCrashOutlinedIcon from "@mui/icons-material/NoCrashOutlined"
import TestimonialsSection from '@/components/marketing-components/Testimonials'
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined"
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined"
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined"
import CallToAction from "@/components/marketing-components/CallToAction";
import Link from "next/link";



export const metadata: Metadata = {
  title:
    "Home | FleetMaster - Fleet Management Solution",
  description: "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default function Home() {
  return (
    <div>
      <div className='hero select-none h-max-screen bg-white dark:bg-[#080a29] relative'>
        <div
          className="absolute top-0 right-0 w-full h-100 lg:h-[85vh] bg-cover bg-right lg:bg-center opacity-40 lg:opacity-100 mix-blend-multiply lg:mix-blend-normal"
          style={{
            backgroundImage: `url('/images/product/BMW-MY26-X6-cosy-1-extended.jpg')`,
            // 225deg pushes the visibility to the bottom-right. 
            // Starting at 0% to 50% keeping it transparent ensures most of the screen stays clear for text.
            maskImage: 'linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,2) 90%)',
            WebkitMaskImage: 'linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,2) 90%)'
          }}
        />


        {/* HERO HERO MAIN CONTENT */}
        <main className="max-w-7xl relative mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-48">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Typography & Actions */}
            <div className="lg:col-span-7 space-y-6 max-w-2xl">
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight max-w-2xl mx-auto lg:mx-0 leading-[1.1] text-black dark:text-white">
                The intelligent way to manage your{" "}
                <span className="bg-linear-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                  entire fleet
                </span>
              </h1>

              <p className="text-small text-gray-600 dark:text-gray-500 font-normal leading-relaxed max-w-xl">
                Streamline your vehicle rentals, track real-time diagnostics, and verify user credentials from a single, beautifully unified workspace.<span className="font-bold text-green-500">Made by Africa for Africa!</span></p>

              <div className="flex items-center gap-4 pt-2">
                <Link target="_blank" href='/request-demo' className="px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors cursor-pointer border-gray-500 rounded-xl shadow-sm bg-gray-50 dark:bg-gray-800">
                  Request demo
                </Link>
                <Link target="_blank" href='http://app.localhost:3000/register' className="group px-5 py-3 bg-amber-600 text-white text-sm font-medium rounded-xl flex items-center gap-1 hover:bg-amber-700 transition-all shadow-md cursor-pointer">
                  Get Started Now
                  <KeyboardArrowRightIcon className="text-sm transition-transform group-hover:translate-x-0.5" fontSize="small" />
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* LOWER LAYER / APP MOCKUP OVERLAP Creates that cool dark-mode contrast break stretching across the bottom foldn */}
        <section className="relative m-auto max-w-[90%] lg:max-w-5xl -top-25 mx-auto px-4 sm:px-6 lg:px-8 select-none pointer-events-none">

          {/* App Window Wrapper Container */}
          <div className="w-full max-w-5xl bg-zinc-900 rounded-t-2xl border-x border-t border-gray-200 dark:border-gray-600 shadow-2xl p-2">

            {/* Top Bar Window Decorations */}
            <div className="px-4 py-3 bg-zinc-900 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>

            {/* Simulating Internal Dashboard Content */}
            <div className="relative w-full">
              <img
                src="/images/product/light_app.localhost.png"
                alt="Product Dashboard Mockup"
                // sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover w-full block dark:hidden object-top rounded-t-xl border-0 rounded"
              />
              <img
                src="/images/product/dark_app.localhost.png"
                alt="Product Dashboard Mockup"
                // sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover w-full hidden dark:block object-top rounded-t-xl border-0 rounded"
              />



              {/* Mobile View Dark/Light */}
              <div className="bg-zinc-900  bottom-0 absolute right-[75%] md:right-0 translate-x-[0%] md:translate-x-[50%] w-[25%]  rounded-2xl border-x border-t border-gray-200 dark:border-gray-600 shadow-2xl p-1">
                {/* <div className="px-4 py-3 bg-zinc-900 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div> */}
                <img
                  src="/images/product/light_mobile_brave_screenshot_app.localhost.png"
                  alt="Product Dashboard Mockup"
                  // sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-coverobject-top rounded-xl border-0 block dark:hidden"
                />
                <img
                  src="/images/product/dark_mobile_brave_screenshot_app.localhost.png"
                  alt="Product Dashboard Mockup"
                  // sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-coverobject-top rounded-xl border-0 hidden dark:block"
                />
              </div>



              {/* Tablet View Dark/Light */}
              <div className="bg-zinc-900  bottom-0 absolute left-[10%] md:left-0 translate-x-[0%] md:translate-x-[-50%]  w-[35%]  rounded-t-2xl border-x border-t border-gray-200 dark:border-gray-600 shadow-2xl p-2">
                <div className="px-4 py-3 bg-zinc-900 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <img
                  src="/images/product/light_tab_brave_screenshot_app.localhost.png"
                  alt="Product Dashboard Mockup"
                  // sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-coverobject-top rounded-t-xl border-0 rounded block dark:hidden"
                />
                <img
                  src="/images/product/dark_tab_brave_screenshot_app.localhost.png"
                  alt="Product Dashboard Mockup"
                  // sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-coverobject-top rounded-t-xl border-0 rounded hidden dark:block"
                />
              </div>

            </div>
          </div>


        </section>
      </div>
      {/* other home page content will go here */}

      <div>
        <h5 className='text-black text-lg text-center mb-4 dark:text-gray-200'>Trusted by companies all over Africa & The World</h5>
        <div className='flex items-center gap-10 justify-center flex-wrap py-5 mt-4 pointer-events-none select-none'>
          <img className='h-10 brightness-30 dark:brightness-100' src={'/images/logo/company-1.svg'} alt='Company 1' />
          <img className='h-10 brightness-30 dark:brightness-100' src={'/images/logo/company-2.svg'} alt='Company 1' />
          <img className='h-10 brightness-30 dark:brightness-100' src={'/images/logo/company-3.svg'} alt='Company 1' />
          <img className='h-10 brightness-30 dark:brightness-100' src={'/images/logo/company-1.svg'} alt='Company 1' />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 w-full md:container mx-auto mb-8 mt-8">
        {/* 2. Swapped col-5 for col-span-5 */}
        <div className="lg:col-span-5 col-span-12">
          <h3 className="text-amber-500">Where We Come In</h3>
          <h2 className="text-3xl mt-4 mb-3 font-bold text-black dark:text-white">Focus on Business. Leave the Software Hassle to Us!</h2>
          {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-175">
            Our neatly crafted, optimised and easy to set up software helps you manage your rental fleet sweatless. You do your daily workflow, we automatically let clients know what is happening. Help your clients find the perfect car for their needs without loosing them.
          </p>

          <div className="flex mt-5 items-center gap-4 pt-2">
            <Link target="_blank" href='/request-demo' className="px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors cursor-pointer border-gray-500 rounded-xl shadow-sm bg-gray-50 dark:bg-gray-800">
              Request demo
            </Link>
            <Link target="_blank" href='http://app.localhost:3000/register' className="group px-5 py-3 bg-amber-600 text-white text-sm font-medium rounded-xl flex items-center gap-1 hover:bg-amber-700 transition-all shadow-md cursor-pointer">
              Get Started Now
              <KeyboardArrowRightIcon className="text-sm transition-transform group-hover:translate-x-0.5" fontSize="small" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-12 relative max-w-4xl mx-auto px-4">
          {/* <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-12 text-center">
              Core Applications
            </h2> */}

          {/* Center Timeline Line Indicator: Centered on desktop, shifted to the left edge on mobile screens */}
          <div className="absolute left-6.5 md:left-1/2 top-24 bottom-6 w-0.5 -translate-x-1/2 bg-slate-200 dark:bg-slate-800 pointer-events-none" />

          {[
            {
              imgSrc: '/images/product/3.webp',
              badgeText: 'Overview',
              icon: CarRentalOutlinedIcon,
              title: '1. Centralized Dispatch & Fleet Overview',
              description: 'One single source of truth. Eliminate messy spreadsheets and scattered communication. Manage vehicle assignments, active rentals, invoicing, and contract history from a single, unified dashboard designed for quick decision-making.',
              imgClassName: 'rounded-t-2xl mb-3 aspect-4/2 w-full object-cover'
            },
            {
              imgSrc: '/images/product/2.webp',
              badgeText: 'Easy Setup',
              icon: HttpIcon,
              title: '2. Free Domain & Zero-Config',
              description: 'We handle the infrastructure. Avoid the hidden costs of buying, configuring, and maintaining separate web domains. Launch instantly with a secure, fully-managed yourbrand.fleetmaster.com portal completely free.',
              imgClassName: 'rounded-t-2xl bg-gray-200 mb-3 aspect-4/2 w-full object-cover'
            },
            {
              imgSrc: '/images/product/4.webp',
              badgeText: 'Live Dashboard',
              icon: SubtitlesOutlinedIcon,
              title: '3. Live Fleet Telematics',
              description: 'We help you setup Real-time tracking and other features. Monitor vehicle diagnostics, live locations, and battery health on a unified map. Catch mechanical issues and unauthorized route deviations instantly before they become costly repairs.',
              imgClassName: 'rounded-t-2xl bg-gray-200 mb-3 aspect-4/2 w-full object-cover'
            },
            {
              imgSrc: '/images/product/5.webp',
              badgeText: 'AI Automation',
              icon: VerifiedUserOutlinedIcon,
              title: '4. Automated Driver Vetting',
              description: "Security-first verification. Protect high-value vehicles from liability risks. The onboarding pipeline automatically scans and verifies driver's licenses and credentials before a vehicle can ever be booked.",
              imgClassName: 'rounded-t-2xl mb-3 aspect-4/2 w-full object-cover'
            },
            {
              imgSrc: '/images/product/6.webp',
              badgeText: 'Easy Management',
              icon: NoCrashOutlinedIcon,
              title: '5. Manage Bookings in One Place',
              description: 'Easily view and manage all your vehicles on one place. Our live vehicle status checks lets clients know which cars are available and which are not. Preview all bookings before a booking even commence.',
              imgClassName: 'rounded-t-2xl mb-3 aspect-4/2 w-full object-cover'
            },
            {
              imgSrc: '/images/product/1.webp',
              badgeText: 'Save Time',
              icon: CalendarMonthIcon,
              title: '6. Saves you Time & Money',
              description: 'Save time with our built in Calendar that helps you plan dropoffs and pickups helping you keep track of all pending bookings. All in one place!',
              imgClassName: 'rounded-t-2xl mb-3 aspect-4/2 w-full object-cover'
            }
          ].map((feature, index) => {
            const FeatureIcon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative pl-12 md:pl-0 min-h-75"
              >
                {/* Center/Left Number Node Badge */}
                <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 translate-x-0 md:-translate-x-1/2 md:-translate-y-1/2 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 shadow-sm z-10 text-sm">
                  {index + 1}
                </div>

                {/* Content Card Wrapper (Image Container) */}
                {/* md:order-first and md:order-last push the image dynamically based on item index */}
                <div
                  className={`rounded-2xl shadow-sm bg-white dark:bg-slate-900 transition-all hover:shadow-md flex overflow-hidden mb-10 ${isEven ? 'md:order-first' : 'md:order-last'}`}
                >
                  <img
                    src={feature.imgSrc}
                    alt={feature.badgeText}
                    className="aspect-3/2 w-full object-cover bg-gray-200"
                  />
                </div>

                {/* Text Context Content Block */}
                {/* Optional alignment adjustment: alignment shifts to match the timeline spacing flow layout */}
                <div className={`flex flex-col justify-center mb-10 ${isEven ? 'md:pl-4' : 'md:pr-4'}`}>
                  <div className="flex gap-2 font-bold items-center mt-4">
                    <div className="rounded-full w-9 h-9 flex items-center justify-center bg-brand-500/10 dark:bg-brand-500/20">
                      <FeatureIcon className="text-brand-500 w-5 h-5" />
                    </div>
                    <span className="text-brand-500 text-sm tracking-wide">{feature.badgeText}</span>
                  </div>
                  <h3 className="mb-2 mt-3 font-bold text-slate-900 dark:text-white text-lg">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      <div className="border-gray-500 border-t container m-auto mb-5"></div>


      <br />
      <div>
        <h3 className="text-brand-500 text-center">Choose Convenience</h3>
        <h2 className="text-3xl mt-4 mb-3 font-bold text-black text-center dark:text-white">Be Among Hundreds of our Happy Clients Worldwide!</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-175 m-auto mb-5">Browse our extensive collection of well-maintained vehicles across divers locations. From compact cars to luxury sedans, we have the perfect vehicle for your needs.</p>

        <div className='container m-auto mb-4 gap-3 grid grid-cols-2 lg:grid-cols-4 p-2'>
          <div className='rounded-2xl mb-6 p-4 shadow shadow-blue-500/60 bg-gray-700/9 border-l-blue-500 border-l-0'>
            <PeopleAltOutlinedIcon className='text-gray-500' />
            <h2 className='text-2xl mt-2 mb-2 text-brand-500 font-extrabold'>100+</h2>
            <h3 className='mb-1 font-bold text-black dark:text-white'>Happy Clients</h3>
            <p className='text-sm text-gray-500 truncate'>Browse a bunch of our fleet available at our designated yards. Want economy, premium SUVs, Minivans? We've got it!</p>
          </div>
          <div className='rounded-2xl mb-6 p-4 shadow shadow-blue-500/60 bg-gray-700/9 border-l-blue-500 border-l-0'>
            <InventoryOutlinedIcon className='text-gray-500' />
            <h2 className='text-3xl mt-2 mb-2 text-brand-500 font-extrabold'>1300+</h2>
            <h3 className='mb-1 font-bold text-black dark:text-white'>Successful Bookings</h3>
            <p className='text-sm text-gray-500 truncate'>Browse a bunch of our fleet available at our designated yards. Want economy, premium SUVs, Minivans? We've got it!</p>
          </div>
          <div className='rounded-2xl mb-6 p-4 shadow shadow-blue-500/60 bg-gray-700/9 border-l-blue-500 border-l-0'>
            <PublicOutlinedIcon className='text-gray-500' />
            <h2 className='text-3xl mt-2 mb-2 text-brand-500 font-extrabold'>5+</h2>
            <h3 className='mb-1 font-bold text-black dark:text-white'>Countries Globally</h3>
            <p className='text-sm text-gray-500 truncate'>We are in over 5 countries all over A frica and Beyond!</p>
          </div>
          <div className='rounded-2xl mb-6 p-4 shadow shadow-blue-500/60 bg-gray-700/9 border-l-blue-500 border-l-0'>
            <StarBorderOutlinedIcon className='text-gray-500' />
            <h2 className='text-3xl mt-2 mb-2 text-brand-500 font-extrabold'>100%</h2>
            <h3 className='mb-1 font-bold text-black dark:text-white'>Satisfaction</h3>
            <p className='text-sm text-gray-500 truncate'>Browse a bunch of our fleet available at our designated yards. Want economy, premium SUVs, Minivans? We've got it!</p>
          </div>
        </div>

      </div>



      <div className="grid items-center container m-auto grid-cols-1 lg:grid-cols-12 gap-6 p-4 mt-5 mb-5">

        {/* 3. Swapped col-7 for col-span-7 */}
        <div className="lg:col-span-6">
          <img className='rounded-xl w-full' alt='What Next ...' src={'/images/user/Professional_business_concept_image_showing_a_Flor-1765206733138.webp'} />
        </div>

        {/* 2. Swapped col-5 for col-span-5 */}
        <div className="lg:col-span-6">
          <h3 className="text-amber-500">SO, WHAT NEXT?</h3>
          <h2 className="text-3xl mt-4 mb-3 font-bold text-black dark:text-white">Get a Software that Works for You</h2>
          {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-175">
            Fleetmster, we are passionate about providing exceptional car rental services that exceed our customers' expectations. With a commitment to quality, reliability, and customer satisfaction, we strive to be the preferred choice for all your car rental needs. Our extensive fleet of well-maintained vehicles, competitive pricing, and personalized service make us the go-to destination for travelers seeking convenience and comfort on the road.
          </p>


          <div className="flex mt-5 items-center gap-4 pt-2">
            <Link target="_blank" href='http://app.localhost:3000/register' className="group px-5 py-3 bg-amber-600 text-white text-sm font-medium rounded-xl flex items-center gap-1 hover:bg-amber-700 transition-all shadow-md cursor-pointer">
              Get Started Now
              <KeyboardArrowRightIcon className="text-sm transition-transform group-hover:translate-x-0.5" fontSize="small" />
            </Link>
          </div>
        </div>

      </div>



      <br />
      <TestimonialsSection />
      <br />
      <CallToAction />

    </div>
  );
}
