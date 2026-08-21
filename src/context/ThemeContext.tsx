"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

// 1. Add "system" to the allowed types
type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setUserTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("system");
  const [isInitialized, setIsInitialized] = useState(false);

  // 2. Load the initial theme on client mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "system"; // Defaulting to system if nothing is saved

    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  // 3. Handle applying classes to the document element
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem("theme", theme);
    const root = document.documentElement;

    // Helper function to handle applying classes based on OS preference
    const applySystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (theme === "system") {
      // Apply immediately based on current OS setting
      applySystemTheme(mediaQuery);

      // Listen for OS setting changes dynamically while on the site
      mediaQuery.addEventListener("change", applySystemTheme);
    } else {
      // If explicit light or dark is chosen, handle it normally
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    // Clean up media query listener if theme changes
    return () => {
      mediaQuery.removeEventListener("change", applySystemTheme);
    };
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === "light") return "dark";
      if (prevTheme === "dark") return "system";
      return "light";
    });
  };

  const setUserTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setUserTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
