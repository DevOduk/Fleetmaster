"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";

type Position = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
type Size = "small" | "medium" | "large";

interface PopupPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

const getPositionStyles = (position: Position): PopupPosition => {
  const baseSpacing = "20px";
  
  switch (position) {
    case "top-left":
      return { top: baseSpacing, left: baseSpacing };
    case "top-center":
      return { top: baseSpacing, left: "50%", transform: "translateX(-50%)" };
    case "top-right":
      return { top: baseSpacing, right: baseSpacing };
    case "bottom-left":
      return { bottom: baseSpacing, left: baseSpacing };
    case "bottom-center":
      return { bottom: baseSpacing, left: "50%", transform: "translateX(-50%)" };
    case "bottom-right":
      return { bottom: baseSpacing, right: baseSpacing };
    default:
      return {};
  }
};

const getSizeStyles = (size: Size) => {
  switch (size) {
    case "small":
      return { width: "280px", padding: "16px" };
    case "medium":
      return { width: "360px", padding: "20px" };
    case "large":
      return { width: "480px", padding: "24px" };
    default:
      return {};
  }
};

export default function InteractiveAlertPopup() {
  const [position, setPosition] = useState<Position>("top-center");
  const [size, setSize] = useState<Size>("medium");
  const [showPopup, setShowPopup] = useState(false);

  const handlePositionClick = (newPosition: Position) => {
    setPosition(newPosition);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleSizeChange = (newSize: Size) => {
    setSize(newSize);
  };

  const positionStyles = getPositionStyles(position);
  const sizeStyles = getSizeStyles(size);

  return (
    <div className="space-y-6">
      <ComponentCard title="Interactive Alert Popup Mockup">
        <div className="space-y-6">
          {/* Size Selector */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Popup Size:
            </label>
            <div className="flex flex-wrap gap-3">
              {(["small", "medium", "large"] as Size[]).map((sizeOption) => (
                <button
                  key={sizeOption}
                  onClick={() => handleSizeChange(sizeOption)}
                  className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                    size === sizeOption
                      ? "bg-brand-500 text-white shadow-theme-xs"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  }`}
                >
                  {sizeOption}
                </button>
              ))}
            </div>
          </div>

          {/* Position Buttons */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Popup Position (Click to show):
            </label>
            <div className="space-y-3">
              {/* Top Row */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handlePositionClick("top-left")}
                  className="px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition shadow-theme-xs"
                >
                  Top Left
                </button>
                <button
                  onClick={() => handlePositionClick("top-center")}
                  className="px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition shadow-theme-xs"
                >
                  Top Center
                </button>
                <button
                  onClick={() => handlePositionClick("top-right")}
                  className="px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition shadow-theme-xs"
                >
                  Top Right
                </button>
              </div>

              {/* Bottom Row */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handlePositionClick("bottom-left")}
                  className="px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition shadow-theme-xs"
                >
                  Bottom Left
                </button>
                <button
                  onClick={() => handlePositionClick("bottom-center")}
                  className="px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition shadow-theme-xs"
                >
                  Bottom Center
                </button>
                <button
                  onClick={() => handlePositionClick("bottom-right")}
                  className="px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition shadow-theme-xs"
                >
                  Bottom Right
                </button>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="relative mt-8 min-h-96 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Popup Preview Area
                <br />
                <span className="text-xs">Current: {size} size at {position}</span>
              </p>
            </div>

            {/* Animated Popup */}
            {showPopup && (
              <div
                className="fixed transition-all duration-300 ease-in-out"
                style={{
                  ...positionStyles,
                  ...sizeStyles,
                  zIndex: 50,
                }}
              >
                <div className="rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <svg
                          className="h-6 w-6 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Success!
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {position}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPopup(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="pt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your action was completed successfully. This popup will automatically close in a few seconds.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current Settings Display */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Current Settings:</span> {size} size popup at {position}
            </p>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
