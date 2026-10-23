"use client";
import { useTenant } from "@/context/TenantContext";
import Link from "next/link";
import React from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import NewsletterSubscription from "@/components/NewsletterSubscription";

const ClientFooter: React.FC = () => {
  const { tenant } = useTenant();
  const year = new Date().getFullYear();

  return (
    <>
      {/* <div>
        <Link
          href={"/feedback"}
          className="text-theme-sm fixed top-1/2 left-0 z-40 origin-bottom-left -translate-y-1/2 rotate-90 bg-black px-4 py-2 text-center font-medium text-white shadow-lg transition-all hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-100"
        >
          Submit Feedback
        </Link>

        <div className="text-theme-sm mt-4 mb-4 flex flex-wrap items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
          <span>
            @Copyright {tenant?.name || "FleetMaster"} {year} All Rights
            Reserved.
          </span>
          <span>|</span>
          <span>
            <Link href={"/"}>Home</Link>
          </span>
          <span>|</span>
          <span>
            <Link href={"/terms-conditions"}>Terms & Conditions</Link> apply.
          </span>
          <span>|</span>
          <Link href={"/privacy-policy"}>Privacy Policy</Link>
          <span>|</span>
          <Link href={"/support"}>Contact Support</Link>
        </div>
        <div className="text-theme-sm mt-0 mb-7 flex flex-wrap items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
          <span>
            Designed & Developed by{" "}
            <Link
              target="_blank"
              href={"https://github.com/DevOduk"}
              className="text-blue-500 hover:text-blue-600"
            >
              DevOduk Developers
            </Link>
          </span>
        </div>
      </div> */}

      {/* aeshetic footer  */}

      <div>
        <div className="relative flex w-full cursor-pointer items-center gap-0 bg-gray-300 p-4 py-8 lg:px-10 dark:bg-brand-950">
          <Link
            href="/"
            className="pointer-events-none relative w-full contrast-0 select-none"
          >
            <img className="h-full w-full" src={tenant.tenant_logo} alt="" />
          </Link>
        </div>

        <footer className="w-full bg-white dark:bg-gray-950">
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
                  src={tenant.tenant_logo}
                      alt=""
                    />
                  </Link>
                </div>
                <p className="mb-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  ©{tenant?.name} Powered by FleetMaster
                </p>

                <p className="text-left text-xs text-gray-400 dark:text-gray-500">
                  {year} All Rights Reserved.
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
                    Home
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
                    href="/vehicles"
                    className="text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    Find a car
                  </Link>
                  <Link
                    target="_blank"
                    href="/yards"
                    className="text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    Location
                  </Link>

                  <Link
                    href="/contact"
                    className="text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    Contact
                  </Link>
                </div>

                <div className="col-span-12 text-left">
                  <p className="text-xs leading-6 text-gray-700 dark:text-gray-400">
                    {tenant?.about || tenant?.description}
                  </p>
                </div>

                <NewsletterSubscription />
              </div>
            </div>
            {/* Bottom Bar */}
            <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-5 text-xs text-gray-400 sm:flex-row dark:border-gray-800 dark:text-gray-500">
              <span>
                ©{tenant?.name} {year} All Rights Reserved.
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
    </>
  );
};

export default ClientFooter;
