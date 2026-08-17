"use client";

import { useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { ArrowRightIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";

export default function GlobalNotFound() {
  const router = useRouter();

  useEffect(() => {
    // Set document title
    document.title = "Page Not Found | FleetMaster - Fleet Management Solution";

    // Update or create description meta tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      "Oops! The page you are looking for does not exist. Return to the FleetMaster homepage to explore our fleet management solutions and services.",
    );
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white p-4 dark:bg-gray-900">
      <div className="relative z-10 w-full max-w-lg px-6 py-10 text-center shadow-2xl shadow-gray-200/50 backdrop-blur-sm transition-all dark:shadow-none">
        {/* Image Container */}
        <div className="mx-auto mb-8 w-fit transition-transform duration-500 ease-out hover:scale-105">
          <Image
            src="/images/error/404.svg"
            alt="Page Not Found"
            width={200}
            height={67}
            priority
            className="drop-shadow-xl dark:hidden"
          />
          <Image
            src="/images/error/404-dark.svg"
            alt="Page Not Found"
            width={200}
            height={67}
            priority
            className="hidden animate-bounce drop-shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:block"
          />
        </div>

        {/* Refined Text Content */}
        <h1 className="mb-4 font-semibold tracking-tight text-gray-900 dark:text-white">
          Houston, we have a problem!
        </h1>
        <p className="mx-auto mb-5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          Looks like this page took a wrong turn at the space station. 🚀 Don't
          worry, our astronaut is still exploring, but this page is lost in
          cyberspace!
        </p>

        <Button
          variant="success"
          size="sm"
          onClick={() => router.refresh()}
          endIcon={<ReplayOutlinedIcon fontSize="small" />}
          className="font-small mb-5 w-full text-sm"
        >
          Retry Connection
        </Button>

        {/* Button Group */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 sm:w-auto"
          >
            Return to Earth
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            startIcon={<ArrowRightIcon className="rotate-180" />}
            className="font-small text-sm"
          >
            Go Back in Time
          </Button>
        </div>

        {/* Subtle Identifier */}
        <p className="mt-10 text-[10px] font-medium tracking-[0.2em] text-gray-400 uppercase dark:text-gray-600">
          Error Status: 404_NOT_FOUND
        </p>
      </div>
    </div>
  );
}
