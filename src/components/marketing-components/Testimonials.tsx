"use client";

import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import Rating from "@mui/material/Rating";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";




export default function TestimonialsSection({ feedbacks }: { feedbacks: any }) {
  const theme = useTheme();
  const normalizedTestimonials = feedbacks.filter((f) => f.is_feedback && f.rating >= 4.5).map(feed => {
    return {
      rating: feed.rating,
      title: feed.category,
      quote: feed.feedback_text,
      author: `${feed.sender.first_name.replace(feed.sender.first_name.charAt(0), feed.sender.first_name.charAt(0).toUpperCase())} ${feed.sender.last_name.replace(feed.sender.last_name.charAt(0), feed.sender.last_name.charAt(0).toUpperCase())}`,
      role: `${feed.user_role} | ${feed.tenant.name}`,
      initials: `${feed.sender.first_name.split('')[0]}${feed.sender.last_name.split('')[0]}`.toUpperCase(),
      color: "bg-emerald-500/10 text-emerald-500",
    }
  })
  const testimonials = [
    ...normalizedTestimonials,
    {
      rating: 5,
      title: "Faster Fleet Launch",
      quote:
        "Setting up our fleet used to take days of DNS configuring. Moving to FleetMaster gave us a fully-vetted booking portal on our own free subdomain within three minutes. Absolute lifesaver.",
      author: "Marcus Vance",
      role: "Operations Director, Lumina Rentals",
      initials: "MV",
      color: "bg-emerald-500/10 text-emerald-500",
    },
    {
      rating: 5,
      title: "Predictive Fleet Health",
      quote:
        "The live telematics and automated battery/voltage tracking completely transformed how we protect our premium inventory. We catch diagnostic faults before the drivers even notice them.",
      author: "Elena Rostova",
      role: "Fleet Manager, Apex Luxury Drive",
      initials: "ER",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      rating: 5,
      title: "Security-First Vetting",
      quote:
        "We were highly skeptical about automated driver vetting, but the security-first pipeline has flagged three fraudulent identity profile attempts in our first month alone. The insurance savings paid for the software instantly.",
      author: "Devon Carter",
      role: "Head of Risk, Sentinel Logistics",
      initials: "DC",
      color: "bg-indigo-500/10 text-indigo-500",
    },
    {
      rating: 5,
      title: "Utilization Optimization",
      quote:
        "Our Honda Fits and Toyota RAV4s used to get hammered with mileage while other cars sat idle. The deterministic rotation logic balanced our entire fleet utilization perfectly.",
      author: "Kenji Sato",
      role: "Founder, Sato Urban Mobility",
      initials: "KS",
      color: "bg-amber-500/10 text-amber-500",
    },
  ];

  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(window.innerWidth >= 1280 ? 4 : window.innerWidth >= 768 ? 2 : 1);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);



  const triggerUserInteraction = () => {
    setResetToken((prev) => prev + 1);
  };

  useEffect(() => {
    if (testimonials.length <= 1) return;

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
  }, [testimonials.length, resetToken]);

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
  }, [testimonials.length]);

  return (
    <div className="container mx-auto px-3 py-10">
      <h3 className="md:text-center text-amber-500">Client Testimonials</h3>
      <h2 className="mt-4 mb-3 md:text-center text-3xl font-bold text-black dark:text-white">
        See What our Clients Had To Say!
      </h2>
      <p className="m-auto mb-5 max-w-175 md:text-center text-sm text-gray-500 dark:text-gray-400">
        From independent fleet operators to enterprise rental networks,
        thousands rely on FleetMaster to automate operations, track hardware
        diagnostics, and secure their assets.
      </p>

      {/* Testimonials Bento Grid Layout */}
      <div className="group relative my-auto flex w-full items-center">
        {/* Inner Scrollable Track */}
        <div
          ref={sliderRef}
          className="no-scrollbar grid h-fit w-full grid-flow-col grid-rows-1 gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth auto-cols-[calc(100%-3rem)] sm:auto-cols-full md:auto-cols-[calc((100%)/1)] px-4 sm:px-0"
        >
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="flex h-full snap-start min-w-full flex-col justify-center px-1 py-6 sm:px-6"
            >

              <div className="relative pl-3 mt-3 mx-auto w-full max-w-2xl leading-0">
                <span
                  aria-hidden="true"
                  className="pointer-events-none z-2 font-serif text-9xl font-black leading-8 text-gray-500"
                >
                  “
                </span>
              </div>

              <div className="relative mx-auto w-full max-w-2xl">
                <div
                  className="flex min-h-80 h-full w-full flex-col justify-between rounded-2xl border border-gray-200/80 bg-gray-50/90 p-6 shadow-lg shadow-zinc-300/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:p-8 dark:border-zinc-700 dark:bg-zinc-800/90 dark:shadow-zinc-950/40 dark:hover:border-zinc-600"
                >
                  {/* Rating Row */}
                  <div className="mb-4 flex items-center gap-0.5 text-amber-500">
                    <Rating
                      readOnly
                      value={item.rating || 0}
                      max={5} // Adjusted to 5-star metric standard, can set to 10 if needed
                      size="small"
                      precision={0.5}
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

                  {/* Narrative Quote Content */}
                  <p className="mb-2 text-sm font-semibold text-green-600 sm:text-base dark:text-green-400">
                    {item?.title || "Cool"}
                  </p>
                  {/* Narrative Quote Content */}
                  <p className="flex-1 text-sm font-normal italic leading-relaxed text-gray-600 sm:text-base dark:text-zinc-300">
                    &quot;{item.quote}&quot;
                  </p>

                  {/* Author Profile Footer Row */}
                  <div className="mt-6 flex items-center gap-4 border-t border-gray-50 pt-6 dark:border-zinc-800">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold tracking-wide ${item.color}`}
                    >
                      {item.initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {item.author}
                      </h4>
                      <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-zinc-500">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pr-3 mt-3 mx-auto w-full max-w-2xl text-right">
                <span
                  aria-hidden="true"
                  className="pointer-events-none font-serif text-9xl font-black leading-none text-gray-500"
                >
                  ”
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* --- FIXED DOT INDICATOR PANEL OVERLAY --- */}
      <div className="relative flex items-center justify-between gap-2 px-0 py-4 mt-2">
        {/* Left Button */}
        <button
          onClick={() => handleScroll("left")}
          className="flex items-center text-lg justify-center rounded-lg bg-gray-300 p-2.5 text-black shadow-md ring-1 ring-zinc-600/50 shadow-zinc-400 dark:shadow-zinc-500/90 backdrop-blur-sm transition hover:scale-105 active:scale-95 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          aria-label="Previous slide"
          title="Previous slide"
        >
          <ChevronLeftIcon fontSize="medium" />
        </button>


        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(testimonials.length / 1) }, (_, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={`dot-${i}`}
                onClick={() => handleDotClick(i)}
                className={`m-0 h-2 rounded-full transition-all duration-300 outline-none ${isActive
                  ? "w-6 bg-blue-500" // Highlighted Active Pill Indicator
                  : "w-2 bg-gray-500 hover:bg-gray-400" // Inactive point dot color
                  }`}
                aria-label={`Jump directly to testimonial group ${i + 1}`}
              />
            );
          })}
        </div>

        {/* Right Button */}
        <button
          onClick={() => handleScroll("right")}
          className="flex items-center text-lg justify-center rounded-lg bg-gray-300 p-2.5 text-black shadow-md ring-1 ring-zinc-600/50 shadow-zinc-400 dark:shadow-zinc-500/90 backdrop-blur-sm transition hover:scale-105 active:scale-95 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          aria-label="Next slide"
          title="Next slide"
        >
          <ChevronRightIcon />
        </button>
      </div>


      {/* HIGH-FIDELITY TRUSTPILOT INTEGRATION COMPONENT */}
      <div className="container mx-auto border-t border-gray-100 pt-4 shadow dark:border-zinc-900">
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white/50 p-4 text-center backdrop-blur-xs sm:flex-row sm:text-left dark:border-zinc-900/80 dark:bg-zinc-900/30">
          {/* Trustpilot Brand Block */}
          <div className="flex items-center gap-1">
            <StarIcon className="text-[#00b67a]" fontSize="medium" />
            <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
              Trustpilot
            </span>
          </div>

          {/* Middle Divider Element for Desktop */}
          <div className="hidden h-6 w-px bg-gray-200 sm:block dark:bg-zinc-800" />

          {/* Score Content Metric */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 sm:justify-start">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Excellent
              </span>
              <div className="flex items-center gap-0.5 text-[#00b67a]">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex scale-75 items-center justify-center rounded-xs bg-[#00b67a] p-0.5 text-white"
                  >
                    <StarIcon className="text-[10px] text-white" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500">
              <span>4.9 out of 5 based on 1,240 reviews</span>
              <VerifiedIcon className="text-xs text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
