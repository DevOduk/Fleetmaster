// src/app/layout.tsx
import "@/app/globals.css";

import { ClientLinkInterceptor } from "@/components/ClientLinkInterceptor";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { Outfit } from 'next/font/google';
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "FleetMaster - Fleet Management Solution",
//   description:
//     "FleetMaster is a comprehensive fleet management solution designed to optimize vehicle operations, enhance efficiency, and reduce costs for businesses of all sizes.",
//   keywords: [
//     "Fleet Management Solution Kenya",
//     "Rental Fleet Management Nairobi, Kenya",
//     "Fleet Management Software Kenya",
//     "Fleet Management",
//     "Car Rental Management",
//     "Rental Software",
//     "Fleet Management",
//     "Vehicle Management",
//     "Fleet Optimization",
//     "Fleet Tracking",
//     "Fleet Maintenance",
//     "Fleet Analytics",
//   ]
// };

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <ToastProvider>
        <ThemeProvider>
          <SidebarProvider>
            <body suppressHydrationWarning={true} className={`${outfit.className} client-theme dark:bg-gray-900 min-h-screen`}>
              <ThemeInitializer defaultColor="#465fff" />
              <ClientLinkInterceptor />
              {children}
            </body>
          </SidebarProvider>
        </ThemeProvider>
      </ToastProvider>
    </html>
  );
}