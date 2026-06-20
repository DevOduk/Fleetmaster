import React from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


export default function CallToAction() {
    return (
        <div className='pb-7'>
            <div className="border-gray-500 border-t max-w-7xl mx-auto mb-10"></div>

            <div className="max-w-5xl mx-auto p-0 mb-10 text-center mt-5">
                {/* Inner Card Container */}
                <div className="relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-800/80 px-6 py-12 sm:p-16 shadow-xs">

                    {/* Minimalist Background Light Flare */}
                    <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-[60px] pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                        {/* Main Hook */}
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Ready to Optimize Your Fleet Operations?
                        </h2>

                        {/* Value Prop Subtext */}
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            Claim your free domain today and deploy a premium, security-first booking engine in under five minutes.
                        </p>

                        {/* Action Row */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
                            <button className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm font-semibold border border-gray-200 dark:border-zinc-700/80 rounded-xl transition-all shadow-xs cursor-pointer dark:text-gray-50">
                                Talk to an expert
                            </button>

                            <button className="group w-full sm:w-auto px-6 py-3 bg-brand-500 dark:bg-brand-500 text-white dark:text-brand-50 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-brand-900 transition-all shadow-md cursor-pointer">
                                Start for free
                                <ArrowForwardIcon className="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
                            </button>
                        </div>

                        {/* Small Guarantee Disclaimer */}
                        <p className="text-xs text-gray-400 dark:text-zinc-500 pt-2">
                            No credit card required. Cancel or transfer custom domains anytime.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
