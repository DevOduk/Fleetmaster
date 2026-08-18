"use client";
import { useFleet } from "@/context/FleetContext";
import React, { useRef, useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { clearTimeout } from "timers";
import Image from "next/image";

export const defaultVehicleImages = [
  "https://www.toyotawalton.com/wp-content/uploads/2025/01/Toyota-Land-Cruiser-Prado-used-vehicle-Toyota-walton.webp",
  "https://images.kobemotor.com/images/v70245-yi003.jpeg",
  "https://www.autocraftjapan.com/adminPanel/uploads/avis/veh_images/17170579389image_2.JPG",
];

export default function HeroSlider() {
  const { vehicles, loading: loadingVehicles } = useFleet();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [resetToken, setResetToken] = useState(0);

  const allImageUrls =
    vehicles.length > 3
      ? vehicles.map((v) => v?.image_url).filter(Boolean)
      : vehicles.length === 0
        ? defaultVehicleImages
        : [
          ...vehicles.map((v) => v?.image_url).filter(Boolean),
          ...defaultVehicleImages,
        ];

  const triggerUserInteraction = () => {
    setResetToken((prev) => prev + 1);
  };

  useEffect(() => {
    if (allImageUrls.length <= 1) return;

    const autoScrollTimer = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
        const isAtTheEnd = scrollLeft + clientWidth >= scrollWidth - 5;

        sliderRef.current.scrollTo({
          left: isAtTheEnd ? 0 : scrollLeft + clientWidth,
          behavior: "smooth",
        });
      }
    }, 5000);

    return () => clearInterval(autoScrollTimer);
  }, [allImageUrls.length, resetToken]);

  const handleScroll = (direction: "left" | "right") => {
    triggerUserInteraction(); // Wipes and resets the 5s timer frame immediately!

    if (sliderRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
      
      let targetScrollLeft: number;

      if (direction === "right") {
        // Check if we are at or past the end of the scrollable area
        if (scrollLeft + clientWidth >= scrollWidth - 1) {
          targetScrollLeft = 0; // Loop back to the start
        } else {
          targetScrollLeft = scrollLeft + clientWidth;
        }
      } else {
        // If going left and at the very beginning, wrap around to the end
        if (scrollLeft <= 0) {
          targetScrollLeft = scrollWidth - clientWidth;
        } else {
          targetScrollLeft = scrollLeft - clientWidth;
        }
      }

      sliderRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleDotClick = (index: number) => {
    triggerUserInteraction(); // Wipes and resets the 5s timer frame immediately!

    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      sliderRef.current.scrollTo({
        left: index * clientWidth,
        behavior: "smooth",
      });
    }
  };

  // Passive scroll tracking listener for active index (keeps dot highlighting synchronized)
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScrollTracking = () => {
      const { scrollLeft, clientWidth } = slider;
      if (clientWidth === 0) return;
      const targetIndex = Math.round(scrollLeft / clientWidth);
      setActiveIndex((prev) => (prev !== targetIndex ? targetIndex : prev));
    };

    slider.addEventListener("scroll", handleScrollTracking, { passive: true });
    return () => slider.removeEventListener("scroll", handleScrollTracking);
  }, [allImageUrls.length]);

  return (
    <div className="group relative my-auto hidden aspect-8/5 w-full items-center xl:flex">
      {/* Left Button */}
      <button
        onClick={() => handleScroll("left")}
        className="absolute top-1/2 left-4 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-black backdrop-blur-sm transition hover:scale-105 active:scale-95 dark:bg-black dark:text-white dark:hover:bg-gray-800"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon fontSize="medium" />
      </button>

      {/* Right Button */}
      <button
        onClick={() => handleScroll("right")}
        className="absolute top-1/2 right-4 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-black backdrop-blur-sm transition hover:scale-105 active:scale-95 dark:bg-black dark:text-white dark:hover:bg-gray-800"
        aria-label="Next slide"
      >
        <ChevronRightIcon />
      </button>

      {/* Inner Scrollable Track */}
      <div
        ref={sliderRef}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {allImageUrls.map((img, i) => (
          <div
            key={i}
            className="relative w-full min-w-full shrink-0 snap-start rounded-2xl overflow-hidden"
          >
            <Image
              className="h-full w-full object-cover object-center"
              alt={``}
              src={img}
              fill
              sizes="100vw"
              style={{ filter: "brightness(70%)" }}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* --- FIXED DOT INDICATOR PANEL OVERLAY --- */}
      <div className="absolute right-5 -bottom-1.5 z-20 flex gap-2 rounded-t-2xl bg-white px-5 py-3.5 dark:bg-gray-900">
        {allImageUrls.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={`dot-${i}`}
              onClick={() => handleDotClick(i)}
              className={`m-0 h-2 rounded-full transition-all duration-300 outline-none ${isActive
                  ? "w-6 bg-blue-500" // Highlighted Active Pill Indicator
                  : "w-2 bg-gray-500 hover:bg-gray-400" // Inactive point dot color
                }`}
              aria-label={`Jump directly to panel view frame index number ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
