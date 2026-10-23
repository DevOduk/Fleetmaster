"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const MainClientFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <div>
      <div className="relative flex w-full cursor-pointer items-center gap-0 bg-gray-300 p-4 py-8 lg:px-10 dark:bg-zinc-800">
        <Link
          href="/"
          className="pointer-events-none relative w-full contrast-0 select-none"
        >
          <img
            className="h-full w-full"
            src="/images/logo/logo-vector.svg"
            alt=""
          />
        </Link>
      </div>

      <footer className="w-full bg-white dark:bg-zinc-950">
        <div className="relative w-full p-3 py-12 md:container md:mx-auto">
          {/* Main Footer */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            {/* Left - Copyright */}
            <div className="text-center md:col-span-4 md:text-left">
              <div className="mb-3 flex cursor-pointer items-center gap-2">
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
              <p className="mb-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                © FleetMaster Ltd. {year}
              </p>

              <p className="text-left text-xs text-gray-400 dark:text-gray-500">
                All Rights Reserved.
              </p>
            </div>

            <div className="flex flex-col gap-10 text-left md:col-span-8 md:grid md:grid-cols-12">
              {/* Center - Developer */}
              <div className="col-span-12 md:col-span-6">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Designed & Developed by
                </p>

                <Link
                  target="_blank"
                  href="https://github.com/DevOduk"
                  className="text-brand-500 mt-1 inline-block text-xs font-semibold transition-colors hover:text-blue-600"
                >
                  DevOduk Developers
                </Link>
              </div>

              {/* Right - Navigation */}
              <div className="col-span-12 flex flex-col items-start gap-2 text-xs font-medium md:col-span-6 md:items-end">
                <Link
                  target="_blank"
                  href="/"
                  className="text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  FleetMaster Home
                </Link>
                <Link
                  target="_blank"
                  href="/about"
                  className="text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  About Us
                </Link>
                <Link
                  target="_blank"
                  href="/pricing"
                  className="text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Pricing
                </Link>
                <Link
                  target="_blank"
                  href="/shop"
                  className="text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Shop
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

              <div className="col-span-12 text-left">
                <p className="text-xs leading-6 text-gray-700 dark:text-gray-400">
                  Fleetmster, we are passionate about providing exceptional car
                  rental services that exceed our customers' expectations. With
                  a commitment to quality, reliability, and customer
                  satisfaction, we strive to be the preferred choice for all
                  your car rental needs. Our extensive fleet of well-maintained
                  vehicles, competitive pricing, and personalized service make
                  us the go-to destination for travelers seeking convenience and
                  comfort on the road.{" "}
                </p>
              </div>

                <NewsletterSubscription />
            </div>
          </div>
          {/* Bottom Bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-5 text-xs text-gray-400 sm:flex-row dark:border-gray-800 dark:text-gray-500">
            <span>© FleetMaster {year} All Rights Reserved.</span>

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
