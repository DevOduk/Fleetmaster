import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import Vehicles from "@/components/vehicles/Vehicles";
import Bookings from "@/components/bookings/Bookings";
import Support from "@/components/support/SupportTicketsTable";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";

export const metadata: Metadata = {
  title:
    "Support - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};
export default function page() {
  const pages = [{ label: 'Home', href: '/' }, { label: 'Support', href: '/support' }];

  return (
    <div className="space-y-8">
      <SecondaryHero
        pages={pages}
        title="View all your"
        highlightedText="Support Tickets"
        description="Need help? Our support team is here to assist you. Browse through your support tickets, check their status, and get the assistance you need to keep your fleet running smoothly."
      />
      <br />
      <div className="container mx-auto mt-5 max-w-6xl min-h-screen">
        <Support />
      </div>
    </div>
  );
}
