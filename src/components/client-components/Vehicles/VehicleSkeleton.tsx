// @/components/client-components/Vehicles/VehicleSkeleton.tsx
export function VehicleSkeleton({animate}: {animate?: boolean}) {
  return (
    <div className={`mb-3 dark:bg-gray-500/10 bg-gray-500/3 shadow rounded-2xl ${animate && 'animate-pulse'}`}>
      {/* Mirroring Image Area */}
      <div className="relative w-full aspect-video bg-gray-300 dark:bg-gray-700 rounded-xl rounded-b-none" />
      
      <div className="px-3 pb-4 pt-3">
        {/* Mirroring Header Title */}
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 mb-3" />
        
        {/* Mirroring Description Row */}
        {/* <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-full mb-3" /> */}
        
        {/* Mirroring Status Indicator */}
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-1/2 mb-4" />

        {/* Mirroring Specs Tags Group */}
        <div className="mt-2 flex gap-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-10" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-14" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-12" />
        </div>

        {/* Mirroring Pricing alignment */}
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-md w-1/4 ml-auto mt-2" />

        {/* Mirroring Call to Action Button */}
        <div className="w-full h-9 bg-gray-300 dark:bg-gray-700 rounded-lg mt-3" />
      </div>
    </div>
  );
}