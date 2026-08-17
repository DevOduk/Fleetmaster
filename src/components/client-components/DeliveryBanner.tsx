import React from "react";

function DeliveryBanner() {
  return (
    <div className="bg-brand-50 dark:bg-brand-500/10 col-span-full mb-5 flex items-center gap-3 rounded-xl border p-3 dark:border-gray-700">
      <img
        className="w-50"
        src={
          "https://indigocarhire.co.uk/wp-content/uploads/header_22-768x281.png"
        }
        alt=""
      />{" "}
      <div>
        <h5 className="font-semibold text-black dark:text-white">
          Delivery & Airport Dropoffs
        </h5>
        <p className="text-sm text-gray-400">
          We offer Affordable delivery services and airport dropoffs
        </p>
        <p className="mt-1 text-xs text-gray-500">
          1,000 Ksh Within Nairobi | 1,500 Ksh Airport Dropoffs | 2,000 Ksh
          Outside Nairobi ({"<"}100km)
        </p>
      </div>
    </div>
  );
}

export default DeliveryBanner;
