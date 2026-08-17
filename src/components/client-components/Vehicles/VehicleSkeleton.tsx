// @/components/client-components/Vehicles/VehicleSkeleton.tsx
export function VehicleSkeleton({ animate }: { animate?: boolean }) {
  return (
    <div
      className={`mb-3 rounded-2xl bg-gray-500/3 shadow dark:bg-gray-500/10 ${animate && "animate-pulse"}`}
    >
      {/* Mirroring Image Area */}
      <div className="relative aspect-video w-full rounded-xl rounded-b-none bg-gray-300 dark:bg-gray-700" />

      <div className="px-3 pt-3 pb-4">
        {/* Mirroring Header Title */}
        <div className="mb-3 h-5 w-3/4 rounded-md bg-gray-300 dark:bg-gray-700" />

        {/* Mirroring Description Row */}
        {/* <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-full mb-3" /> */}

        {/* Mirroring Status Indicator */}
        <div className="mb-4 h-4 w-1/2 rounded-md bg-gray-200 dark:bg-gray-800" />

        {/* Mirroring Specs Tags Group */}
        <div className="mt-2 flex gap-4">
          <div className="h-4 w-10 rounded-md bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-14 rounded-md bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-12 rounded-md bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Mirroring Pricing alignment */}
        <div className="mt-2 ml-auto h-5 w-1/4 rounded-md bg-gray-300 dark:bg-gray-700" />

        {/* Mirroring Call to Action Button */}
        <div className="mt-3 h-9 w-full rounded-lg bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
}
