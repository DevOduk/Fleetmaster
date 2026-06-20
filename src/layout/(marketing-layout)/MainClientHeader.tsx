"use client";
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import Link from 'next/link';
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined"
import { usePathname } from 'next/navigation';


export default function MainClientHeader() {
    const pathname = usePathname();

    const getStyles = (path: string) => {
        return pathname?.startsWith(path)
            ? "font-bold border-b py-1 border-b-amber-600 text-amber-600 hover:text-amber-600 transition-colors flex items-center gap-0.5"
            : "font-normal hover:text-brand-600 py-1 transition-colors flex items-center gap-0.5";
    };

    return (
        <header className="sticky top-0 z-50 w-full container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            {/* Rounded floating card container:
              Includes dark mode support to match your app structure seamlessly.
            */}
            <div className="flex items-center justify-between bg-white/80 dark:bg-[#080a29]/60 backdrop-blur-md px-6 py-2.5 rounded-full border border-gray-200/50 dark:border-zinc-800/50 shadow-sm">

                {/* Logo / Brand */}
                <div className="flex items-center gap-2 cursor-pointer">

                    <Link href="/" className="">
                        <Image
                            width={154}
                            height={32}
                            className="dark:hidden"
                            src="/images/logo/logo.svg"
                            alt="Logo"
                        />
                        <Image
                            width={154}
                            height={32}
                            className="hidden dark:block"
                            src="/images/logo/logo-dark.svg"
                            alt="Logo"
                        />
                    </Link>
                </div>

                {/* Desktop Links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-zinc-400">
                    <Link href="/usage" className={getStyles('/usage')}>
                        Use cases <AddIcon fontSize='small' className="opacity-60" />
                    </Link>
                    <Link href="/pricing" className={getStyles('/pricing')}>
                        Pricing
                    </Link>
                    <Link href="/shop" className={getStyles('/shop')}>
                        Shop <ShoppingBagOutlinedIcon fontSize='small' className="opacity-60" />
                    </Link>
                    <Link href="/terms-conditions" className={getStyles('/terms-conditions')}>
                        Terms of Use
                    </Link>
                    <Link href="/contact" className={getStyles('/contact')}>
                        Contact sales
                    </Link>
                </nav>

                <div className='flex gap-2 items-center'>
                    <ThemeToggleButton />
                    {/* CTA Button */}
                    <Link href="http://app.localhost:3000" target="_blank" className="">
                        <button className="px-5 py-2 bg-white text-nowrap dark:bg-zinc-50 text-black dark:text-zinc-950 text-sm font-semibold border border-gray-200 dark:border-zinc-300 hover:border-gray-400 dark:hover:bg-zinc-200 rounded-xl shadow-sm transition-all cursor-pointer">
                            Open app
                        </button>
                    </Link>
                </div>

            </div>
        </header>
    );
}