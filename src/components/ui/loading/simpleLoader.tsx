import { CircularProgress } from "@mui/material";
import React from "react";

function SimpleLoader({ name }: { name: string }) {
  return (
    <div className="text-brand-500 flex min-h-[70vh] flex-col items-center justify-center py-6">
      <CircularProgress color="inherit" size={30} />

      <h4 className="modal-title text-theme-xl mt-3 mb-2 font-semibold text-gray-800 lg:text-xl dark:text-white/90">
        Just a moment!
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Geting {name}! Please bear with us for a moment ...
      </p>
    </div>
  );
}

export default SimpleLoader;
