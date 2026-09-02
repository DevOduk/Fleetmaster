"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const MainClientFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <div>
      <div className="flex cursor-pointer items-center gap-0 relative p-4 lg:px-10 py-8 w-full bg-gray-300 dark:bg-zinc-800">
        <Link href="/" className="w-full contrast-0 relative pointer-events-none select-none">
          <img
            className="w-full h-full"
            src="/images/logo/logo-vector.svg"
            alt=""
          />
        </Link>
      </div>

      <footer className="w-full bg-white dark:bg-zinc-950">
        <div className="mx-auto container relative py-12 p-3">
          {/* Main Footer */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            {/* Left - Copyright */}
            <div className="text-center md:text-left md:col-span-4">

              <div className="flex cursor-pointer mb-3 items-center gap-2">
                <Link href="/" className="">
                  <Image
                    width={154}
                    height={32}
                    sizes="(max-width: 768px) 120px, 154px"
                    className="block dark:hidden"
                    src="/images/logo/logo.svg"
                    alt=""
                  />
                  <Image
                    width={154}
                    height={40}
                    sizes="(max-width: 768px) 120px, 154px"
                    preload
                    className="hidden dark:block"
                    src="/images/logo/logo-dark.svg"
                    alt=""
                  />
                </Link>
              </div>
              <p className="text-sm mb-2 font-medium text-left text-gray-500 dark:text-gray-400">
                © FleetMaster Ltd. {year}
              </p>

              <p className="text-xs text-gray-400 text-left dark:text-gray-500">
                All Rights Reserved.
              </p>
            </div>

            <div className="md:col-span-8 text-left flex flex-col gap-10 md:grid md:grid-cols-12">
              {/* Center - Developer */}
              <div className="col-span-12 md:col-span-6">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Designed & Developed by
                </p>

                <Link
                  target="_blank"
                  href="https://github.com/DevOduk"
                  className="mt-1 inline-block text-xs font-semibold text-brand-500 transition-colors hover:text-blue-600"
                >
                  DevOduk Developers
                </Link>
              </div>

              {/* Right - Navigation */}
              <div className="flex flex-col col-span-12 md:col-span-6 items-start gap-2 text-xs font-medium md:items-end">
                <Link
                  target="_blank"
                  href="http://localhost:3000"
                  className="text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  FleetMaster Home
                </Link>
                <Link
                  target="_blank"
                  href="http://localhost:3000/about"
                  className="text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  About Us
                </Link>

                <Link
                  href="/terms-conditions#"
                  className="text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Terms & Conditions
                </Link>

                <Link
                  href="/privacy-policy"
                  className="text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Privacy Policy
                </Link>

                <Link
                  href="/support"
                  className="text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Contact Support
                </Link>
              </div>


              <div className="text-left col-span-12">
                <p className="text-xs text-gray-700 dark:text-gray-400 leading-6">
                  Fleetmster, we are passionate about providing exceptional car rental services that exceed our customers' expectations. With a commitment to quality, reliability, and customer satisfaction, we strive to be the preferred choice for all your car rental needs. Our extensive fleet of well-maintained vehicles, competitive pricing, and personalized service make us the go-to destination for travelers seeking convenience and comfort on the road.   </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-5 text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500 sm:flex-row">
            <span>
              © FleetMaster {year} All Rights Reserved.
            </span>

            <div className="flex items-center gap-3">
              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-gray-700 dark:hover:text-gray-300"
              >
                Privacy Policy
              </Link>

              <span>|</span>

              <Link
                href="/terms-conditions#"
                className="transition-colors hover:text-gray-700 dark:hover:text-gray-300"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainClientFooter;
