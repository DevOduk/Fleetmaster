"use client";
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import ComponentCard from "../common/ComponentCard";
import Rating from "@mui/material/Rating";
import Label from "../form/Label";
import TextArea from "../form/input/TextArea";
import { useTheme } from "@mui/material/styles";
import { useUser } from "@/context/UserContext"; // Adjust this hook import to your real location
import { submitUserFeedback } from "@/app/actions/feedbacks";
import { useToast } from "@/context/ToastContext";
import Input from "../form/input/InputField";

const Feedback: React.FC = () => {
  const theme = useTheme();
  const { profile } = useUser();
  const { showToast } = useToast();

  // Form input control states
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState<number | null>(0);
  const [description, setDescription] = useState("");

  // Submission indicator states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  // Apply dark mode styles to leaflet
  useEffect(() => {
    const handleModeChange = () => {
      const tiles = document.querySelectorAll(".leaflet-tile");
      tiles.forEach((tile) => {
        const img = tile as HTMLImageElement;
        if (isDarkMode) {
          img.style.filter = "invert(0.93) hue-rotate(180deg) saturate(0.9)";
        } else {
          img.style.filter = "none";
        }
      });
    };

    const observer = new MutationObserver(handleModeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    handleModeChange();
    return () => observer.disconnect();
  }, [isDarkMode]);

  // Handle Form Submission
  const handleSubmit = async () => {
    // 1. Guard check: make sure description text exists
    if (!description.trim()) {
      showToast("Please enter a valid description before submitting.", "error");
      setStatusMessage({
        type: "error",
        text: "Please enter a valid description before submitting.",
      });
      return;
    }

    // 2. Guard check: Make sure context has fully loaded the user profile
    if (!profile) {
      showToast(
        "Not signed in! Please log in to write a feedback.",
        "error",
      );
      setStatusMessage({
        type: "error",
        text: "Not signed in! Please log in to write a feedback.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    // 3. Fire server action passing state alongside useUser details parameters
    const result = await submitUserFeedback(
      {
        category,
        rating: rating / 2 || 0,
        feedback_text: description,
      },
      {
        id: profile.id,
        tenant_id: profile.tenant_id,
        role: profile.role,
      },
    );

    setIsSubmitting(false);

    if (result.success) {
      showToast("Your feedback has been sent successfully.", "success");
      setStatusMessage({
        type: "success",
        text: "Thank you! Your feedback has been saved successfully.",
      });
      setDescription("");
      setRating(0);
    } else {
      showToast("Failed to submit feedback.", "error");
      setStatusMessage({
        type: "error",
        text: result.error.message || "Failed to submit feedback.",
      });
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-6xl space-y-6">
        <ComponentCard title="Submit Feedback">
          <p className="text-theme-sm mb-4 font-medium text-gray-800 dark:text-white/90">How would you rate your experience with the website? Your feedback will help us improve. Thank you.</p>
          <p className="text-theme-sm mb-4 font-medium text-gray-700 dark:text-gray-400">
            Disclaimer: Writing review as{" "}
            <span className="text-brand-500 font-semibold">
              {profile?.first_name} {profile?.last_name}
            </span>{" "}
            ({profile?.fleetmaster_tenants?.name || "Loading Company..."})
          </p>

          <div className="space-y-4">
            {/* Category selection selector */}
            <div>
              <Label>Feedback/Review Title</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g Excellent customer service"
                className="text-theme-sm focus:border-brand-500 mt-1 w-full rounded-lg border border-gray-200 bg-transparent p-2.5 text-gray-800 outline-none dark:border-white/10 dark:text-white/90"
              />
            </div>

            {/* Evaluation Score Selection */}
            <div>
              <Label>Pick Your Rating</Label>
              <div className="flex flex-col items-center justify-center gap-3 py-3">
                <div>
                  <h3 className="text-2xl font-bold text-purple-600">
                    ({rating || 0})
                  </h3>
                </div>
                <Rating
                  name="feedback-rating"
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue)}
                  size="large"
                  max={10}
                  precision={1}
                  sx={{
                    "& .MuiRating-iconEmpty": {
                      color:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.2)"
                          : "#cbd5e1",
                    },
                  }}
                />
              </div>
            </div>

            {/* Narrative Box */}
            <div>
              <Label>Feedback Description</Label>
              <TextArea
                rows={6}
                value={description}
                onChange={(value) => setDescription(value)}
                placeholder="Describe what you encountered or what you would like to see added..."
              />
            </div>

            {/* Notification alert response box */}
            {statusMessage && (
              <div
                className={`text-theme-sm rounded-lg p-3 ${statusMessage.type === "success"
                  ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                  }`}
              >
                {statusMessage.text}
              </div>
            )}

            {/* Submission Action Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`bg-brand-500 text-theme-sm hover:bg-brand-600 ms-auto mt-3 flex items-center justify-center rounded-lg p-2 px-4 font-medium text-white transition-all ${isSubmitting ? "cursor-not-allowed opacity-50" : ""
                }`}
            >
              {isSubmitting ? "Processing Submission..." : "Submit Feedback"}
            </button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default Feedback;

