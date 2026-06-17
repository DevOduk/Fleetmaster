// src/app/layout.tsx
import "@/app/globals.css"; // Your global Tailwind styles
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { Outfit } from 'next/font/google';


const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <ThemeProvider>
        <SidebarProvider>
              <html lang="en">
                <body className={`${outfit.className} client-theme dark:bg-gray-900 min-h-screen`}>
                  {children}
                </body>
              </html>
        </SidebarProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}