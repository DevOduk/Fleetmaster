import { Metadata } from "next";
import { createPublicClient } from "@/utils/supabase/server";
import ValidateEmailForm from "@/components/auth/ValidateEmailForm";

interface PageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export const metadata: Metadata = {
  title: "Verify Email | FleetMaster - Best tool for Fleet Management",
  description:
    "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default async function Verify({ params }: PageProps) {
  const resolvedParams = await params;

  return <ValidateEmailForm params={resolvedParams} />;
}
