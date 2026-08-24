// src/components/ThemeInitializer.tsx
"use client";

import { useEffect } from "react";
import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";

extend([mixPlugin]);

export function ThemeInitializer({ defaultColor = "#465fff" }) {
  useEffect(() => {
    const updateTheme = () => {
      const savedColor = localStorage.getItem("brand-color") || defaultColor;
      applyThemeVariables(savedColor);
    };

    updateTheme();

    // Keep the variables in sync when the color changes outside this component
    // or when the page is restored from the browser back-forward cache.
    window.addEventListener("storage", updateTheme);
    window.addEventListener("brand-color-change", updateTheme);
    window.addEventListener("pageshow", updateTheme);

    return () => {
      window.removeEventListener("storage", updateTheme);
      window.removeEventListener("brand-color-change", updateTheme);
      window.removeEventListener("pageshow", updateTheme);
    };
  }, [defaultColor]);

  return null;
}

export function applyThemeVariables(primaryColor: string) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const base = colord(primaryColor);

  const variables = {
    "--color-brand-50": base.lighten(0.42).desaturate(0.3).toHex(),
    "--color-brand-100": base.lighten(0.35).desaturate(0.2).toHex(),
    "--color-brand-200": base.lighten(0.25).desaturate(0.1).toHex(),
    "--color-brand-300": base.lighten(0.15).toHex(),
    "--color-brand-400": base.lighten(0.07).toHex(),
    "--color-brand-500": base.toHex(),
    "--color-brand-600": base.darken(0.08).toHex(),
    "--color-brand-700": base.darken(0.16).toHex(),
    "--color-brand-800": base.darken(0.24).toHex(),
    "--color-brand-900": base.darken(0.32).toHex(),
    "--color-brand-950": base.darken(0.4).toHex(),
  };

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}