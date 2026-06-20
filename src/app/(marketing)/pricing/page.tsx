import CallToAction from "@/components/marketing-components/CallToAction";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Metadata } from "next";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined"


export const metadata: Metadata = {
  title: "FleetMaster Pricing | Kenya",
  description: "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export interface PricingFeature {
  text: string;
  included: boolean;
  highlightedText?: string;
}

export interface PricingPlan {
  name: string;
  tagline: string;
  price: string;
  currency: string;
  popular: boolean;
  ctaText: string;
  ctaLink: string;
  featuresTitle: string;
  features: PricingFeature[];
}

const plans: PricingPlan[] = [
  {
    name: "Starter",
    tagline: "Solo entrepreneur, freelancer, one-person business",
    price: "450",
    currency: "Ksh",
    popular: false,
    ctaText: "Start free trial",
    ctaLink: "#",
    featuresTitle: "What you get",
    features: [
      { text: " account", included: true, highlightedText: "1 user" },
      { text: " listings", included: true, highlightedText: "50 vehicles" },
      { text: " per month", included: true, highlightedText: "100 bookings" },
      { text: "M-Pesa payment links", included: true },
      { text: "KRA eTIMS compliant receipts", included: true },
      { text: "Your own subdomain (yourname.fleetmaster.com)", included: true },
      { text: "512 MB storage", included: true },
      { text: "Fleet analytics dashboard", included: true },
      { text: "Isolated private database", included: true },
      { text: "Driver vetting", included: false },
      { text: "Expense tracking", included: false },
      { text: "Custom domain", included: false },
      { text: "SEO Optimization", included: false },
    ],
  },
  {
    name: "Pro",
    tagline: "Small team, growing agency, 2 to 5 staff",
    price: "899",
    currency: "Ksh",
    popular: true,
    ctaText: "Start free trial",
    ctaLink: "#",
    featuresTitle: "Everything in Starter, plus",
    features: [
      { text: " accounts", included: true, highlightedText: "3 user" },
      { text: " listings", included: true, highlightedText: "200 vehicles" },
      { text: " per month", included: true, highlightedText: "300 bookings" },
      { text: " (License verification)", included: true, highlightedText: "Automated Vetting" },
      { text: " (Fuel & Repairs)", included: true, highlightedText: "Expense Tracking" },
      { text: " (mybrand.com)", included: true, highlightedText: "1 custom domain" },
      { text: "2 GB storage", included: true },
      { text: "Digital rental contracts", included: true },
      { text: "Purchase orders", included: true },
      { text: "Priority support", included: true },
      { text: " SEO Optimization", included: true, highlightedText: "Basic" },
            { text: "White-label branding", included: false },
      { text: "Real-time Telematics", included: false },

    ],
  },
  {
    name: "Expert",
    tagline: "Established SME, 5 to 10 staff, no limits",
    price: "1,299",
    currency: "Ksh",
    popular: false,
    ctaText: "Get started now",
    ctaLink: "#",
    featuresTitle: "Everything in Pro, plus",
    features: [
      { text: " accounts", included: true, highlightedText: "10 user" },
      { text: " listings", included: true, highlightedText: "Unlimited" },
      { text: " bookings", included: true, highlightedText: "Unlimited" },
      { text: " expenses", included: true, highlightedText: "Unlimited" },
      { text: " custom domains", included: true, highlightedText: "Unlimited" },
      { text: "20 GB storage", included: true },
      { text: "Real-time Telematics", included: true },
      { text: "Dedicated support", included: true },
      { text: "API Access", included: true },
      { text: "White-label branding", included: true },
      { text: " SEO Optimization", included: true, highlightedText: "Advanced" },
    ],
  },
];

// Unified Matrix Definition Map to capture mismatched strings across tiers cleanly
const UNIFIED_MATRIX_CONFIG = [
  { label: "User Accounts", matchKeywords: ["user account", "user"] },
  { label: "Vehicle Listings", matchKeywords: ["vehicle", "listings"] },
  { label: "Monthly Bookings", matchKeywords: ["bookings", "booking"] },
  { label: "Driver Vetting", matchKeywords: ["vetting", "verification"] },
  { label: "Expense Tracking", matchKeywords: ["expense tracking", "expenses"] },
  { label: "Custom Domain Options", matchKeywords: ["custom domain"] },
  { label: "Cloud Storage Space", matchKeywords: ["storage"] },
  { label: "Digital Contracts", matchKeywords: ["contracts", "digital rental"] },
  { label: "M-Pesa Payment Links", matchKeywords: ["m-pesa"] },
  { label: "KRA eTIMS Compliance", matchKeywords: ["etims", "receipts"] },
  { label: "Isolated Private Database", matchKeywords: ["isolated private database"] },
  { label: "Real-time Telematics", matchKeywords: ["telematics"] },
  { label: "White-label Branding", matchKeywords: ["white-label"] },
  { label: "Customer Support Tier", matchKeywords: ["support"] },
  { label: "SEO Optimization", matchKeywords: ["seo"] },
];

