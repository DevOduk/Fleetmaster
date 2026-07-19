import React from "react";

export default function SidebarExpiryWidget({ plan,expiry }: { plan?: string; expiry: string; }) {
  return  (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/3`}
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        Subscription Expiry! 
      </h3>
      <p className="mb-4 text-gray-500 text-xs dark:text-gray-400">
        Your subscription plan ({plan}) {expiry}
      </p>
      <button
        className="flex w-full items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-sm hover:bg-brand-600"
      >
        Renew Subscription
      </button>
    </div>
  );
}
