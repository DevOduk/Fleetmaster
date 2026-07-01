// src/app/admin-site/(others-pages)/feedbacks/page.tsx
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { createClient } from "@/utils/supabase/server";
import ViewFeedbacks, { FeedbackLog } from "@/components/feedback/ViewFeedbacks";

export const metadata = {
  title: "User Feedbacks Directory | FleetManager",
  description: "Review system reviews, bug reports, and features requested by application users.",
};

async function getAllFeedbacks() {
  try {
    const supabase = await createClient();

    // Fetch feedback logs ordered by the most recent submission
    const { data, error } = await supabase
      .from("fleetmaster_feedbacks")
      .select(`
        id, 
        user_id, 
        tenant_id, 
        user_role, 
        rating, 
        category, 
        feedback_text, 
        created_at,
      tenant:fleetmaster_tenants!tenant_id (
      name,
      slug,
      about,
      email
    ),
    sender:fleetmaster_admins!user_id (
      first_name,
      last_name,
      profile_pic,
      email
    )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase feedback retrieval error:", error.message);
      return [];
    }

    const formattedFeedbacks: FeedbackLog[] = (data || []).map((item) => ({
      ...item,
      // Force tenant and sender to be objects instead of arrays
      tenant: Array.isArray(item.tenant) ? item.tenant[0] : item.tenant,
      sender: Array.isArray(item.sender) ? item.sender[0] : item.sender,
    }));

    return formattedFeedbacks || [];
  } catch (err) {
    console.error("Failed to fetch feedback logs:", err);
    return [];
  }
}

export default async function Page() {
  const feedbacks = await getAllFeedbacks();

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="User Feedback" />
      <ViewFeedbacks initialFeedbacks={feedbacks} />
    </div>
  );
}