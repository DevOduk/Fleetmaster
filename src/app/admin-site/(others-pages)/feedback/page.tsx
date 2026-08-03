import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import Vehicles from "@/components/vehicles/Vehicles";
import Bookings from "@/components/bookings/Bookings";
import Feedback from "@/components/feedback/Feedback";

export const metadata: Metadata = {
  title:
    "Feedback | FleetMaster - Best tool for Fleet Management",
  description: "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Feedback" />
      <Feedback />
    </div>
  );
}
