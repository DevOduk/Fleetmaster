"use client";

import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import CarRentalIcon from "@mui/icons-material/CarRental";
import SpeedIcon from "@mui/icons-material/Speed";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocalShieldIcon from "@mui/icons-material/ShieldOutlined";

interface ClientClause {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ClientRentalTerms: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("possession");

  const clauses: ClientClause[] = [
    { id: "possession", title: "1. Asset Care & Custody", icon: CarRentalIcon },
    {
      id: "telemetry",
      title: "2. GPS Surveillance & Tracking Consent",
      icon: GpsFixedIcon,
    },
    {
      id: "boundaries",
      title: "3. Geofencing & Cross-Border Restrictions",
      icon: WarningAmberIcon,
    },
    {
      id: "behavior",
      title: "4. Speed Limits & Driver Behavior",
      icon: SpeedIcon,
    },
    {
      id: "insurance",
      title: "5. Excess Liability & Insurance Voids",
      icon: LocalShieldIcon,
    },
  ];

  const handleScrollTo = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(`client-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 lg:grid-cols-12">
      {/* Navigation Sidebar */}
      <div className="col-span-12 h-fit space-y-2 lg:sticky lg:top-6 lg:col-span-4">
        <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4 dark:border-slate-800 dark:bg-zinc-950/80">
          <p className="mb-3 px-3 text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
            Renter / Client Agreement
          </p>
          <nav className="space-y-1">
            {clauses.map((clause) => {
              const Icon = clause.icon;
              const isActive = activeTab === clause.id;
              return (
                <button
                  key={clause.id}
                  onClick={() => handleScrollTo(clause.id)}
                  className={`flex w-full items-center justify-between rounded-xl p-3 text-left text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-green-800 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4! w-4! ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`}
                    />
                    <span>{clause.title}</span>
                  </div>
                  <ChevronRightIcon className="h-4! w-4! opacity-70" />
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Legal Text Clauses */}
      <div className="col-span-12 space-y-10 text-sm leading-relaxed text-slate-700 lg:col-span-8 dark:text-slate-300">
        {/* Clause 1 */}
        <section id="client-possession" className="scroll-mt-12 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <CarRentalIcon className="h-5! w-5! text-green-700" />
            <h3 className="text-lg font-bold">
              1. Legal Custody, Possession & Usage Constraints
            </h3>
          </div>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            The Renter acknowledges receiving the designated vehicle in optimal
            operational mechanical condition. From the timestamp of key
            transition until formal system return reconciliation, the Renter
            assumes full civil, financial, and criminal responsibility for the
            vehicle, its components, and actions committed with the asset.
          </p>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Prohibited Use Cases: Sub-leasing, mechanical racing, towing
            external loads, driving under the influence of intoxicating
            compounds, or utilizing the vehicle to transport contraband or
            commit offenses under the Penal Code of Kenya is strictly
            prohibited. Breach results in instant contract termination without
            refund.
          </p>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Clause 2 */}
        <section id="client-telemetry" className="scroll-mt-12 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <GpsFixedIcon className="h-5! w-5! text-green-700" />
            <h3 className="text-lg font-bold">
              2. Digital Telemetry Surveillance & Immobilization Consent
            </h3>
          </div>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            In compliance with the **Kenya Data Protection Act**, the Renter is
            hereby formally notified that the vehicle is fitted with a live
            global positioning system (GPS) tracker, fuel depth telemetry
            monitoring, and remote starter circuit cut-off capabilities.
          </p>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            By signing this agreement, the Renter provides explicit, irrevocable
            consent for the collection, transmission, and tracking of spatial
            location, driving vector data, and speed metrics. The operator
            retains the absolute legal right to deploy remote immobilization
            protocols if security anomalies or contractual breaches are
            verified.
          </p>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Clause 3 */}
        <section id="client-boundaries" className="scroll-mt-12 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <WarningAmberIcon className="h-5! w-5! text-green-700" />
            <h3 className="text-lg font-bold">
              3. Geofencing & Cross-Border Boundaries
            </h3>
          </div>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            The vehicle is configured with active operational geofences
            restricting transit outside standard operational regions. Unless
            explicitly approved in writing on the scheduling ticket, **the
            vehicle is strictly barred from exiting the borders of the Republic
            of Kenya.**
          </p>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            Attempted border crossings or unauthorized exit out of approved
            territories will register as a critical system asset threat event.
            This will trigger immediate vehicle shut down and the automatic
            dispatch of security recovery personnel at the Renter&apos;s
            personal cost.
          </p>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Clause 4 */}
        <section id="client-behavior" className="scroll-mt-12 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <SpeedIcon className="h-5! w-5! text-green-700" />
            <h3 className="text-lg font-bold">
              4. Speed Violations & Harsh Driving Penalties
            </h3>
          </div>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            To preserve engine lifespan and public roadway safety, a maximum
            speed constraint benchmark is set at **100 km/h** (or as mandated by
            local NTSA zone limits).
          </p>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            Telemetry software flags repetitive over-speeding behaviors,
            aggressive braking patterns, and dangerous acceleration curves. The
            operator reserves the right to issue punitive penalty surcharges of
            up to Ksh 5,000 per verified system telemetry warning flag.
          </p>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Clause 5 */}
        <section
          id="client-insurance"
          className="scroll-mt-12 space-y-3 rounded-2xl border border-slate-200 bg-zinc-50 p-5 py-6 dark:border-slate-800 dark:bg-zinc-950/80"
        >
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <LocalShieldIcon className="h-5! w-5! text-green-700" />
            <h3 className="text-lg font-bold">
              5. Excess Liability, Insurance Voids & Deductibles
            </h3>
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            In the event of an accident or physical impact, the Renter is liable
            to pay the standard insurance non-waivable excess deductible value
            outlined on their specific reservation booking card.
          </p>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Insurance coverage becomes entirely null and void if the accident
            occurs while the Renter is: driving off-road without 4x4
            classification clearance, driving at night in designated high-risk
            conflict zones, or operating the vehicle while violating any
            telemetry velocity or boundary parameters listed within this
            document. Under such conditions, total asset recovery repair costs
            shift directly to the Renter.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ClientRentalTerms;
