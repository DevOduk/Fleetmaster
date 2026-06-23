"use client"
import { useFleet } from '@/context/FleetContext'
import React, { useRef, useEffect, useState } from 'react'
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { clearTimeout } from 'timers'

export default function HeroSlider() {
    const { vehicles, loading: loadingVehicles } = useFleet();
    const sliderRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [resetToken, setResetToken] = useState(0);

    // if (!vehicles || vehicles.length === 0) return null;

    const allImageUrls = vehicles.length > 0 ? vehicles.map(v => v?.imageUrl).filter(Boolean) : ['https://www.pigiame.co.ke/discover/wp-content/uploads/2025/06/Car-Hire-Nairobi.jpg', 'https://images.kobemotor.com/images/v70245-yi003.jpeg'];
    // const allImageUrls = ['https://www.pigiame.co.ke/discover/wp-content/uploads/2025/06/Car-Hire-Nairobi.jpg', 'https://images.kobemotor.com/images/v70245-yi003.jpeg']; 

    const triggerUserInteraction = () => {
        setResetToken((prev) => prev + 1);
    };

    useEffect(() => {
        if (allImageUrls.length <= 1) return;

        const autoScrollTimer = setInterval(() => {
            if (sliderRef.current) {
                const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
                const isAtTheEnd = scrollLeft + clientWidth >= scrollWidth - 5;

                sliderRef.current.scrollTo({
                    left: isAtTheEnd ? 0 : scrollLeft + clientWidth,
                    behavior: 'smooth'
                });
            }
        }, 5000);

        return () => clearInterval(autoScrollTimer);
    }, [allImageUrls.length, resetToken]);

    const handleScroll = (direction: 'left' | 'right') => {
        triggerUserInteraction(); // Wipes and resets the 5s timer frame immediately!

        if (sliderRef.current) {
            const { scrollLeft, clientWidth } = sliderRef.current;
            const scrollAmount = direction === 'left'
                ? scrollLeft - clientWidth
                : scrollLeft + clientWidth;

            sliderRef.current.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleDotClick = (index: number) => {
        triggerUserInteraction(); // Wipes and resets the 5s timer frame immediately!

        if (sliderRef.current) {
            const { clientWidth } = sliderRef.current;
            sliderRef.current.scrollTo({
                left: index * clientWidth,
                behavior: 'smooth'
            });
        }
    };

    // Passive scroll tracking listener for active index (keeps dot highlighting synchronized)
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const handleScrollTracking = () => {
            const { scrollLeft, clientWidth } = slider;
            if (clientWidth === 0) return;
            const targetIndex = Math.round(scrollLeft / clientWidth);
            setActiveIndex((prev) => (prev !== targetIndex ? targetIndex : prev));
        };

        slider.addEventListener("scroll", handleScrollTracking, { passive: true });
        return () => slider.removeEventListener("scroll", handleScrollTracking);
    }, [allImageUrls.length]);

    return (
        <div className='hidden xl:flex items-center relative w-full group aspect-8/5 my-auto'>
            {/* Left Button */}
            <button
                onClick={() => handleScroll('left')}
                className='absolute top-1/2 -translate-y-1/2 left-4 z-10 flex items-center justify-center rounded-full bg-white p-2 text-black backdrop-blur-sm transition hover:scale-105 active:scale-95 dark:bg-black dark:text-white dark:hover:bg-gray-800'
                aria-label="Previous slide"
            >
                <ChevronLeftIcon fontSize='medium' />
            </button>

            {/* Right Button */}
            <button
                onClick={() => handleScroll('right')}
                className='absolute top-1/2 -translate-y-1/2 right-4 z-10 flex items-center justify-center rounded-full bg-white p-2 text-black backdrop-blur-sm transition hover:scale-105 active:scale-95 dark:bg-black dark:text-white dark:hover:bg-gray-800'
                aria-label="Next slide"
            >
                <ChevronRightIcon />
            </button>

            {/* Inner Scrollable Track */}
            <div
                ref={sliderRef}
                className='flex w-full h-full overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory'
            >
                {allImageUrls.map((img, i) => (
                    <img
                        className='w-full min-w-full object-cover object-center rounded-2xl snap-start shrink-0'
                        key={i}
                        alt={'vehicle ' + i}
                        src={img}
                        style={{ filter: 'brightness(70%)' }}
                    />
                ))}
            </div>

            {/* --- FIXED DOT INDICATOR PANEL OVERLAY --- */}
            <div className='flex absolute -bottom-1.5 right-5 bg-white rounded-t-2xl dark:bg-gray-900 px-5 py-3.5 gap-2 z-20'>
                {allImageUrls.map((_, i) => {
                    const isActive = i === activeIndex;
                    return (
                        <button
                            key={`dot-${i}`}
                            onClick={() => handleDotClick(i)}
                            className={`h-2 rounded-full m-0 transition-all duration-300 outline-none ${isActive
                                ? 'w-6 bg-blue-500' // Highlighted Active Pill Indicator
                                : 'w-2 bg-gray-500 hover:bg-gray-400' // Inactive point dot color
                                }`}
                            aria-label={`Jump directly to panel view frame index number ${i + 1}`}
                        />
                    );
                })}
            </div>
        </div>
    )
}