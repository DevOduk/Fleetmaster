import ViewAllCategories from "@/components/client-components/categories";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AboutPageContent from "./about-page";



export const metadata: Metadata = {
  title:
    "About Us | FleetMaster",
  description: "nn",
};

export default function page() {
  return (
    <div className="min-h-screen">
      <AboutPageContent />
    </div>
  );
}
