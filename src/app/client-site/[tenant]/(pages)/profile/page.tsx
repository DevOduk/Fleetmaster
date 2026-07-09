import { Metadata } from "next";
import ProfilePage from "@/components/user-profile/ProfilePage/ProfilePage";

export const metadata: Metadata = {
  title:
    "View Profile | FleetManager Admin Dashboard - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default function Profile() {
  return (
    <ProfilePage />
  );
}
