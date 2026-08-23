"use client";

import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import Rating from "@mui/material/Rating";
import { useTheme } from "@mui/material/styles";




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

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h3 className="text-center text-amber-500">Client Testimonials</h3>
      <h2 className="mt-4 mb-3 text-center text-3xl font-bold text-black dark:text-white">
        See What our Clients Had To Say!
      </h2>
      <p className="m-auto mb-5 max-w-175 text-center text-sm text-gray-500 dark:text-gray-400">
        From independent fleet operators to enterprise rental networks,
        thousands rely on FleetMaster to automate operations, track hardware
        diagnostics, and secure their assets.
      </p>

      {/* Testimonials Bento Grid Layout */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-gray-100 p-6 shadow-xs transition-all duration-200 hover:border-gray-200 sm:p-8 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >
            {/* Rating Row */}
            <div className="mb-4 flex items-center gap-0.5 text-amber-500">
              <Rating
                readOnly
                value={item.rating || 0}
                max={5} // Adjusted to 5-star metric standard, can set to 10 if needed
                size="small"
                precision={.5}
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
            <p className="text-sm mb-2 font-semibold text-green-600 sm:text-base dark:text-green-400">
              {item?.title || 'Cool'}
            </p>
            {/* Narrative Quote Content */}
            <p className="flex-1 text-sm leading-relaxed font-normal text-gray-600 italic sm:text-base dark:text-zinc-300">
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
        ))}
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
