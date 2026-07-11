"use client"
import Button from "@/components/ui/button/Button";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined"
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
        description: "All vehicles must be covered by a valid Comprehensive Insurance policy to protect your asset throughout the leasing period.",
        icon: <VerifiedUserOutlinedIcon className="text-amber-500" />
    },
    {
        title: "Vehicle Tracking",
        description: "For security and transparency, owners are required to install a GPS tracker of their choice to monitor vehicle location and usage in real-time.",
        icon: <GpsFixedOutlinedIcon className="text-amber-500" />
    },
    {
        title: "Monthly Payouts",
        description: "Earn consistent monthly income. Payout rates are determined based on your vehicle's model, manufacturing year, and overall mechanical condition.",
        icon: <PaymentsOutlinedIcon className="text-amber-500" />
    },
    {
        title: "Maintenance Coverage",
        description: "We handle the stress of upkeep. Oduk CarHire covers minor maintenance, routine oil changes, wheel alignments, and periodic tire replacements.",
        icon: <BuildOutlinedIcon className="text-amber-500" />
    }
];




const ACCEPTED_VEHICLES = [
    { make: "Toyota", models: ["Fielder", "Axio", "Voxy", "Noah", "Prado", "Land Cruiser"] },
    { make: "Nissan", models: ["Note", "Sylphy", "X-Trail", "Juke"] },
    { make: "Honda", models: ["Fit", "Insight", "Vezel"] },
    { make: "Mazda", models: ["Demio", "CX-5"] },
];

export default function LeasingCheck() {
    const pages = [{ label: 'Home', href: '/' }, { label: 'Lease with Us', href: '/lease' }];
    const { tenant } = useTenant();

    console.log(tenant)
    return (
        <div className="min-h-screen py-8">
            {
                tenant?.leasing_accepted ? (
                    <>
                        <SecondaryHero
                            pages={pages}
                            title="Lease with us &"
                            highlightedText="Start Earning Today"
                            description="Ready to monetize your vehicle? Our fleet experts are here to guide you through the seamless leasing process."
                        />

                        {/* Verification Criteria Section */}
                        <section className="container mx-auto mt-10 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                            <h3 className="text-xl font-bold mb-6 text-black dark:text-white">Vehicle Eligibility Criteria</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    "Manufacturing year: 2015 or newer",
                                    "Odometer reading: Less than 120,000 KM",
                                    "Valid Comprehensive Insurance",
                                    "Clean interior and exterior condition",
                                    "All mechanical service records available"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-400 text-sm">
                                        <CheckCircleOutlineOutlinedIcon className="text-green-500" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Vehicle Makes & Models Grid */}
                        <section className="container mx-auto mt-10 px-4">
                            <h3 className="text-xl font-bold mb-6 text-black dark:text-white">Vehicles We Are Currently Leasing</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {ACCEPTED_VEHICLES.map((v) => (
                                    <div key={v.make} className="p-4 border rounded-xl dark:border-gray-700 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DirectionsCarOutlinedIcon className="text-amber-600" />
                                            <h4 className="font-bold text-amber-600">{v.make}</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{v.models.join(", ")}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Existing Content */}
                        <div className="grid items-center container m-auto mt-10 grid-cols-1 lg:grid-cols-12 gap-5 p-4">
                            <div className="lg:col-span-6">
                                <img className="rounded-3xl shadow-lg" src='https://www.pigiame.co.ke/discover/wp-content/uploads/2025/06/Car-Hire-Nairobi.jpg' alt="lease" />
                            </div>
                            <div className="lg:col-span-6">
                                <h3 className="text-amber-500">LEASE WITH US</h3>
                                <h2 className="text-3xl mt-2 mb-3 font-bold text-black dark:text-white">Start earning today</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    At Oduk CarHire, we value high-standard vehicles. If your car meets our eligibility criteria above,
                                    we provide the platform, the insurance, and the clients to ensure your vehicle works for you.
                                </p>
                                <div className="flex gap-3 mt-5">
                                    <Link href={`tel:${tenant.phone || '#'}`}>
                                        <Button variant="success" size="sm">Enquire <PhoneEnabledOutlinedIcon fontSize="small" /></Button>
                                    </Link>
                                    <Link href={`mailto:${tenant.email || '#'}`}>
                                        <Button variant="primary" size="sm">Send an Email <EmailOutlinedIcon fontSize="small" /></Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <LeaseInput />

                        <section className="container mx-auto mt-16 px-4">
                            <h3 className="text-center text-amber-500 mb-2">PARTNERSHIP TERMS</h3>
                            <h2 className="text-3xl text-center font-bold mb-12 text-black dark:text-white">What You Need to Know</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {KEY_POINTS.map((point, idx) => (
                                    <div key={idx} className="flex flex-col items-center text-center p-6 border dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="mb-4 p-3 bg-amber-50 dark:bg-gray-700 rounded-full">
                                            {point.icon}
                                        </div>
                                        <h4 className="font-bold text-lg mb-2 text-black dark:text-white">{point.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{point.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        <div className="grid items-center container m-auto mt-10 mb-9 grid-cols-1 lg:grid-cols-12 gap-5 p-4">
                            <div className="lg:col-span-6">
                                <img className="rounded-3xl shadow-lg" src='https://www.pigiame.co.ke/discover/wp-content/uploads/2025/06/Car-Hire-Nairobi.jpg' alt="lease" />
                            </div>
                            <div className="lg:col-span-6">
                                <h3 className="text-amber-500">LEASE WITH US</h3>
                                <h2 className="text-3xl mt-2 mb-3 font-bold text-black dark:text-white">Start earning today</h2>
                                <p className="text-sm text-gray-400 max-w-175">
                                    Unfortunately we are not accepting leases at the moment. This page will be updated once a leasing agreement has been made! Thank you.
                                </p>
                                <p className="text-sm mt-3 italic text-gray-500 max-w-175">
                                    Management!
                                </p>
                                <div className="flex gap-3 mt-5">
                                    <Link href={`tel:${tenant.phone || '#'}`}>
                                        <Button variant="success" size="sm">Enquire <PhoneEnabledOutlinedIcon fontSize="small" /></Button>
                                    </Link>
                                    <Link href={`mailto:${tenant.email || '#'}`}>
                                        <Button variant="primary" size="sm">Send an Email <EmailOutlinedIcon fontSize="small" /></Button>
                                    </Link>
                                </div>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4">
                            {/* 2. Swapped col-5 for col-span-5 */}
                            <div className="lg:col-span-5">
                                <h3 className="text-amber-500">For all Activities</h3>
                                <h2 className="text-3xl mt-4 mb-3 font-bold text-black dark:text-white">Explore all Categories</h2>
                                {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-175">
                                    Browse our extensive collection of well-maintained vehicles across diverse locations. From compact cars to luxury sedans, we have the perfect vehicle for your needs.
                                </p>
                            </div>

                            {/* 3. Swapped col-7 for col-span-7 */}
                            <div className="lg:col-span-7">
                                <ViewAllCategories tenantData={tenant} />
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
}