"use server";
import { createClient } from "@supabase/supabase-js";

// Initialize a dedicated server-only client using the high-privilege Service Role Key
const getAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Bypasses RLS safety restrictions entirely on the server
  );
};

interface UserProfileParam {
  id: string;
  tenant_id: string;
  role: string;
}

interface SubmitFeedbackPayload {
  category: string;
  rating: number;
  feedback_text: string;
}

export async function submitUserFeedback(
  payload: SubmitFeedbackPayload, 
  userProfile: UserProfileParam
) {
  try {
    // Calling our administrative context wrapper
    const supabase = getAdminClient();

    // Securely insert the data into the database using your custom auth profile parameters
    const { error } = await supabase.from("fleetmaster_feedbacks").insert({
      user_id: userProfile.id,
      tenant_id: userProfile.tenant_id,
      user_role: userProfile.role || "User",
      category: payload.category,
      rating: payload.rating,
      feedback_text: payload.feedback_text,
    });

    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    console.error("Feedback database insertion failure:", err);
    return { success: false, error: err.message || "Failed to log feedback." };
  }
}