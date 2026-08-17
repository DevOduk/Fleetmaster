"use client";
import Button from "@/components/ui/button/Button";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import LeaseInput from "@/components/client-components/LeaseInput";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import GpsFixedOutlinedIcon from "@mui/icons-material/GpsFixedOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import { useTenant } from "@/context/TenantContext";
import ViewAllCategories from "./categories";
import Link from "next/link";

const KEY_POINTS = [
  {
    title: "Insurance Requirements",
    description:
      "All vehicles must be covered by a valid Comprehensive Insurance policy to protect your asset throughout the leasing period.",
    icon: <VerifiedUserOutlinedIcon className="text-amber-500" />,
  },
  {
    title: "Vehicle Tracking",
    description:
      "For security and transparency, owners are required to install a GPS tracker of their choice to monitor vehicle location and usage in real-time.",
    icon: <GpsFixedOutlinedIcon className="text-amber-500" />,
  },
  {
    title: "Monthly Payouts",
    description:
      "Earn consistent monthly income. Payout rates are determined based on your vehicle's model, manufacturing year, and overall mechanical condition.",
    icon: <PaymentsOutlinedIcon className="text-amber-500" />,
  },
  {
    title: "Maintenance Coverage",
    description:
      "We handle the stress of upkeep. Oduk CarHire covers minor maintenance, routine oil changes, wheel alignments, and periodic tire replacements.",
    icon: <BuildOutlinedIcon className="text-amber-500" />,
  },
];

const ACCEPTED_VEHICLES = [
  {
    make: "Toyota",
    models: ["Fielder", "Axio", "Voxy", "Noah", "Prado", "Land Cruiser"],
  },
  { make: "Nissan", models: ["Note", "Sylphy", "X-Trail", "Juke"] },
  { make: "Honda", models: ["Fit", "Insight", "Vezel"] },
  { make: "Mazda", models: ["Demio", "CX-5"] },
];

export default function LeasingCheck() {
  const pages = [
    { label: "Home", href: "/" },
    { label: "Lease with Us", href: "/lease" },
  ];
  const { tenant } = useTenant();

  console.log(tenant);
  return (
    <div className="min-h-screen py-8">
      {tenant?.leasing_accepted ? (
        <>
          <SecondaryHero
            pages={pages}
            title="Lease with us &"
            highlightedText="Start Earning Today"
            description="Ready to monetize your vehicle? Our fleet experts are here to guide you through the seamless leasing process."
          />

          {/* Verification Criteria Section */}
          <section className="container mx-auto mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-6 text-xl font-bold text-black dark:text-white">
              Vehicle Eligibility Criteria
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Manufacturing year: 2015 or newer",
                "Odometer reading: Less than 120,000 KM",
                "Valid Comprehensive Insurance",
                "Clean interior and exterior condition",
                "All mechanical service records available",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-400"
                >
                  <CheckCircleOutlineOutlinedIcon className="text-green-500" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Vehicle Makes & Models Grid */}
          <section className="container mx-auto mt-10 px-4">
            <h3 className="mb-6 text-xl font-bold text-black dark:text-white">
              Common vehicles Currently Leasing
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {ACCEPTED_VEHICLES.map((v) => (
                <div
                  key={v.make}
                  className="rounded-xl border p-4 shadow-sm dark:border-gray-700"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <DirectionsCarOutlinedIcon className="text-amber-600" />
                    <h4 className="font-bold text-amber-600">{v.make}</h4>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {v.models.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Existing Content */}
          <div className="container m-auto mt-10 grid grid-cols-1 items-center gap-5 p-4 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <img
                className="rounded-3xl shadow-lg"
                src="https://www.pigiame.co.ke/discover/wp-content/uploads/2025/06/Car-Hire-Nairobi.jpg"
                alt="lease"
              />
            </div>
            <div className="lg:col-span-6">
              <h3 className="text-amber-500">LEASE WITH US</h3>
              <h2 className="mt-2 mb-3 text-3xl font-bold text-black dark:text-white">
                Start earning today
              </h2>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                At Oduk CarHire, we value high-standard vehicles. If your car
                meets our eligibility criteria above, we provide the platform,
                the insurance, and the clients to ensure your vehicle works for
                you.
              </p>
              <div className="mt-5 flex gap-3">
                <Link href={`tel:${tenant.phone || "#"}`}>
                  <Button variant="success" size="sm">
                    Enquire <PhoneEnabledOutlinedIcon fontSize="small" />
                  </Button>
                </Link>
                <Link href={`mailto:${tenant.email || "#"}`}>
                  <Button variant="primary" size="sm">
                    Send an Email <EmailOutlinedIcon fontSize="small" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <LeaseInput />

          <section className="container mx-auto mt-16 px-4">
            <h3 className="mb-2 text-center text-amber-500">
              PARTNERSHIP TERMS
            </h3>
            <h2 className="mb-12 text-center text-3xl font-bold text-black dark:text-white">
              What You Need to Know
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {KEY_POINTS.map((point, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center rounded-2xl border bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md dark:border-gray-600 dark:bg-gray-900"
                >
                  <div className="mb-4 rounded-full bg-amber-50 p-3 dark:bg-gray-700">
                    {point.icon}
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-black dark:text-white">
                    {point.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <div className="container m-auto mt-10 mb-9 grid grid-cols-1 items-center gap-5 p-4 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <img
                className="rounded-3xl shadow-lg"
                src="https://www.pigiame.co.ke/discover/wp-content/uploads/2025/06/Car-Hire-Nairobi.jpg"
                alt="lease"
              />
            </div>
            <div className="lg:col-span-6">
              <h3 className="text-amber-500">LEASE WITH US</h3>
              <h2 className="mt-2 mb-3 text-3xl font-bold text-black dark:text-white">
                Start earning today
              </h2>
              <p className="max-w-175 text-sm text-gray-400">
                Unfortunately we are not accepting leases at the moment. This
                page will be updated once a leasing agreement has been made!
                Thank you.
              </p>
              <p className="mt-3 max-w-175 text-sm text-gray-500 italic">
                Management!
              </p>
              <div className="mt-5 flex gap-3">
                <Link href={`tel:${tenant.phone || "#"}`}>
                  <Button variant="success" size="sm">
                    Enquire <PhoneEnabledOutlinedIcon fontSize="small" />
                  </Button>
                </Link>
                <Link href={`mailto:${tenant.email || "#"}`}>
                  <Button variant="primary" size="sm">
                    Send an Email <EmailOutlinedIcon fontSize="small" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-12">
            {/* 2. Swapped col-5 for col-span-5 */}
            <div className="lg:col-span-5">
              <h3 className="text-amber-500">For all Activities</h3>
              <h2 className="mt-4 mb-3 text-3xl font-bold text-black dark:text-white">
                Explore all Categories
              </h2>
              {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
              <p className="max-w-175 text-sm text-gray-500 dark:text-gray-400">
                Browse our extensive collection of well-maintained vehicles
                across diverse locations. From compact cars to luxury sedans, we
                have the perfect vehicle for your needs.
              </p>
            </div>

            {/* 3. Swapped col-7 for col-span-7 */}
            <div className="lg:col-span-7">
              <ViewAllCategories tenantData={tenant} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
