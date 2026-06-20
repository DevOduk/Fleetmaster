"use client";
import { useTenant } from "@/context/TenantContext";
import Link from "next/link";
import React from "react";

const ClientFooter: React.FC = () => {
  const { tenant } = useTenant();
  const year = (new Date()).getFullYear();
  return (
    <div>
      <div className="text-gray-500 text-theme-sm dark:text-gray-400 mb-4 mt-4 flex flex-wrap items-center justify-center gap-3">
        <span>@Copyright {tenant?.name || "FleetMaster"} {year} All Rights Reserved.</span>
        <span>|</span>
        <span><Link target="_blank" href={'/'}>Home</Link></span>
        <span>|</span>
        <span><Link href={'/terms-conditions'}>Terms & Conditions</Link> apply.</span>
        <span>|</span>
        <Link href={'/privacy-policy'}>Privacy Policy</Link>
        <span>|</span>
        <Link href={'/support'}>Contact Support</Link>
      </div>
      <div className="text-gray-500 text-theme-sm dark:text-gray-400 mb-7 mt-0 flex flex-wrap items-center justify-center gap-3">
        <span>Designed & Developed by <Link target="_blank" href={'https://github.com/DevOduk'} className="text-blue-500 hover:text-blue-600">DevOduk Developers</Link></span>
      </div>

    </div>
  );
};

export default ClientFooter;
