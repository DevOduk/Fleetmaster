import { CircularProgress } from '@mui/material'
import React from 'react'

function SimpleLoader({name}: {name: string} ) {
  return (
  <div className="py-6 flex text-brand-500 flex-col items-center justify-center min-h-[70vh]">
          <CircularProgress color="inherit" size={30} />
  
          <h4 className="mb-2 mt-3 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-xl">
            Just a moment!
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Geting {name}! Please bear with us for a moment ...
          </p>
        </div>
  )
}

export default SimpleLoader
