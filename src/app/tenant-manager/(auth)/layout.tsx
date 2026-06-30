import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { AdminProvider } from "@/context/AdminContext";
import { TenantProvider } from "@/context/TenantContext";

import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthSigInLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <UserProvider>
      <AdminProvider>
        <TenantProvider>
          <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <ThemeProvider>
              <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
                {children}
                <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
                  <div className="relative items-center justify-center  flex z-1">
                    {/* <!-- ===== Common Grid Shape Start ===== --> */}
                    <GridShape />
                    <div className="flex flex-col items-center max-w-md">
                      <Link href="/" className="block mb-4">
                        <Image
                          width={231}
                          height={48}
                          src="/images/logo/auth-logo.svg"
                          alt="Logo"
                        />
                      </Link>
                      <p className="text-left text-gray-400 text-sm dark:text-white/60">
                        Get started with our simple but efficient fleet management software. Gives yo an easy way to manage your fleet from 1 to 1000s of vehicles at once.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
                  <ThemeTogglerTwo />
                </div>
              </div>
            </ThemeProvider>
          </div>
        </TenantProvider>
      </AdminProvider>
    </UserProvider>
  );
}
