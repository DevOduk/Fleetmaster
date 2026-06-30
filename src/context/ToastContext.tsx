"use client";

import { Alert, AlertColor, Snackbar, SnackbarCloseReason } from "@mui/material";
import React, { createContext, useContext, useState, ReactNode } from "react";

// 1. Explicitly structure your dynamic interface properties
interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor; // Strict Material UI types: 'success' | 'info' | 'warning' | 'error'
}

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
  hideToast: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Renamed to ToastProvider to keep your dashboard providers separate and clear
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success", // Safe fallback initialization
  });


  // 2. High-utility trigger method for clean component-level calling
  const showToast = (message: string, severity: AlertColor = "success") => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    hideToast();
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, loading, setLoading }}>
      {children}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 100000 }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "8px", fontWeight: 500 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};