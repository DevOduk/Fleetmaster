"use client";
import { Backdrop, CircularProgress } from "@mui/material";
import React, { useState } from "react";

export default function DashboardSkeleton({ loading }: { loading: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex max-h-screen min-h-screen overflow-hidden bg-[#0b0e14] text-gray-400">
      <Backdrop
        sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={() => {}}
        className="flex flex-col gap-2 text-black dark:text-white"
      >
        <CircularProgress color="inherit" />
        <p>Loading Admin Profile ...</p>
      </Backdrop>
      {/* 1. SIDEBAR SKELETON */}
      <div className="hidden w-[290px] shrink-0 flex-col space-y-6 border-r border-slate-800 bg-[#121620] p-5 lg:flex">
        {/* Brand Logo area */}
        <div className="mb-4 h-8 w-36 animate-pulse rounded bg-slate-800" />

        {/* Nav Links Group 1 */}
        <div className="space-y-3">
          <div className="mb-2 h-3 w-12 animate-pulse rounded bg-slate-800 opacity-50" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800/70" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800/40" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800/40" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800/40" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800/40" />
        </div>

        {/* Nav Links Group 2 */}
        <div className="space-y-3 pt-4">
          <div className="mb-2 h-3 w-16 animate-pulse rounded bg-slate-800 opacity-50" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800/40" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800/40" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800/40" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800/40" />
        </div>
      </div>

      {/* MAIN VIEW AREA */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* 2. HEADER SKELETON */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-[#121620] px-6">
          {/* Search bar skeleton */}
          <div className="h-9 w-72 animate-pulse rounded-lg bg-slate-800" />
          {/* Right actions (icons + profile) */}
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 animate-pulse rounded-full bg-slate-800" />
            <div className="h-8 w-8 animate-pulse rounded-full bg-slate-800" />
            <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-800" />
          </div>
        </div>

        {/* PAGE CONTENT CONTAINER */}
        <div className="max-h-screen space-y-6 overflow-hidden p-4 mix-blend-screen md:p-6">
          {/* 3. FOUR METRIC TOP CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="space-y-4 rounded-xl border border-slate-800/60 bg-[#121620] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
                  <div className="h-7 w-7 animate-pulse rounded bg-slate-800" />
                </div>
                <div className="h-8 w-32 animate-pulse rounded bg-slate-800" />
                <div className="h-4 w-16 animate-pulse rounded bg-slate-800/60" />
              </div>
            ))}
          </div>

          {/* 4. MAIN CHARTS / STATISTICS GRID */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Monthly Revenue Bar Chart Container */}
            <div className="space-y-6 rounded-xl border border-slate-800/60 bg-[#121620] p-5 xl:col-span-2">
              <div className="flex items-center justify-between">
                <div className="h-5 w-36 animate-pulse rounded bg-slate-800" />
                <div className="h-4 w-4 animate-pulse rounded bg-slate-800" />
              </div>
              {/* Fake Bar Chart Bars */}
              <div className="flex h-80 items-end justify-between gap-2 px-2 pt-4">
                {[
                  55, 80, 45, 70, 50, 65, 85, 30, 60, 90, 75, 40, 90, 100, 110,
                  50,
                ].map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className="w-full animate-pulse rounded-t bg-slate-800/70"
                  />
                ))}
              </div>
            </div>

            {/* Monthly Target Gauge Container */}
            <div className="flex flex-col justify-between space-y-6 rounded-xl border border-slate-800/60 bg-[#121620] p-5">
              <div className="space-y-2">
                <div className="h-5 w-28 animate-pulse rounded bg-slate-800" />
                <div className="h-3 w-44 animate-pulse rounded bg-slate-800/50" />
              </div>

              {/* Circular Gauge Centerpiece Approximation */}
              <div className="relative mx-auto flex h-44 w-44 animate-pulse items-center justify-center rounded-full border-4 border-dashed border-slate-800">
                <div className="space-y-2 text-center">
                  <div className="mx-auto h-6 w-12 rounded bg-slate-800" />
                  <div className="mx-auto h-3 w-16 rounded bg-slate-800/60" />
                </div>
              </div>

              <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800/40" />
            </div>
          </div>

          {/* 3. FOUR METRIC TOP CARDS */}

          <div className="space-y-4 rounded-xl border border-slate-800/60 bg-[#121620] p-5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
              <div className="h-7 w-9 animate-pulse rounded bg-slate-800" />
            </div>
            <div className="h-12 w-full animate-pulse rounded bg-slate-800" />
            <div className="h-4 w-16 animate-pulse rounded bg-slate-800/60" />
          </div>
          {/* 3. FOUR METRIC TOP CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="space-y-4 rounded-xl border border-slate-800/60 bg-[#121620] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
                  <div className="h-7 w-7 animate-pulse rounded bg-slate-800" />
                </div>
                <div className="h-8 w-32 animate-pulse rounded bg-slate-800" />
                <div className="h-4 w-16 animate-pulse rounded bg-slate-800/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
