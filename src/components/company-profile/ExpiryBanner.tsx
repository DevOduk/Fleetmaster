"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

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

  if (diff <= 0) return "Has Expired (Click to renew)";

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

  if (months > 0) return `Expires in ${months} month${months > 1 ? 's' : ''} ${days} day${days !== 1 ? 's' : ''}`;
  if (weeks > 0) return `Expires in ${weeks} week${weeks > 1 ? 's' : ''} ${days} day${days !== 1 ? 's' : ''}`;
  if (days > 0) return `Expires in ${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
  if (hours > 0) return `Expires in ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
  return `Expires in ${minutes} min${minutes !== 1 ? 's' : ''} ${seconds} sec${seconds !== 1 ? 's' : ''}`;
};

function ExpiryBanner({ plan, expiryDate }: { plan: string, expiryDate: string }) {
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
  if (!timeLeft || timeLeft.includes('week') || timeLeft.includes('month')) return null;

  return (
    <div className="flex gap-2 justify-end p-6 items-center">
      <span className="text-black italic text-sm dark:text-white">
        It is advisable to renew plan before expiry!
      </span>
      <Link href='/company-profile/subscription' className="p-2 w-auto px-5 bg-red-500 text-white rounded-lg border-red-700">
        {plan} Plan {timeLeft}
      </Link>
    </div>
  );
}

export default ExpiryBanner;