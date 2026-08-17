import { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPassword";

export const metadata: Metadata = {
  title: "Reset Password | FleetMaster - Best tool for Fleet Management",
  description:
    "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default async function Verify() {
  return <ResetPasswordForm isTenantManager={true} />;
}
