import RequestDemo from "@/components/auth/RequestDemo";
import CallToAction from "@/components/marketing-components/CallToAction";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Request Demo | FleetMaster - Fleet Hardware & GPS Trackers",
  description:
    "Equip your fleet with commercial-grade vehicle hardware. Purchase pre-configured wired GPS trackers, magnetic asset trackers, and advanced fuel telemetry sensors fully integrated with your FleetMaster dashboard.",
};

export default function RequestDemoPage() {
  return (
    <div>
      <div className="container mx-auto flex min-h-[80vh] grid-cols-1 flex-col items-center gap-5 lg:flex-row-reverse">
        <div className="flex w-full max-w-5xl flex-1 flex-col rounded-t-2xl border-x border-t border-gray-200 bg-zinc-900 p-2 shadow-2xl lg:w-1/2 dark:border-gray-600">
          {/* Top Bar Window Decorations */}
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-3">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>

          {/* Simulating Internal Dashboard Content */}
          <div className="relative w-full aspect-video">
            <Image
              src="/images/product/light_app.localhost.png"
              alt="Product Dashboard Mockup"
              preload
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              className="block w-full rounded rounded-t-xl border-0 object-cover object-top dark:hidden"
            />
            <Image
              src="/images/product/dark_app.localhost.png"
              alt="Product Dashboard"
              preload
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              className="hidden w-full rounded rounded-t-xl border-0 object-cover object-top dark:block"
            />
          </div>
        </div>

        <RequestDemo />
      </div>

      <CallToAction />
    </div>
  );
}
