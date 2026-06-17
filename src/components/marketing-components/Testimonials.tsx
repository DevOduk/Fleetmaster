"use client"

import React from 'react'
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function TestimonialsSection() {
    const testimonials = [
        {
            quote: "Setting up our fleet used to take days of DNS configuring. Moving to FleetMaster gave us a fully-vetted booking portal on our own free subdomain within three minutes. Absolute lifesaver.",
            author: "Marcus Vance",
            role: "Operations Director, Lumina Rentals",
            initials: "MV",
            color: "bg-emerald-500/10 text-emerald-500"
        },
        {
            quote: "The live telematics and automated battery/voltage tracking completely transformed how we protect our premium inventory. We catch diagnostic faults before the drivers even notice them.",
            author: "Elena Rostova",
            role: "Fleet Manager, Apex Luxury Drive",
            initials: "ER",
            color: "bg-blue-500/10 text-blue-500"
        },
        {
            quote: "We were highly skeptical about automated driver vetting, but the security-first pipeline has flagged three fraudulent identity profile attempts in our first month alone. The insurance savings paid for the software instantly.",
            author: "Devon Carter",
            role: "Head of Risk, Sentinel Logistics",
            initials: "DC",
            color: "bg-indigo-500/10 text-indigo-500"
        },
        {
            quote: "Our Honda Fits and Toyota RAV4s used to get hammered with mileage while other cars sat idle. The deterministic rotation logic balanced our entire fleet utilization perfectly.",
            author: "Kenji Sato",
            role: "Founder, Sato Urban Mobility",
            initials: "KS",
            color: "bg-amber-500/10 text-amber-500"
        }
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
                <h3 className="text-amber-500 text-center">Client Testimonials</h3>
                <h2 className="text-3xl mt-4 mb-3 font-bold text-black text-center dark:text-white">See What our Clients Had To Say!</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-[700px] m-auto mb-5">From independent fleet operators to enterprise rental networks, thousands rely on FleetMaster to automate operations, track hardware diagnostics, and secure their assets.</p>
                

            {/* Testimonials Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
                {testimonials.map((item, index) => (
                    <div 
                        key={index}
                        className="flex flex-col justify-between p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xs transition-all duration-200 hover:border-gray-200 dark:hover:border-zinc-700"
                    >
                        {/* Rating Row */}
                        <div className="flex items-center gap-0.5 text-amber-500 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} fontSize="small" />
                            ))}
                        </div>

                        {/* Narrative Quote Content */}
                        <p className="flex-1 text-gray-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed font-normal italic">
                            "{item.quote}"
                        </p>

                        {/* Author Profile Footer Row */}
                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-50 dark:border-zinc-800">
                            <div className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center tracking-wide shrink-0 ${item.color}`}>
                                {item.initials}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                    {item.author}
                                </h4>
                                <p className="text-xs text-gray-400 dark:text-zinc-500 truncate mt-0.5">
                                    {item.role}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* HIGH-FIDELITY TRUSTPILOT INTEGRATION COMPONENT */}
            <div className="container mx-auto pt-4 border-t border-gray-100 dark:border-zinc-900 shadow">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left bg-white/50 dark:bg-zinc-900/30 backdrop-blur-xs p-4 rounded-2xl border border-gray-100 dark:border-zinc-900/80">
                    
                    {/* Trustpilot Brand Block */}
                    <div className="flex items-center gap-1">
                        <StarIcon className="text-[#00b67a]" fontSize="medium" />
                        <span className="font-bold tracking-tight text-base text-gray-900 dark:text-white">
                            Trustpilot
                        </span>
                    </div>

                    {/* Middle Divider Element for Desktop */}
                    <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-zinc-800" />

                    {/* Score Content Metric */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-center sm:justify-start gap-1">
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">Excellent</span>
                            <div className="flex items-center text-[#00b67a] gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="bg-[#00b67a] text-white p-0.5 rounded-xs scale-75 flex items-center justify-center">
                                        <StarIcon className="text-white text-[10px]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500">
                            <span>4.9 out of 5 based on 1,240 reviews</span>
                            <VerifiedIcon className="text-blue-500 text-xs" />
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}