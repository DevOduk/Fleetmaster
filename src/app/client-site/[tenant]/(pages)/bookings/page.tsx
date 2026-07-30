import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import ClientBookingContent from "@/components/marketing-components/ClientBookingContent";

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

      <ClientBookingContent  />
    </div>
  );
}