import RequestDemo from "@/components/auth/RequestDemo";
import CallToAction from "@/components/marketing-components/CallToAction";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Demo | FleetMaster - Fleet Hardware & GPS Trackers",
  description: "Equip your fleet with commercial-grade vehicle hardware. Purchase pre-configured wired GPS trackers, magnetic asset trackers, and advanced fuel telemetry sensors fully integrated with your FleetMaster dashboard.",
};

export default function RequestDemoPage() {
  return (
    <div>
      <div className="min-h-[80vh] flex flex-col lg:flex-row-reverse items-center mx-auto container gap-5 grid-cols-1">
        <div className="flex flex-col flex-1 lg:w-1/2 w-full max-w-5xl bg-zinc-900 rounded-t-2xl border-x border-t border-gray-200 dark:border-gray-600 shadow-2xl p-2">

          {/* Top Bar Window Decorations */}
          <div className="px-4 py-3 bg-zinc-900 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>

          {/* Simulating Internal Dashboard Content */}
          <div className="relative w-full">
            <img
              src="/images/product/light_app.localhost.png"
              alt="Product Dashboard Mockup"
              // sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover w-full block dark:hidden object-top rounded-t-xl border-0 rounded"
            />
            <img
              src="/images/product/dark_app.localhost.png"
              alt="Product Dashboard Mockup"
              // sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover w-full hidden dark:block object-top rounded-t-xl border-0 rounded"
            />
          </div>
        </div>

        <RequestDemo />
      </div>

      <CallToAction />
    </div>
  );
}
