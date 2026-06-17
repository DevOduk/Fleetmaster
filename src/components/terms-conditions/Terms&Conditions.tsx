"use client";

import React from "react";
import ComponentCard from "../common/ComponentCard";

const TermsConditions: React.FC = () => {  
  return (
    <div className="space-y-6">
      <ComponentCard title="Terms & Conditions of Service">
        <div className="space-y-6 text-gray-800 text-theme-sm dark:text-white/90">
          
          <section className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              1. Acceptance of Terms
            </h3>
            <p className="font-medium leading-relaxed">
              By accessing and utilizing this fleet management system, including its booking management dashboards, scheduling calendars, and integrated payment processors, you agree to comply with and be bound by these Terms and Conditions. This software is designed as an operational framework for vehicle rentals, safaris, and logistics businesses.
            </p>
          </section>

          <hr className="border-gray-200 dark:border-white/10" />

          <section className="space-y-2">
            <h3 className="text-base font-semibold text-red-600 dark:text-red-400">
              2. Absolute Limitation of Liability & Asset Tracking Disclaimer
            </h3>
            <p className="font-medium leading-relaxed">
              <strong>CRITICAL DISCLAIMER:</strong> This software platform operates strictly as an administrative utility for scheduling, reservations, and payment log tracking. 
            </p>
            <ul className="list-disc pl-5 space-y-1 font-medium">
              <li>
                <strong>No Telemetry/Vehicle Tracking:</strong> This platform does <strong>NOT</strong> feature active vehicle GPS tracking, geofencing, remote immobilization, or physical anti-theft asset surveillance.
              </li>
              <li>
                <strong>No Indemnity for Physical Losses:</strong> The system providers shall not be held liable, legally or financially, for the loss, theft, vandalism, impoundment, road accidents, or physical destruction of any vehicle, asset, or equipment logged within the system. 
              </li>
              <li>
                The responsibility for securing comprehensive commercial insurance, physical asset recovery, and third-party tracking software installations rests solely on the individual operator/fleet owner.
              </li>
            </ul>
          </section>

          <hr className="border-gray-200 dark:border-white/10" />

          <section className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              3. Booking Management & Calendar Accuracy
            </h3>
            <p className="font-medium leading-relaxed">
              The application provides automated conflict checking based on chronological timestamp limits provided by your operational data entry inputs. The operator assumes full responsibility for the accuracy of overlapping time buffers and reservation scheduling configurations. The software system is not responsible for business revenue lost due to operational overbooking or manual calendar adjustment mistakes.
            </p>
          </section>

          <hr className="border-gray-200 dark:border-white/10" />

          <section className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              4. Integrated Payments & Financial Reconciliation
            </h3>
            <p className="font-medium leading-relaxed">
              Payment recording features are meant to manage receipts and processing confirmation workflows. Businesses are required to double-check their financial settlement ledger data against their respective actual M-PESA corporate portals or secondary banking provider infrastructure to ensure final transaction clearance before releasing vehicles to clients.
            </p>
          </section>

          <hr className="border-gray-200 dark:border-white/10" />

          <section className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              5. Governing Law
            </h3>
            <p className="font-medium leading-relaxed">
              These operational terms are governed by and construed in accordance with the Laws of the Republic of Kenya. Any disputes relative to application service availability shall be resolved under local jurisdictions.
            </p>
          </section>

        </div>
      </ComponentCard>
    </div>
  );
};

export default TermsConditions;