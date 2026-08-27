"use client";

import { useFleet } from "@/context/FleetContext";
import { useRef, useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";
import { defaultVehicleImages } from "@/data/globalExports";

export default function HeroSlider() {
  const { vehicles, loading: loadingVehicles } = useFleet();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const isScrollingRef = useRef(false); // Prevents overlapping glitched states from rapid clicks

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

  // Auto-scroll loop
  useEffect(() => {
    if (allImageUrls.length <= 1) return;

    const autoScrollTimer = setInterval(() => {
      if (sliderRef.current && !isScrollingRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
        const isAtTheEnd = scrollLeft + clientWidth >= scrollWidth - 5;
        const nextIndex = isAtTheEnd ? 0 : activeIndex + 1;

        isScrollingRef.current = true;
        sliderRef.current.scrollTo({
          left: nextIndex * clientWidth,
          behavior: "smooth",
        });

        // Release lock after animation finishes
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 400);
      }
    }, 5000);

    return () => clearInterval(autoScrollTimer);
  }, [allImageUrls.length, resetToken, activeIndex]);

  const handleScroll = (direction: "left" | "right") => {
    if (isScrollingRef.current || !sliderRef.current) return;
    triggerUserInteraction();

    const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
    let targetIndex = activeIndex;

    if (direction === "right") {
      targetIndex = scrollLeft + clientWidth >= scrollWidth - 5 ? 0 : activeIndex + 1;
    } else {
      targetIndex = scrollLeft <= 5 ? allImageUrls.length - 1 : activeIndex - 1;
    }

    isScrollingRef.current = true;
    sliderRef.current.scrollTo({
      left: targetIndex * clientWidth,
      behavior: "smooth",
    });

    setActiveIndex(targetIndex);

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 350);
  };

  const handleDotClick = (index: number) => {
    if (isScrollingRef.current || !sliderRef.current || index === activeIndex) return;
    triggerUserInteraction();

    const { clientWidth } = sliderRef.current;
    isScrollingRef.current = true;

    sliderRef.current.scrollTo({
      left: index * clientWidth,
      behavior: "smooth",
    });

    setActiveIndex(index);

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 350);
  };

  // Passive scroll tracking to keep dot states locked accurately
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let timeoutId: NodeJS.Timeout;
    const handleScrollTracking = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const { scrollLeft, clientWidth } = slider;
        if (clientWidth === 0) return;
        const targetIndex = Math.round(scrollLeft / clientWidth);
        setActiveIndex((prev) => (prev !== targetIndex ? targetIndex : prev));
      }, 50); // Debounce check to prevent mid-scroll flickering
    };

    slider.addEventListener("scroll", handleScrollTracking, { passive: true });
    return () => {
      slider.removeEventListener("scroll", handleScrollTracking);
      clearTimeout(timeoutId);
    };
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

      {/* Inner Scrollable Track (Removed conflicting CSS scroll-smooth class) */}
      <div
        ref={sliderRef}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
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
              sizes="(max-width: 1024px) 50vw, 33vw"
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
              className={`m-0 h-2 rounded-full transition-all duration-300 outline-none ${
                isActive
                  ? "w-6 bg-blue-500"
                  : "w-2 bg-gray-500 hover:bg-gray-400"
              }`}
              aria-label={`Jump directly to panel view frame index number ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}