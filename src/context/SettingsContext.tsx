"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ToasterProps } from "sonner";

type Position = ToasterProps["position"];

interface SettingsContextType {
  position: Position;
  setPosition: (pos: Position) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [position, setPositionState] = useState<Position>("top-right");

  // Load from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("preferredPopupPosition") as Position;
    if (saved) setPositionState(saved);
  }, []);

  const setPosition = (pos: Position) => {
    setPositionState(pos);
    localStorage.setItem("preferredPopupPosition", pos || "top-right");
  };

  return (
    <SettingsContext.Provider value={{ position, setPosition }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
