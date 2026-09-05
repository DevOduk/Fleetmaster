"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import Link from "next/link";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function MainClientHeader() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getStyles = (path: string) => {
    return pathname?.startsWith(path)
      ? "font-bold border-b py-1 border-b-amber-600 text-amber-600 hover:text-amber-600 transition-colors flex items-center gap-0.5"
      : "font-normal hover:text-brand-600 py-1 transition-colors flex items-center gap-0.5";
  };

  return (
    <header className="sticky top-0 z-50 container mx-auto w-full md:px-4 pt-4 lg:px-8">
      {/* 1. MOBILE NAVIGATION OVERLAY (Moved outside the card wrapper for clean stacking) */}
      {isMobileOpen && (
        <nav className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-white px-6 pt-20 text-sm font-medium text-gray-600 dark:bg-zinc-950 dark:text-zinc-400 lg:hidden">
          <Link
            href="/about"
            onClick={() => setIsMobileOpen(false)}
            className={getStyles("/about")}
          >
            About Us
          </Link>
          <Link
            href="/usage"
            onClick={() => setIsMobileOpen(false)}
            className={getStyles("/usage")}
          >
            Use cases <AddIcon fontSize="small" className="opacity-60" />
          </Link>
          <Link
            href="/pricing"
            onClick={() => setIsMobileOpen(false)}
            className={getStyles("/pricing")}
          >
            Pricing
          </Link>
          <Link
            href="/shop"
            onClick={() => setIsMobileOpen(false)}
            className={getStyles("/shop")}
          >
            Shop{" "}
            <ShoppingBagOutlinedIcon fontSize="small" className="opacity-60" />
          </Link>
          <Link
            href="/terms-conditions"
            onClick={() => setIsMobileOpen(false)}
            className={getStyles("/terms-conditions")}
          >
            Terms of Use
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMobileOpen(false)}
            className={getStyles("/contact")}
          >
            Contact sales
          </Link>
        </nav>
      )}

      {/* Rounded floating card container */}
      <div className="relative z-50 flex items-center justify-between rounded-full border border-gray-200/50 dark:border-zinc-600/50 bg-white/80 px-5 md:px-6 py-2.5 shadow-sm backdrop-blur-md dark:bg-zinc-950/60">
        {/* Logo / Brand */}
        <div className="flex cursor-pointer items-center gap-2 z-50">
          <Link href="/" className="">
            <Image
              width={154}
              height={32}
              sizes="(max-width: 768px) 120px, 154px"
              className="hidden md:block dark:hidden"
              src="/images/logo/logo.svg"
              alt=""
            />
            <Image
              width={154}
              height={40}
              sizes="(max-width: 768px) 120px, 154px"
              preload
              className="hidden md:dark:block"
              src="/images/logo/logo-dark.svg"
              alt=""
            />
            <Image
              width={40}
              height={40}
              sizes="(max-width: 768px) 120px, 154px"
              preload
              className="block md:hidden"
              src="/images/logo/logo-icon.svg"
              alt=""
            />
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 lg:flex dark:text-zinc-400">
          <Link href="/about" className={getStyles("/about")}>
            About Us
          </Link>
          <Link href="/usage" className={getStyles("/usage")}>
            Use cases <AddIcon fontSize="small" className="opacity-60" />
          </Link>
          <Link href="/pricing" className={getStyles("/pricing")}>
            Pricing
          </Link>
          <Link href="/shop" className={getStyles("/shop")}>
            Shop{" "}
            <ShoppingBagOutlinedIcon fontSize="small" className="opacity-60" />
          </Link>
          <Link
            href="/terms-conditions"
            className={getStyles("/terms-conditions")}
          >
            Terms of Use
          </Link>
          <Link href="/contact" className={getStyles("/contact")}>
            Contact sales
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggleButton />
          {/* CTA Button */}
          <Link
            href="http://app.localhost:3000/register"
            target="_blank"
            className="hidden lg:block"
          >
            <button className="cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-nowrap text-black shadow-sm transition-all hover:border-gray-400 dark:border-zinc-300 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200">
              Open app
            </button>
          </Link>

          {/* 2. HAMBURGER BUTTON (Changed to z-50 to stay visible on top of overlay) */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {isMobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
