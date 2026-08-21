"use client"

function LoadingInfo() {
    return (
        
        <div className="mx-auto w-full max-w-6xl animate-pulse space-y-6 p-6">
            {/* Header Section Placeholder */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6 dark:border-gray-800">
                <div className="space-y-2">
                    <div className="h-6 w-48 rounded-md bg-gray-200 dark:bg-gray-600"></div>
                    <div className="h-4 w-32 rounded-md bg-gray-100 dark:bg-gray-600"></div>
                </div>
                <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-600"></div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="space-y-3 rounded-xl border border-gray-100 p-5 dark:border-gray-700"
                    >
                        <div className="h-4 w-34 rounded-md bg-gray-100 dark:bg-gray-600"></div>
                        <div className="h-8 w-19 rounded-md bg-gray-200 dark:bg-gray-600"></div>
                    </div>
                ))}
            </div>

            {/* Main Content Area / List Placeholder */}
            <div className="space-y-4 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                <div className="mb-2 h-5 w-36 rounded-md bg-gray-200 dark:bg-gray-500"></div>
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0 dark:border-gray-600"
                    >
                        <div className="flex w-full items-center space-x-3">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                            <div className="w-full max-w-[60%] space-y-2">
                                <div className="h-4 w-3/4 rounded-md bg-gray-200 dark:bg-gray-600"></div>
                                <div className="h-3 w-1/2 rounded-md bg-gray-100 dark:bg-gray-600"></div>
                            </div>
                        </div>
                        <div className="h-4 w-12 rounded-md bg-gray-100 dark:bg-gray-600"></div>
                    </div>
                ))}
            </div>

            {/* Subtle Loading Text Indicator */}
            <div className="flex items-center justify-center space-x-2 pt-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
                <span className="pl-1 text-xs font-medium text-gray-400">
                    Syncing workspace...
                </span>
            </div>
        </div>
    )
}

export default LoadingInfo
