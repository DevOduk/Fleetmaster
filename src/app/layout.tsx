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