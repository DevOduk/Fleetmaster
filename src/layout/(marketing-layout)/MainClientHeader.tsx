"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import Link from "next/link";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { usePathname } from "next/navigation";

export default function MainClientHeader() {
  const pathname = usePathname();

  const getStyles = (path: string) => {
    return pathname?.startsWith(path)
      ? "font-bold border-b py-1 border-b-amber-600 text-amber-600 hover:text-amber-600 transition-colors flex items-center gap-0.5"
      : "font-normal hover:text-brand-600 py-1 transition-colors flex items-center gap-0.5";
  };

  return (
    <header className="sticky top-0 z-50 container mx-auto w-full px-4 pt-4 sm:px-6 lg:px-8">
      {/* Rounded floating card container:
              Includes dark mode support to match your app structure seamlessly.
            */}
      <div className="flex items-center justify-between rounded-full border border-gray-200/50 bg-white/80 px-6 py-2.5 shadow-sm backdrop-blur-md dark:border-zinc-800/50 dark:bg-[#080a29]/60">
        {/* Logo / Brand */}
        <div className="flex cursor-pointer items-center gap-2">
          <Link href="/" className="">
            <Image
              width={154}
              height={32}
              className="dark:hidden"
              src="/images/logo/logo.svg"
              alt=""
            />
            <Image
              width={154}
              height={32}
              className="hidden dark:block"
              src="/images/logo/logo-dark.svg"
              alt=""
            />
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex dark:text-zinc-400">
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
            className=""
          >
            <button className="cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-nowrap text-black shadow-sm transition-all hover:border-gray-400 dark:border-zinc-300 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200">
              Open app
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
