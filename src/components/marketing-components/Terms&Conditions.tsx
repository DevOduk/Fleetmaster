"use client";

import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ScaleIcon from "@mui/icons-material/Scale";
import ShieldIcon from "@mui/icons-material/Shield";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ConstructionIcon from "@mui/icons-material/Construction";
import GavelIcon from "@mui/icons-material/Gavel";

interface TermSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TermsConditions: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("acceptance");

  const legalSections: TermSection[] = [
    { id: "acceptance", title: "1. Acceptance of Terms", icon: ScaleIcon },
    { id: "liability", title: "2. Absolute Liability & Telemetry Limits", icon: ShieldIcon },
    { id: "installation", title: "3. Hardware Deployment & Tampering", icon: ConstructionIcon },
    { id: "booking", title: "4. Scheduling & Overbooking Realities", icon: CalendarMonthIcon },
    { id: "payments", title: "5. M-PESA & Ledger Reconciliation", icon: AccountBalanceWalletIcon },
    { id: "governing-law", title: "6. Jurisdiction & Kenyan Law", icon: GavelIcon },
  ];

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-12 max-w-6xl">
      
      {/* LEFT SIDEBAR: Interactive Tracer Navigation Links */}
      <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-22 h-fit space-y-2">
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-3">
            Agreement Navigation
          </p>
          <nav className="space-y-1">
            {legalSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleScrollTo(section.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-amber-500 text-white shadow-sm shadow-amber-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`!w-4 !h-4 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                    <span>{section.title}</span>
                  </div>
                  <ChevronRightIcon className={`!w-4 !h-4 opacity-70 transition-transform ${isActive ? "translate-x-0.5" : ""}`} />
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Watertight Legal Document Content clauses */}
      <div className="space-y-10 text-sm leading-7 text-slate-700 dark:text-slate-300 col-span-12 lg:col-span-8">
        
        {/* Clause 1 */}
        <section id="acceptance" className="space-y-3 scroll-mt-12">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <ScaleIcon className="text-amber-500 !w-5 !h-5" />
            <h3 className="text-lg font-bold">1. Acceptance of Operational Terms</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-7">
            By accessing, creating administrative accounts, or utilizing this unified fleet management ecosystem—including its automated reservation tables, scheduling matrices, user dashboards, and integrated payment pathways—you express absolute consent to be legally bound by these conditions. 
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-7">
            This framework operates explicitly as an administrative system for vehicle hire platforms, car rental operators, safaris, and transport logistics businesses. If you do not accept these terms in their entirety, you are forbidden from utilizing our software infrastructure or purchasing related tracking hardware accessories.
          </p>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Clause 2 */}
        <section id="liability" className="space-y-3 scroll-mt-12 bg-green-100/40 dark:bg-green-900/30 p-5 rounded-2xl border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <ShieldIcon className="!w-5 !h-5" />
            <h3 className="text-lg font-bold">2. Absolute Limitation of Liability & Telemetry Indemnity</h3>
          </div>
          <p className="font-semibold text-sm leading-7 text-amber-700 dark:text-amber-500 uppercase tracking-wide">
            CRITICAL GUARANTEE BREAKDOWN & DISCLAIMER:
          </p>
          <p className="text-slate-700 dark:text-slate-400 text-sm leading-7">
            The platform software layer functions primarily as an operational database. While integrated hardware modules provide active GPS streaming metrics, no system is infallible. FleetMaster gives absolutely <strong>no guarantees of physical asset asset recovery or constant anti-theft security lines.</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
            <li>
              <strong>No Liability for Asset Losses:</strong> The service providers, developers, and corporate entities behind FleetMaster accept zero legal or financial liability for the loss, auto-theft, localized carjacking, systemic vandalism, state impoundment, road traffic crashes, or complete destruction of any vehicle, device, or cargo item monitored inside the system.
            </li>
            <li>
              <strong>Operational Contingency:</strong> Telemetry systems rely explicitly on third-party mobile telecommunication cellular networks (Safaricom, Airtel, Telkom) and global satellite networks. Dropped signals, network interference, or structural blockages (e.g., parking garages) that impede real-time location streaming or remote engine cutoff execution fall outside our scope of control.
            </li>
            <li>
              <strong>Insurance Requirements:</strong> The legal obligation to maintain active comprehensive commercial vehicle insurance, transport covers, and local regulatory licenses falls completely upon the business owner/operator.
            </li>
          </ul>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Clause 3 */}
        <section id="installation" className="space-y-3 scroll-mt-12">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <ConstructionIcon className="text-amber-500 !w-5 !h-5" />
            <h3 className="text-lg font-bold">3. Hardware Deployment, Installation & Driver Tampering</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-7">
            Where vehicle owners purchase physical tracking hardware (e.g., FMX-100 Wired Tracker, Fuel Level Sensors, or OBD-II Dongles), the following regulations protect structural integrity:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
            <li>
              <strong>Installation Risks:</strong> While technical team field experts offer deployment installation aid within Nairobi and extended Kenyan hubs, the system operator assumes risks associated with modifying factory wire harnesses. FleetMaster is not responsible for voided auto manufacturer warranties or electrical short-circuits.
            </li>
            <li>
              <strong>Driver Malicious Tampering:</strong> Smart hardware can be compromised through manual battery wire snipping, shielding via metal foils, or signal jamming rigs used by rogue clients. FleetMaster is not responsible if a tracker is manually bypassed or goes offline due to physical tampering.
            </li>
          </ul>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Clause 4 */}
        <section id="booking" className="space-y-3 scroll-mt-12">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <CalendarMonthIcon className="text-amber-500 !w-5 !h-5" />
            <h3 className="text-lg font-bold">4. Booking Management & Calendar Accuracy</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-7">
            Our scheduling calendar enforces booking guardrails using chronological database constraints calculated from your input. The administrative operator maintains total accountability for configuring realistic buffer windows and rental turnarounds.
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-7">
            FleetMaster shall not be held liable for lost business revenue, client dissatisfaction, double-bookings, or operational disruptions stemming from manual scheduling data flaws or incorrect time zone settings.
          </p>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Clause 5 */}
        <section id="payments" className="space-y-3 scroll-mt-12">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <AccountBalanceWalletIcon className="text-amber-500 !w-5 !h-5" />
            <h3 className="text-lg font-bold">5. Integrated Payments & Financial Reconciliation</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-7">
            Automated payment verification triggers (such as M-PESA Daraja C2B/STK Push integration hooks) exist to streamline workflow logging. However, API handshakes can experience delays due to national telco gateway adjustments or downtime.
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-7 font-semibold">
            Operators must independently verify final liquidity clearance via their official Safaricom Business / Liya / Bank corporate portal interfaces before releasing any vehicle keys to a customer.
          </p>
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Clause 6 */}
        <section id="governing-law" className="space-y-3 scroll-mt-12">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <GavelIcon className="text-amber-500 !w-5 !h-5" />
            <h3 className="text-lg font-bold">6. Governing Law & Dispute Resolution</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-7">
            These operational terms and agreements are formulated, governed by, and interpreted strictly under the laws of the **Republic of Kenya**. 
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-7">
            Any administrative disputes, service tier failures, or data claims relating directly to software execution shall be submitted exclusively to local mediation arbitrations within Nairobi, Kenya, before launching external litigation avenues.
          </p>
        </section>

        <p className="mt-10 text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 dark:text-gray-600">
          Last Updated: v1.1.0, 30-june-2026
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;