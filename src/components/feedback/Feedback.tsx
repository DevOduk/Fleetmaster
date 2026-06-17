"use client";
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import ComponentCard from "../common/ComponentCard";
import Rating from '@mui/material/Rating';
import Input from "../form/input/InputField";
import Label from "../form/Label";
import TextArea from "../form/input/TextArea";
import { useTheme } from '@mui/material/styles';

const Feedback: React.FC = () => {
  const [messageTwo, setMessageTwo] = useState("");
  const theme = useTheme();

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

  return (
    <div>

      <div className="space-y-6">
        <ComponentCard title="Submit Feedback">
          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
            Please leave us a feedback to help us improve:</p>
          <div>

            <div>
              <Label>Feedback Title</Label>
              <Input type="text" placeholder="Enter feedback title" />
            </div>
            <div>
              <Label>Pick Your Rating</Label>
              <div className="flex justify-center py-5">
                <Rating name="customized-10" defaultValue={0} size='large' max={10}
                  sx={{
                    '& .MuiRating-iconEmpty': {
                      color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : '#616b7a'
                    }
                  }} />
              </div>
            </div>

            <div>
              <Label>Feedback Description</Label>
              <TextArea
                rows={6}
                value={messageTwo}
                error
                onChange={(value) => setMessageTwo(value)}
                hint="Please enter a valid message."
              />
            </div>
            <button
              className="flex mt-3 ms-auto items-center justify-center p-2 px-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"

            >
              Submit Feedback
            </button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default Feedback;
