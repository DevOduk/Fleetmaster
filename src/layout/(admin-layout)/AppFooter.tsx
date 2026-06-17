"use client";
import Link from "next/link";
import React from "react";

const AppFooter: React.FC = () => {

  return (
    <div className="text-gray-500 text-theme-sm dark:text-gray-400 mb-7 mt-4 flex flex-wrap items-center justify-center gap-3">
      <span>@Copyright FleetMaster 2026 All Rights Reserved.</span>
      <span>|</span>
      <span><Link href={'/'}>FleetMaster Home</Link></span>
      <span>|</span>
      <span><Link href={'/terms-conditions'}>Terms & Conditions</Link> apply.</span>
      <span>|</span>
      <Link href={'/privacy-policy'}>Privacy Policy</Link>
      <span>|</span>
      <Link href={'/support'}>Contact Support</Link>
    </div>
  );
};

export default AppFooter;
