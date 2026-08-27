import React from "react";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import Link from "next/link";

interface Pages {
  label: string;
  href: string;
}

interface SecondaryHeroProps {
  title: string;
  highlightedText?: string;
  description?: string;
  className?: string;
  pages?: Pages[];
  children?: React.ReactNode;
}

export default function SecondaryHero({
  title,
  highlightedText,
  description,
  pages,
  className,
  children,
}: SecondaryHeroProps) {
  return (
    <div className={`hero relative mb-5 overflow-hidden bg-gray-200 select-none dark:bg-gray-950 ${className}`}>
      {/* Background Masked Image */}
      {/* <div
                className="absolute top-0 right-0 w-full h-full bg-cover bg-right lg:bg-center opacity-40 lg:opacity-100 mix-blend-multiply lg:mix-blend-normal pointer-events-none"
                style={{
                    backgroundImage: `url('/images/product/BMW-MY26-X6-cosy-1-extended.jpg')`,
                    maskImage: 'linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,2) 90%)',
                    WebkitMaskImage: 'linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,2) 90%)'
                }}
            /> */}

      {/* Content Area */}
      <main className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          {pages && (
            <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase">
              {pages.map((page, index) => {
                const isLast = index === pages.length - 1;
                return (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <span className="text-gray-400 dark:text-gray-600">
                        <KeyboardArrowRightOutlinedIcon fontSize="small" />
                      </span>
                    )}
                    {isLast ? (
                      <span className="cursor-default text-gray-400 dark:text-gray-400">
                        {page.label}
                      </span>
                    ) : (
                      <Link
                        href={page.href}
                        className="text-amber-500 transition-colors hover:text-amber-600"
                      >
                        {page.label}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <h1 className="mb-3 text-2xl leading-[1.1] font-bold tracking-tight text-black sm:text-3xl dark:text-white">
            {title}{" "}
            {highlightedText && (
              <span className="from-brand-500 bg-linear-to-r to-indigo-500 bg-clip-text text-transparent">
                {highlightedText}
              </span>
            )}
          </h1>

          {description && (
            <p className="text-small max-w-2xl leading-relaxed font-normal text-gray-600 dark:text-gray-500">
              {description}
            </p>
          )}

          {children && (
            <div className="flex items-center gap-4">{children}</div>
          )}
        </div>
      </main>
    </div>
  );
}
