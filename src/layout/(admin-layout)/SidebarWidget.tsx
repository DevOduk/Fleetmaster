import Link from "next/link";
import React from "react";

export default function SidebarWidget({ plan }: { plan?: string }) {
  return plan !== "Expert" ? (
    <div
      className={`mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/3`}
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        Get More for Less!
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        FleetMaster Expert is the ultimate fleet management dashboard.
      </p>
      <Link href={"/company-profile/subscription"}>
        <button className="bg-brand-500 hover:bg-brand-600 flex w-full items-center justify-center rounded-lg p-2 px-3 text-sm font-medium text-white">
          Upgrade To Expert
        </button>
      </Link>
    </div>
  ) : null;
}
