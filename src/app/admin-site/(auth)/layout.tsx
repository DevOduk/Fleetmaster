import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { AdminProvider } from "@/context/AdminContext";
import { TenantProvider } from "@/context/TenantContext";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthSigInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantProvider>
      <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
        <AdminProvider>
          <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
            {children}
            <div className="bg-brand-950 hidden h-full w-full items-center lg:grid lg:w-1/2 dark:bg-white/5">
              <div className="relative z-1 flex items-center justify-center">
                {/* <!-- ===== Common Grid Shape Start ===== --> */}
                <GridShape />
                <div className="flex max-w-md flex-col items-center">
                  <Link href="/" className="mb-4 block">
                    <Image
                      width={231}
                      height={48}
                      src="/images/logo/auth-logo.svg"
                      alt="Logo"
                    />
                  </Link>
                  <p className="text-left text-sm text-gray-400 dark:text-white/60">
                    Get started with our simple but efficient fleet management
                    software. Gives yo an easy way to manage your fleet from 1
                    to 1000s of vehicles at once.
                  </p>
                </div>
              </div>
            </div>
            <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
              <ThemeTogglerTwo />
            </div>
          </div>
        </AdminProvider>
      </div>
    </TenantProvider>
  );
}
