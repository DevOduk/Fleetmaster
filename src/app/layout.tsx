// src/app/layout.tsx
import "@/app/globals.css";
import { ClientLinkInterceptor } from "@/components/ClientLinkInterceptor";
import { ThemeInitializer } from "@/components/ThemeInitializer";
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
            <body suppressHydrationWarning className={`${outfit.className} client-theme dark:bg-gray-900 min-h-screen`}>
              <ThemeInitializer defaultColor="#465fff" />
              {/* Inject the interceptor to fix links dynamically in the browser */}
              <ClientLinkInterceptor />
              {children}
            </body>
          </html>
        </SidebarProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}