const selectedIndex = 1;

export default function Page() {
  const pages = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Pricing',
      href: '/pricing',
    }
  ]

  const lightBg = 'bg-purple-500/10';
  return (
    <div className="w-full m-auto min-h-screen">
      <SecondaryHero pages={pages} title="View our" highlightedText="Pricing" description="Our prices are made for complete zero initial costs. Focus on business, we will handle the rest." >
        <Button variant="success" size="sm" endIcon={<LocalPhoneOutlinedIcon fontSize="small" />}>Talk to Us </Button>
      </SecondaryHero>
      <section className="mt-8 bg-muted/80 px-4 pb-20 pt-8 sm:mt-10 sm:px-6 sm:pt-10 lg:mt-12 lg:px-8 lg:pt-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-5 md:grid-cols-3">
          {plans?.map((plan, index) => (
            <div key={index}
              className={`relative cursor-pointer h-full flex flex-col rounded-2xl p-8 border border-brand-300 dark:border-brand-900 dark:text-white shadow-sm hover:-translate-y-5 ${selectedIndex === index ? '-translate-y-5 bg-purple-950' : 'bg-transparent'} transition-all`}
              style={{ opacity: selectedIndex === index ? 1 : 0.85 }}
            >
              <span className={`mb-4 inline-block text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-brand-400 ${selectedIndex === index ? 'text-green-500 border w-fit border-green-500 p-2 px-3 rounded-full' : 'text-black'}`}>{selectedIndex === index ? plan?.name+' plan ● Most Popular' : plan?.name+' plan'}</span>
              <h3 className={`text-lg font-bold dark:text-white ${selectedIndex === index ? 'text-white' : 'text-black'}`}>{plan?.name}</h3>
              <p className={`mt-1 mb-5 text-xs text-muted  ${selectedIndex === index ? 'text-gray-300' : 'text-muted'}`}> {plan?.tagline}</p>
              <div className="mb-1.5">
                <span className="align-top text-sm text-gray-400">{plan?.currency}</span>
                <span className={`ml-1 text-4xl font-extrabold text- dark:text-white ${selectedIndex === index ? 'text-white' : 'text-black'}`}>{plan?.price}</span>
              </div>
              <p className={`mb-6 text-xs text-muted-foreground  ${selectedIndex === index ? 'text-white' : 'text-muted'}`}>per month, billed monthly</p>
              <a
                href="#"
                className={`mb-7 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold shadow-sm ${selectedIndex === index ? 'border border-green-500 text-green-500' : 'bg-brand-500 text-white'}`}
              >
                {selectedIndex === index ? 'Get this plan':plan.ctaText}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right" aria-hidden="true">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
              <div className="border-t pt-6 border-border">
                <p className={`mb-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-gray-500  ${selectedIndex === index ? 'text-white' : 'text-black'}`}>{plan.featuresTitle}</p>
                <div className="space-y-2.5">
                  {plan?.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      {feature?.included ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check mt-0.5 shrink-0 text-brand-500" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus mt-0.5 shrink-0 text-red-500" aria-hidden="true">
                          <path d="M5 12h14"></path>
                        </svg>
                      )}
                      <span className={`text-[13px] ${selectedIndex === index ? 'text-gray-200' : 'text-muted'}`}>
                        <span 
className={`font-medium text-foreground ${!feature?.included ? 'line-through opacity-40' : ''}`}                        ><span className="font-semibold">{feature.highlightedText}</span> {feature.text}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl justify-center sm:mt-12">
          <a href="#feature-comparison" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500">
            See full comparison
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right" aria-hidden="true">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </section>

      <section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h3 className="text-amber-500 text-center" id="feature-comparison">Full Feature Comparison</h3>
          <h2 className="text-3xl mt-4 mb-3 font-bold text-black text-center dark:text-white">See exactly what you get on each plan!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-[700px] m-auto mb-5">
            Pay less, get more. From independent fleet operators to enterprise rental networks, FleetMaster lets you automate operations, track hardware diagnostics, and secure your assets.
          </p>

          <div className="mx-auto max-w-7xl bg-gray-100 dark:bg-zinc-900 p-3 px-4 rounded-2xl">
            <Table>
              <caption className="text-xs text-muted-foreground mt-2">Table 1.0: Unified comparison matrix across operational metric layouts.</caption>
              <TableHeader>
                <TableRow className="border-b border-b-gray-400">
                  <TableCell className="text-black p-2 dark:text-white font-bold">OPERATIONAL CAPABILITIES</TableCell>
                  {plans?.map((p, i) => (
                    <TableCell key={i} className={"text-black p-2 dark:text-white text-center font-bold " + (selectedIndex === i && lightBg)}>{p.name}</TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Row 1: Unified Base Price Comparison */}
                <TableRow className="hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                  <TableCell className="text-black p-3 dark:text-white font-medium">
                    <span className="text-muted-foreground mr-2 font-mono text-xs">01</span>
                    Monthly Subscription Cost
                  </TableCell>
                  {plans?.map((p, i) => (
                    <TableCell key={i} className={"p-3 text-center text-base font-extrabold text-zinc-900 dark:text-white " + (selectedIndex === i && lightBg)}>
                      <span className="text-xs font-normal text-zinc-400 mr-0.5">{p.currency}</span> {p.price}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Unified Feature Matrix Mapping */}
                {UNIFIED_MATRIX_CONFIG.map((row, index) => (
                  <TableRow key={index} className="hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                    {/* Unified Label Column */}
                    <TableCell className="text-black p-3 dark:text-white font-medium">
                      <span className="text-muted-foreground mr-2 text-xs font-mono">{(index + 2).toString().padStart(2, '0')}</span>
                      {row.label}
                    </TableCell>

                    {/* Dynamic Unified Values Matrix Columns */}
                    {plans.map((plan, planIndex) => {
                      // Find the "best" feature definition cumulatively (Starter -> Pro -> Expert)
                      // If a feature is included in a lower tier, it persists unless upgraded or overridden
                      let targetFeature = null;

                      // Search from current plan downwards to find the first inclusion
                      for (let j = planIndex; j >= 0; j--) {
                        const found = plans[j].features.find((f) => {
                          const fullText = `${f.highlightedText || ''} ${f.text}`.toLowerCase();
                          return row.matchKeywords.some((keyword) => fullText.includes(keyword));
                        });
                        if (found?.included) {
                          targetFeature = found;
                          break;
                        }
                      }

                      if (!targetFeature) {
                        return (
                          <TableCell key={planIndex} className={"p-3 text-center " + (selectedIndex === planIndex && lightBg)}>
                            <span className="inline-block w-3 h-0.5 bg-red-500/60 rounded-full vertical-middle" title="Not available in this tier"></span>
                          </TableCell>
                        );
                      }

                      // 2. Resolve clear metric strings ("1 user", "Unlimited", "300 invoices") dynamically
                      let displayValue: React.ReactNode = "";

                      if (targetFeature.highlightedText) {
                        // Strip out raw descriptive suffixes like "accounts" or "leads" to yield a cleaner table cell
                        let cleanHighlight = targetFeature.highlightedText.replace(/(user|accounts|bookings|vehicles|listings|expenses|custom domain)/gi, "").trim();

                        // If cleaning removed everything (e.g. "Custom domain" -> ""), keep the original or show "Yes"
                        if (!cleanHighlight) cleanHighlight = targetFeature.highlightedText;

                        displayValue = <span className="font-bold text-zinc-900 dark:text-zinc-100 capitalize">{cleanHighlight}</span>;
                      } else if (targetFeature.text.toLowerCase().includes("priority")) {
                        displayValue = <span className="font-bold text-zinc-900 dark:text-zinc-100">Priority</span>;
                      } else if (targetFeature.text.toLowerCase().includes("dedicated")) {
                        displayValue = <span className="font-bold text-zinc-900 dark:text-zinc-100">Dedicated</span>;
                      }
                      //  else if (targetFeature.text.toLowerCase().includes("subdomain")) {
                      //   displayValue = <span className="text-xs text-zinc-500">Subdomain</span>;
                      // }
                       else {
                        displayValue = (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 mx-auto">
                            <path d="M20 6 9 17l-5-5"></path>
                          </svg>
                        );
                      }

                      return (
                        <TableCell key={planIndex} className={"p-3 text-center text-sm text-zinc-700 dark:text-zinc-300 " + (selectedIndex === planIndex && lightBg)}>
                          {displayValue}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <CallToAction />
    </div>
  );
}