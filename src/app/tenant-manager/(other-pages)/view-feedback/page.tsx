// src/app/admin-site/(others-pages)/feedbacks/page.tsx
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { createClient } from "@/utils/supabase/server";
import ViewFeedbacks, {
  FeedbackLog,
} from "@/components/feedback/ViewFeedbacks";
import { Metadata } from "next";
import { getAllFeedbacks } from "@/app/actions/feedbacks";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Feedbacks | FleetMaster Dashboard - Best tool for Fleet Management",
  description:
    "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};


export default async function Page() {
  const feedbacks = await getAllFeedbacks();

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="User Feedback" />
      <ViewFeedbacks initialFeedbacks={feedbacks} />
    </div>
  );
}
