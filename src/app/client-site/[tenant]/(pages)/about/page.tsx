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
        <div className="container m-auto min-h-screen">
      <PageBreadcrumb pageTitle="About Us" />
      <AboutPageContent />
    </div>
  );
}
