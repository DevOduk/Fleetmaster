// components/ClientLinkInterceptor.tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ClientLinkInterceptor() {
  const pathname = usePathname();

  useEffect(() => {
    const prefixes = ["/client-site", "/admin-site", "/tenant-manager"];
    const activePrefix = prefixes.find((p) => pathname.startsWith(p));

    if (!activePrefix) return;

    const pathParts = pathname.split("/");
    const baseSegment = `/${pathParts[1]}/${pathParts[2]}`;

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("href");

      if (href && href.startsWith(baseSegment)) {
        // Prevent Next.js Router from hijacking the navigation
        e.preventDefault();
        // Force a browser hard-refresh to the new URL
        window.location.href = href;
      }
    };

    // Attach listeners to all internal links
    document.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href");

      // Update the href attribute for the hover state
      if (
        href &&
        href.startsWith("/") &&
        !prefixes.some((p) => href.startsWith(p))
      ) {
        a.setAttribute("href", `${baseSegment}${href}`);
      }

      // Add click listener to prevent Next.js router hijacking
      a.removeEventListener("click", handleLinkClick as EventListener);
      a.addEventListener("click", handleLinkClick as EventListener);
    });
  }, [pathname]);

  return null;
}
