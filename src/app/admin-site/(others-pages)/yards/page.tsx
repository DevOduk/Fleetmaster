import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import dynamic from "next/dynamic"; // 1. Import dynamic

// 2. Load the Yards component ONLY in the browser
const Yards = dynamic(() => import("@/components/yards/Yards"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "FleetManager Admin Dashboard | Yards - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard...",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Your Yards" />
      <Yards />
    </div>
  );
}