"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export const getRemainingDays = (expiryDate?: string | Date): number => {
  if (!expiryDate) return 0;
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const getExpiryString = (expiryDate: string) => {
  if (!expiryDate) return "No active subscription";

  const now = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) return "Has Expired (Renew Now)";

  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerWeek = msPerDay * 7;
  const msPerMonth = msPerDay * 30; // Approximation

  const months = Math.floor(diff / msPerMonth);
  const weeks = Math.floor((diff % msPerMonth) / msPerWeek);
  const days = Math.floor((diff % msPerWeek) / msPerDay);
  const hours = Math.floor((diff % msPerDay) / msPerHour);
  const minutes = Math.floor((diff % msPerHour) / msPerMinute);
  const seconds = Math.floor((diff % msPerMinute) / msPerSecond);

  if (months > 0)
    return `Expires in ${months} month${months > 1 ? "s" : ""} ${days} day${days !== 1 ? "s" : ""}`;
  if (weeks > 0)
    return `Expires in ${weeks} week${weeks > 1 ? "s" : ""} ${days} day${days !== 1 ? "s" : ""}`;
  if (days > 0)
    return `Expires in ${days} day${days !== 1 ? "s" : ""} ${hours} hour${hours !== 1 ? "s" : ""}`;
  if (hours > 0)
    return `Expires in ${hours} hour${hours !== 1 ? "s" : ""} ${minutes} min${minutes !== 1 ? "s" : ""}`;
  return `Expires in ${minutes} min${minutes !== 1 ? "s" : ""} ${seconds} sec${seconds !== 1 ? "s" : ""}`;
};

export const formatedTimestamp = (date: string) => {
  if (!date) return "-";

  const now = new Date();
  const formated = new Date(date);

  if (Number.isNaN(formated.getTime())) {
    return "-";
  }

  const diff = formated.getTime() - now.getTime();
  const absDiff = Math.abs(diff);

  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerWeek = msPerDay * 7;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const formatValue = (value: number, unit: string) =>
    `${value} ${unit}${value !== 1 ? "s" : ""}`;

  if (absDiff < msPerMinute) {
    const seconds = Math.floor(absDiff / msPerSecond);
    return diff < 0 ? `${formatValue(seconds, "sec")} ago` : `In ${formatValue(seconds, "sec")}`;
  }
  if (absDiff < msPerHour) {
    const minutes = Math.floor(absDiff / msPerMinute);
    return diff < 0 ? `${formatValue(minutes, "min")} ago` : `In ${formatValue(minutes, "min")}`;
  }
  if (absDiff < msPerDay) {
    const hours = Math.floor(absDiff / msPerHour);
    return diff < 0 ? `${formatValue(hours, "hr")} ago` : `In ${formatValue(hours, "hr")}`;
  }
  if (absDiff < msPerWeek) {
    const days = Math.floor(absDiff / msPerDay);
    return diff < 0 ? `${formatValue(days, "day")} ago` : `In ${formatValue(days, "day")}`;
  }
  if (absDiff < msPerMonth) {
    const weeks = Math.floor(absDiff / msPerWeek);
    return diff < 0 ? `${formatValue(weeks, "wk")} ago` : `In ${formatValue(weeks, "wk")}`;
  }
  if (absDiff < msPerYear) {
    const months = Math.floor(absDiff / msPerMonth);
    return diff < 0 ? `${formatValue(months, "mth")} ago` : `In ${formatValue(months, "mth")}`;
  }

  return formated.toDateString();
};

function ExpiryBanner({
  plan,
  expiryDate,
}: {
  plan: string;
  expiryDate: string;
}) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Update immediately on mount
    setTimeLeft(getExpiryString(expiryDate));

    // Update every second
    const interval = setInterval(() => {
      setTimeLeft(getExpiryString(expiryDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  // Don't render anything if it's already expired or loading
  if (!timeLeft || timeLeft.includes("week") || timeLeft.includes("month"))
    return null;

  return (
    <div className="flex items-center justify-end gap-2 p-6">
      <span className="text-sm text-black italic dark:text-white">
        It is advisable to renew plan before expiry!
      </span>
      <Link
        href="/company-profile/subscription"
        className="w-auto rounded-lg border-red-700 bg-red-500 p-2 px-5 text-white"
      >
        {plan} Plan {timeLeft}
      </Link>
    </div>
  );
}

export default ExpiryBanner;
