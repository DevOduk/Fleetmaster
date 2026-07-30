import CallToAction from "@/components/marketing-components/CallToAction";
import { Metadata } from "next";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import ContactFormContainer from "@/components/client-components/ContactForm";



export const metadata: Metadata = {
  title: "Contact FleetMaster - Get in Touch with Our Team",
  description: "Have questions about FleetMaster? Reach out to our support, sales, or technical teams. We're here to help you optimize your fleet management operations.",
};

export default function Page() {
  const pages = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Contact',
      href: '/contact',
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <SecondaryHero
        pages={pages}
        title="Get in touch with"
        highlightedText="Our Team"
        description="Have questions about features, setup, or scaling your enterprise operations? Drop us a message and our fleet experts will handle the rest."
      />
      <ContactFormContainer />

      {/* Dynamic CTA at the bottom */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <CallToAction />
      </div>
    </div>
  );
}