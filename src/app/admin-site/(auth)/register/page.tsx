// [tenant]/(auth)/register/page.tsx
import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Register Account | FleetMaster Admin - Best tool for Fleet Management",
  description: "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};
export default function SignIn() {
  return <RegisterForm />;
}
