import { Metadata } from "next";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import ClientBookingContent from "@/components/marketing-components/ClientBookingContent";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View and manage your Oduk CarHire bookings.",
};

export default async function Page() {
  const pages = [{ label: 'Home', href: '/' }, { label: 'My Bookings', href: '/bookings' }];
  

  return (
    <div className="min-h-screen py-8">
      <SecondaryHero
        pages={pages}
        title="View all your"
        highlightedText="Bookings"
        description="Monitor your fleet performance and track your active rentals."
      />

      {/* Pass the server-fetched data as a prop */}
      <ClientBookingContent  />
    </div>
  );
}