"use client";

import React from "react";

export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-[#0b0e14] text-gray-400 flex overflow-hidden max-h-screen">

            {/* 1. SIDEBAR SKELETON */}
            <div className="hidden lg:flex flex-col w-[290px] border-r border-slate-800 bg-[#121620] p-5 space-y-6 shrink-0">
                {/* Brand Logo area */}
                <div className="h-8 w-36 bg-slate-800 rounded animate-pulse mb-4" />

                {/* Nav Links Group 1 */}
                <div className="space-y-3">
                    <div className="h-3 w-12 bg-slate-800 rounded animate-pulse opacity-50 mb-2" />
                    <div className="h-10 w-full bg-slate-800/70 rounded-lg animate-pulse" />
                    <div className="h-10 w-full bg-slate-800/40 rounded-lg animate-pulse" />
                    <div className="h-10 w-full bg-slate-800/40 rounded-lg animate-pulse" />
                    <div className="h-10 w-full bg-slate-800/40 rounded-lg animate-pulse" />
                    <div className="h-10 w-full bg-slate-800/40 rounded-lg animate-pulse" />
                </div>

                {/* Nav Links Group 2 */}
                <div className="space-y-3 pt-4">
                    <div className="h-3 w-16 bg-slate-800 rounded animate-pulse opacity-50 mb-2" />
                    <div className="h-10 w-full bg-slate-800/40 rounded-lg animate-pulse" />
                    <div className="h-10 w-full bg-slate-800/40 rounded-lg animate-pulse" />
                    <div className="h-10 w-full bg-slate-800/40 rounded-lg animate-pulse" />
                    <div className="h-10 w-full bg-slate-800/40 rounded-lg animate-pulse" />
                </div>
            </div>

            {/* MAIN VIEW AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* 2. HEADER SKELETON */}
                <div className="h-16 border-b border-slate-800 bg-[#121620] px-6 flex items-center justify-between shrink-0">
                    {/* Search bar skeleton */}
                    <div className="h-9 w-72 bg-slate-800 rounded-lg animate-pulse" />
                    {/* Right actions (icons + profile) */}
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 bg-slate-800 rounded-full animate-pulse" />
                        <div className="h-8 w-8 bg-slate-800 rounded-full animate-pulse" />
                        <div className="h-8 w-20 bg-slate-800 rounded-lg animate-pulse" />
                    </div>
                </div>

                {/* PAGE CONTENT CONTAINER */}
                <div className="p-4 md:p-6 space-y-6 mix-blend-screen overflow-hidden max-h-screen">

                    {/* 3. FOUR METRIC TOP CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-[#121620] border border-slate-800/60 p-5 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
                                    <div className="h-7 w-7 bg-slate-800 rounded animate-pulse" />
                                </div>
                                <div className="h-8 w-32 bg-slate-800 rounded animate-pulse" />
                                <div className="h-4 w-16 bg-slate-800/60 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>

                    {/* 4. MAIN CHARTS / STATISTICS GRID */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* Monthly Revenue Bar Chart Container */}
                        <div className="xl:col-span-2 bg-[#121620] border border-slate-800/60 p-5 rounded-xl space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="h-5 w-36 bg-slate-800 rounded animate-pulse" />
                                <div className="h-4 w-4 bg-slate-800 rounded animate-pulse" />
                            </div>
                            {/* Fake Bar Chart Bars */}
                            <div className="h-80 flex items-end justify-between gap-2 pt-4 px-2">
                                {[55, 80, 45, 70, 50, 65, 85, 30, 60, 90, 75, 40, 90, 100, 110, 50].map((height, i) => (
                                    <div
                                        key={i}
                                        style={{ height: `${height}%` }}
                                        className="w-full bg-slate-800/70 rounded-t animate-pulse"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Monthly Target Gauge Container */}
                        <div className="bg-[#121620] border border-slate-800/60 p-5 rounded-xl flex flex-col justify-between space-y-6">
                            <div className="space-y-2">
                                <div className="h-5 w-28 bg-slate-800 rounded animate-pulse" />
                                <div className="h-3 w-44 bg-slate-800/50 rounded animate-pulse" />
                            </div>

                            {/* Circular Gauge Centerpiece Approximation */}
                            <div className="relative h-44 w-44 mx-auto flex items-center justify-center border-4 border-dashed border-slate-800 rounded-full animate-pulse">
                                <div className="text-center space-y-2">
                                    <div className="h-6 w-12 bg-slate-800 rounded mx-auto" />
                                    <div className="h-3 w-16 bg-slate-800/60 rounded mx-auto" />
                                </div>
                            </div>

                            <div className="h-10 w-full bg-slate-800/40 rounded-lg animate-pulse" />
                        </div>

                    </div>

                                        {/* 3. FOUR METRIC TOP CARDS */}
                                        
                            <div className="bg-[#121620] border border-slate-800/60 p-5 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
                                    <div className="h-7 w-9 bg-slate-800 rounded animate-pulse" />
                                </div>
                                <div className="h-12 w-full bg-slate-800 rounded animate-pulse" />
                                <div className="h-4 w-16 bg-slate-800/60 rounded animate-pulse" />
                            </div>
                                        {/* 3. FOUR METRIC TOP CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-[#121620] border border-slate-800/60 p-5 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
                                    <div className="h-7 w-7 bg-slate-800 rounded animate-pulse" />
                                </div>
                                <div className="h-8 w-32 bg-slate-800 rounded animate-pulse" />
                                <div className="h-4 w-16 bg-slate-800/60 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>

                </div>
            </div>

        </div>
    );
}