// [tenant]/(auth)/signin/page.tsx

import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "SignIn | FleetMaster - Best tool for Fleet Management",
  description: "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default function SignIn() {
  return <SignInForm />;
}
