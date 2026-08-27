import CallToAction from "@/components/marketing-components/CallToAction";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Metadata } from "next";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { subscriptionPlans } from "@/data/globalExports";

export const metadata: Metadata = {
  title: "Pricing | FleetMaster - Fleet Management Solution",
  description:
    "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

// Unified Matrix Definition Map to capture mismatched strings across tiers cleanly
const UNIFIED_MATRIX_CONFIG = [
  { label: "User Accounts", matchKeywords: ["user account", "user"] },
  { label: "Vehicle Listings", matchKeywords: ["vehicle", "listings"] },
  { label: "Driver Vetting", matchKeywords: ["vetting", "verification"] },
  {
    label: "Expense Tracking",
    matchKeywords: ["expense tracking", "expenses"],
  },
  { label: "Custom Domain Options", matchKeywords: ["custom domain"] },
  { label: "Cloud Storage Space", matchKeywords: ["storage"] },
  {
    label: "Digital Contracts",
    matchKeywords: ["contracts", "digital rental"],
  },
  { label: "M-Pesa Payment Links", matchKeywords: ["m-pesa"] },
  { label: "KRA eTIMS Compliance", matchKeywords: ["etims", "receipts"] },
  {
    label: "Isolated Private Database",
    matchKeywords: ["isolated private database"],
  },
  { label: "Real-time Telematics", matchKeywords: ["telematics"] },
  { label: "White-label Branding", matchKeywords: ["white-label"] },
  { label: "Customer Support Tier", matchKeywords: ["support"] },
  { label: "SEO Optimization", matchKeywords: ["seo"] },
];

const selectedIndex = 1;

export default function Page() {
  const pages = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
  ];

  const lightBg = "bg-purple-500/10";
  return (
    <div className="m-auto min-h-screen w-full">
      <SecondaryHero
        pages={pages}
        title="View our"
        highlightedText="Pricing"
        className="dark:bg-zinc-950"
        description="Our prices are made for complete zero initial costs. Focus on business, we will handle the software hassles. Flexible plans tailored to your fleet management needs, from startup to enterprise scale."
      >
        <Button
          variant="success"
          size="sm"
          endIcon={<LocalPhoneOutlinedIcon fontSize="small" />}
        >
          Talk to Us{" "}
        </Button>
      </SecondaryHero>
      <section className="bg-muted/80 mt-8 px-4 pt-8 pb-20 sm:mt-10 sm:px-6 sm:pt-10 lg:mt-12 lg:px-8 lg:pt-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-5 md:grid-cols-3">
          {subscriptionPlans?.map((plan, index) => (
            <div
              key={index}
              className={`border-brand-300 dark:border-brand-900 relative flex h-full cursor-pointer flex-col rounded-2xl border p-8 shadow-sm hover:-translate-y-5 dark:text-white ${selectedIndex === index ? "-translate-y-5 bg-purple-950" : "bg-transparent"} transition-all`}
              style={{ opacity: selectedIndex === index ? 1 : 0.85 }}
            >
              <span
                className={`text-muted-foreground text-brand-400 mb-4 inline-block text-[10px] font-bold tracking-widest uppercase ${selectedIndex === index ? "w-fit rounded-full border border-green-500 p-2 px-3 text-green-500" : "text-black"}`}
              >
                {selectedIndex === index
                  ? plan?.name + " plan ● Most Popular"
                  : plan?.name + " plan"}
              </span>
              <h3
                className={`text-lg font-bold dark:text-white ${selectedIndex === index ? "text-white" : "text-black"}`}
              >
                {plan?.name}
              </h3>
              <p
                className={`text-muted mt-1 mb-5 text-xs ${selectedIndex === index ? "text-gray-300" : "text-muted"}`}
              >
                {" "}
                {plan?.tagline}
              </p>
              <div className="mb-1.5">
                <span className="align-top text-sm text-gray-400">
                  {plan?.currency}
                </span>
                <span
                  className={`text- ml-1 text-4xl font-extrabold dark:text-white ${selectedIndex === index ? "text-white" : "text-black"}`}
                >
                  {plan?.price}
                </span>
              </div>
              <p
                className={`text-muted-foreground mb-6 text-xs ${selectedIndex === index ? "text-white" : "text-muted"}`}
              >
                per month, billed monthly
              </p>
              <a
                href="#"
                className={`mb-7 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold shadow-sm ${selectedIndex === index ? "border border-green-500 text-green-500" : "bg-brand-500 text-white"}`}
              >
                {selectedIndex === index ? "Get this plan" : plan.ctaText}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-right"
                  aria-hidden="true"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
              <div className="border-border border-t pt-6">
                <p
                  className={`text-muted-foreground mb-4 text-[10px] font-semibold tracking-wider uppercase dark:text-gray-500 ${selectedIndex === index ? "text-white" : "text-black"}`}
                >
                  {plan.featuresTitle}
                </p>
                <div className="space-y-2.5">
                  {plan?.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      {feature?.included ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-check text-brand-500 mt-0.5 shrink-0"
                          aria-hidden="true"
                        >
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-minus mt-0.5 shrink-0 text-red-500"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14"></path>
                        </svg>
                      )}
                      <span
                        className={`text-[13px] ${selectedIndex === index ? "text-gray-200" : "text-muted"}`}
                      >
                        <span
                          className={`text-foreground font-medium ${!feature?.included ? "line-through opacity-40" : ""}`}
                        >
                          <span className="font-semibold">
                            {feature.highlightedText}
                          </span>{" "}
                          {feature.text}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl justify-center sm:mt-12">
          <a
            href="#feature-comparison"
            className="text-brand-500 inline-flex items-center gap-2 text-sm font-semibold"
          >
            See full comparison
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right"
              aria-hidden="true"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </section>

      <section>
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <h3 className="text-center text-amber-500" id="feature-comparison">
            Full Feature Comparison
          </h3>
          <h2 className="mt-4 mb-3 text-center text-3xl font-bold text-black dark:text-white">
            See exactly what you get on each plan!
          </h2>
          <p className="m-auto mb-5 max-w-175 text-center text-sm text-gray-500 dark:text-gray-400">
            Pay less, get more. From independent fleet operators to enterprise
            rental networks, FleetMaster lets you automate operations, track
            hardware diagnostics, and secure your assets.
          </p>

          <div className="mx-auto max-w-7xl rounded-2xl bg-gray-100 p-3 px-4 dark:bg-zinc-900">
            <Table>
              <caption className="text-muted-foreground mt-2 text-xs">
                Table 1.0: Unified comparison matrix across operational metric
                layouts.
              </caption>
              <TableHeader>
                <TableRow className="border-b border-b-gray-400">
                  <TableCell className="p-2 font-bold text-black dark:text-white">
                    OPERATIONAL CAPABILITIES
                  </TableCell>
                  {subscriptionPlans?.map((p, i) => (
                    <TableCell
                      key={i}
                      className={
                        "p-2 text-center font-bold text-black dark:text-white " +
                        (selectedIndex === i && lightBg)
                      }
                    >
                      {p.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Row 1: Unified Base Price Comparison */}
                <TableRow className="border-b border-zinc-200 hover:bg-zinc-200/50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
                  <TableCell className="p-3 font-medium text-black dark:text-white">
                    <span className="text-muted-foreground mr-2 font-mono text-xs">
                      01
                    </span>
                    Monthly Subscription Cost
                  </TableCell>
                  {subscriptionPlans?.map((p, i) => (
                    <TableCell
                      key={i}
                      className={
                        "p-3 text-center text-base font-extrabold text-zinc-900 dark:text-white " +
                        (selectedIndex === i && lightBg)
                      }
                    >
                      <span className="mr-0.5 text-xs font-normal text-zinc-400">
                        {p.currency}
                      </span>{" "}
                      {p.price}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Unified Feature Matrix Mapping */}
                {UNIFIED_MATRIX_CONFIG.map((row, index) => (
                  <TableRow
                    key={index}
                    className="border-b border-zinc-200 hover:bg-zinc-200/50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                  >
                    {/* Unified Label Column */}
                    <TableCell className="p-3 font-medium text-black dark:text-white">
                      <span className="text-muted-foreground mr-2 font-mono text-xs">
                        {(index + 2).toString().padStart(2, "0")}
                      </span>
                      {row.label}
                    </TableCell>

                    {/* Dynamic Unified Values Matrix Columns */}
                    {subscriptionPlans.map((plan, planIndex) => {
                      // Find the "best" feature definition cumulatively (Starter -> Pro -> Expert)
                      // If a feature is included in a lower tier, it persists unless upgraded or overridden
                      let targetFeature = null;

                      // Search from current plan downwards to find the first inclusion
                      for (let j = planIndex; j >= 0; j--) {
                        const found = subscriptionPlans[j].features.find(
                          (f) => {
                            const fullText =
                              `${f.highlightedText || ""} ${f.text}`.toLowerCase();
                            return row.matchKeywords.some((keyword) =>
                              fullText.includes(keyword),
                            );
                          },
                        );
                        if (found?.included) {
                          targetFeature = found;
                          break;
                        }
                      }

                      if (!targetFeature) {
                        return (
                          <TableCell
                            key={planIndex}
                            className={
                              "p-3 text-center " +
                              (selectedIndex === planIndex && lightBg)
                            }
                          >
                            <span
                              className="vertical-middle inline-block h-0.5 w-3 rounded-full bg-red-500/60"
                              title="Not available in this tier"
                            ></span>
                          </TableCell>
                        );
                      }

                      // 2. Resolve clear metric strings ("1 user", "Unlimited", "300 invoices") dynamically
                      let displayValue: React.ReactNode = "";

                      if (targetFeature.highlightedText) {
                        // Strip out raw descriptive suffixes like "accounts" or "leads" to yield a cleaner table cell
                        let cleanHighlight = targetFeature.highlightedText
                          .replace(
                            /(user|accounts|bookings|vehicles|listings|expenses|custom domain)/gi,
                            "",
                          )
                          .trim();

                        // If cleaning removed everything (e.g. "Custom domain" -> ""), keep the original or show "Yes"
                        if (!cleanHighlight)
                          cleanHighlight = targetFeature.highlightedText;

                        displayValue = (
                          <span className="font-bold text-zinc-900 capitalize dark:text-zinc-100">
                            {cleanHighlight}
                          </span>
                        );
                      } else if (
                        targetFeature.text.toLowerCase().includes("priority")
                      ) {
                        displayValue = (
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            Priority
                          </span>
                        );
                      } else if (
                        targetFeature.text.toLowerCase().includes("dedicated")
                      ) {
                        displayValue = (
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            Dedicated
                          </span>
                        );
                      }
                      //  else if (targetFeature.text.toLowerCase().includes("subdomain")) {
                      //   displayValue = <span className="text-xs text-zinc-500">Subdomain</span>;
                      // }
                      else {
                        displayValue = (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto text-emerald-500"
                          >
                            <path d="M20 6 9 17l-5-5"></path>
                          </svg>
                        );
                      }

                      return (
                        <TableCell
                          key={planIndex}
                          className={
                            "p-3 text-center text-sm text-zinc-700 dark:text-zinc-300 " +
                            (selectedIndex === planIndex && lightBg)
                          }
                        >
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
