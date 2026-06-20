import React from 'react'
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined"


interface Pages {
    label: string;
    href: string;
}

interface SecondaryHeroProps {
    title: string;
    highlightedText?: string;
    description?: string;
    pages?: Pages[];
    children?: React.ReactNode;
}

export default function SecondaryHero({
    title,
    highlightedText,
    description,
    pages,
    children
}: SecondaryHeroProps) {
    return (
        <div className='hero select-none bg-gray-200 dark:bg-gray-900 relative overflow-hidden'>
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
            <main className="max-w-7xl relative mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
                <div className="max-w-3xl space-y-4">
                    {pages && (
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                            {pages.map((page, index) => {
                                const isLast = index === pages.length - 1;
                                return (
                                    <React.Fragment key={index}>
                                        {index > 0 && <span className="text-gray-400 dark:text-gray-600"><KeyboardArrowRightOutlinedIcon fontSize='small' /></span>}
                                        {isLast ? (
                                            <span className="text-gray-400 dark:text-gray-400 cursor-default">
                                                {page.label}
                                            </span>
                                        ) : (
                                            <a href={page.href} className="text-amber-500 hover:text-amber-600 transition-colors">
                                                {page.label}
                                            </a>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}

                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-[1.1] text-black dark:text-white mb-3">
                        {title}{" "}
                        {highlightedText && (
                            <span className="bg-linear-to-r from-brand-500 to-indigo-500 bg-clip-text text-transparent">
                                {highlightedText}
                            </span>
                        )}
                    </h1>

                    {description && (
                        <p className="text-small text-gray-600 dark:text-gray-500 font-normal leading-relaxed max-w-2xl">
                            {description}
                        </p>
                    )}

                    {children && (
                        <div className="flex items-center gap-4">
                            {children}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}