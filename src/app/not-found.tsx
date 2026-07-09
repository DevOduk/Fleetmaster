// src/app/not-found.tsx
"use client";
import Button from "@/components/ui/button/Button";
import { ArrowRightIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined"


export default function GlobalNotFound() {
  const router = useRouter();

  // console.log(router.back())
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden bg-white dark:bg-gray-900">
      <div className="relative z-10 w-full max-w-lg px-6 py-10 text-center transition-all backdrop-blur-sm  shadow-2xl shadow-gray-200/50 dark:shadow-none">
        {/* Image Container with Hover Effect */}
        <div className="mb-8 mx-auto w-fit  transition-transform duration-500 ease-out hover:scale-105">
          <Image
            src="/images/error/404.svg"
            alt="Page Not Found"
            width={200}
            height={67}
            priority
            // style={{ width: "auto", height: "auto" }}
            className="dark:hidden drop-shadow-xl"
          />
          <Image
            src="/images/error/404-dark.svg"
            alt="Page Not Found"
            width={200}
            height={67}
            priority
            // style={{ width: "auto", fill: "red" }}
            className="hidden animate-bounce dark:block drop-shadow-[0_0_25px_rgba(59,130,246,0.15)]"
          />
        </div>

        {/* Refined Text Content */}
        <h1 className="mb-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-xl">
          Houston, we have a problem!
        </h1>
        <p className="mb-5 text-base leading-relaxed text-gray-500 dark:text-gray-400 mx-auto">
          Looks like this page took a wrong turn at the space station. 🚀
          Don't worry, our astronaut is still exploring, but this page is lost in cyberspace!
        </p>
        
          <Button variant="success" size="sm"
            onClick={() => router.refresh()} endIcon={<ReplayOutlinedIcon fontSize="small" />}
            className="font-small text-sm w-full mb-5"
          >
            Retry Connection
          </Button>

        {/* Button Group */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-3 text-sm font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
          >
            Return to Earth
          </Link>
          <Button variant="outline" size="sm"
            onClick={() => router.back()} startIcon={<ArrowRightIcon className='rotate-180' />}
            className="font-small text-sm"
          >
            Go Back in Time
          </Button>
        </div>

        {/* Subtle Identifier */}
        <p className="mt-10 text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 dark:text-gray-600">
          Error Status: 404_NOT_FOUND
        </p>
      </div>
    </div >
  );
}