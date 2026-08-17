"use server";
import { createClient } from "@/utils/supabase/server";

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
  userProfile: UserProfileParam,
) {
  try {
    const supabase = await createClient();

    // Securely insert the data into the database using parameters straight from useUser()
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
