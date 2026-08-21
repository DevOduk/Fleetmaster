// src/app/layout.tsx
import "@/app/globals.css";

import Script from "next/script";

import { ClientLinkInterceptor } from "@/components/ClientLinkInterceptor";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { Outfit } from "next/font/google";

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
      <head>
        {/* Instant Theme & Dark Mode Injector Script (Prevents flash/lag before hydration) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // 1. Apply Brand Color immediately
                const savedColor = localStorage.getItem("brand-color");
                if (savedColor) {
                  document.documentElement.style.setProperty("--color-brand-500", savedColor);
                }

                // 2. Apply Light/Dark Class immediately to prevent white flash
                const savedTheme = localStorage.getItem("theme");
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                
                if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
                  document.documentElement.classList.add("dark");
                } else if (savedTheme === "light") {
                  document.documentElement.classList.remove("dark");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <ThemeProvider>
        <SidebarProvider>
          <body
            suppressHydrationWarning={true}
            className={`${outfit.className} client-theme min-h-screen dark:bg-gray-900`}
          >
            <Script
              id="strip-extension-attrs"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `(() => {
              try {
                const attrs = ['bis_skin_checked'];

                function removeAttrsFrom(el) {
                  if (!el || !el.getAttribute) return;
                  attrs.forEach(a => {
                    if (el.hasAttribute && el.hasAttribute(a)) el.removeAttribute(a);
                  });
                  if (el.querySelectorAll) {
                    for (const child of el.querySelectorAll('*')) {
                      attrs.forEach(a => {
                        if (child.hasAttribute && child.hasAttribute(a)) child.removeAttribute(a);
                      });
                    }
                  }
                }

                // Initial pass
                try { removeAttrsFrom(document.documentElement); } catch (e) {}
                try { removeAttrsFrom(document.body); } catch (e) {}

                // Observe mutations and strip attributes from new/changed nodes
                const obs = new MutationObserver(mutations => {
                  for (const m of mutations) {
                    if (m.type === 'attributes') {
                      const t = m.target;
                      if (t && t.removeAttribute) {
                        attrs.forEach(a => { if (t.hasAttribute && t.hasAttribute(a)) t.removeAttribute(a); });
                      }
                    }
                    if (m.type === 'childList') {
                      for (const n of m.addedNodes) {
                        if (n && n.nodeType === 1) {
                          try { removeAttrsFrom(n); } catch (e) {}
                        }
                      }
                    }
                  }
                });

                obs.observe(document, { attributes: true, childList: true, subtree: true });

                // Stop observing after a short grace period once hydration is expected to complete
                const STOP_AFTER = 5000; // ms
                const stop = () => { try { obs.disconnect(); } catch (e) {} };
                setTimeout(stop, STOP_AFTER);
                window.addEventListener('load', stop, { once: true });

                // Suppress errors originating from browser extensions to avoid breaking app scripts/hydration
                function isExtensionSource(src) {
                  return typeof src === 'string' && src.startsWith('chrome-extension://');
                }

                function handleWindowError(evt) {
                  try {
                    const src = evt && (evt.filename || (evt.error && evt.error.fileName));
                    if (isExtensionSource(src) || (evt && evt.message && String(evt.message).includes('chrome-extension://'))) {
                      evt.preventDefault && evt.preventDefault();
                      if (evt.stopImmediatePropagation) evt.stopImmediatePropagation();
                      return true;
                    }
                  } catch (e) {}
                }

                // Capture errors in capture phase, and for uncaught rejections
                window.addEventListener('error', function (e) { handleWindowError(e); }, true);
                window.addEventListener('unhandledrejection', function (e) {
                  try {
                    const reason = e && e.reason;
                    if (reason && reason.stack && String(reason.stack).includes('chrome-extension://')) {
                      e.preventDefault && e.preventDefault();
                      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                      return true;
                    }
                  } catch (err) {}
                }, true);

                // Provide tiny safe stubs for known globals the extension might read
                try {
                  if (typeof window.M === 'undefined') window.M = window.M || {};
                  if (typeof window.M_ID === 'undefined') window.M_ID = window.M_ID || null;
                } catch (e) {}

              } catch (e) {
                // swallow
              }
            })();`,
              }}
            />
            <ThemeInitializer defaultColor="#465fff" />
            <ClientLinkInterceptor />
            <ToastProvider>{children}</ToastProvider>
          </body>
        </SidebarProvider>
      </ThemeProvider>
    </html>
  );
}