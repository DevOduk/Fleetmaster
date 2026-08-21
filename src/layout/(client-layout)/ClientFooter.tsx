"use client";
import { useTenant } from "@/context/TenantContext";
import Link from "next/link";
import React from "react";

const ClientFooter: React.FC = () => {
  const { tenant } = useTenant();
  const year = new Date().getFullYear();

  return (
    <div>
      <Link 
  href={'/feedback'} 
  className="bg-black dark:bg-white fixed left-0 top-1/2 z-40 -translate-y-1/2 rotate-90 origin-bottom-left px-4 py-2 text-center text-theme-sm font-medium text-white dark:text-black shadow-lg transition-all hover:bg-black/90 dark:hover:bg-gray-100"
>
  Submit Feedback
</Link>

      <div className="text-theme-sm mt-4 mb-4 flex flex-wrap items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
        <span>
          @Copyright {tenant?.name || "FleetMaster"} {year} All Rights Reserved.
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
    </div>
  );
};

export default ClientFooter;
