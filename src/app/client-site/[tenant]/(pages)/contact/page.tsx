import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact Us",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};
export default function page() {
  return (
        <div className="container m-auto min-h-screen">
      <PageBreadcrumb pageTitle="Contact Us" />
      Contact information will be here
    </div>
  );
}
