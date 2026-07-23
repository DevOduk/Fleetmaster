// src/app/api/tenants/resolve/route.ts


import { NextResponse } from "next/server";
import { getCachedTenant } from "@/utils/tenant-cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let slug = searchParams.get("slug");

    // --- NEW: VERCEL & SUBDOMAIN AUTOMATIC DETECTION FALLBACK ---
    if (!slug) {
      const hostHeader = request.headers.get("host") || "";
      const refererHeader = request.headers.get("referer") || "";
      const hostname = hostHeader.split(":")[0].toLowerCase();

      // Case A: If on a flat Vercel preview domain (e.g., vercel.app/client-site/oduk)
      if (hostname.includes("vercel.app") && refererHeader) {
        try {
          const refererUrl = new URL(refererHeader);
          const pathSegments = refererUrl.pathname.split("/").filter(Boolean);
          
          // If the URL looks like /client-site/oduk/..., the slug is the item after 'client-site'
          const clientSiteIndex = pathSegments.indexOf("client-site");
          if (clientSiteIndex !== -1 && pathSegments[clientSiteIndex + 1]) {
            slug = pathSegments[clientSiteIndex + 1];
          }
        } catch {
          // Fall through safely if referer URL parsing fails
        }
      } 
      
      // Case B: Localhost or Production Subdomain Fallback (e.g., oduk.localhost:3000)
      else if (!hostname.includes("vercel.app") && hostname !== "localhost") {
        const parts = hostname.split(".");
        if (parts.length > 1 && parts[0] !== "app" && parts[0] !== "dashboard" && parts[0] !== "www") {
          slug = parts[0];
        }
      }
    }

    // Clean up text parameters to avoid casing discrepancies
    const targetSlug = slug?.trim().toLowerCase();

    if (!targetSlug) {
      return NextResponse.json(
        { error: "Tenant verification slug is required or could not be deduced" },
        { status: 400 }
      );
    }

    // 2. Resolve the tenant through the Next.js server-cache manager
    const tenant = await getCachedTenant(targetSlug);

    // 3. If no matching tenant is found, return a clean 404
    if (!tenant) {
      return NextResponse.json(
        { error: `Requested fleet tenant workspace '${targetSlug}' does not exist` },
        { status: 404 }
      );
    }

    // 4. Return the clean tenant object matching TenantContext requirements
    return NextResponse.json(
      {
        success: true,
        tenant, // Contains { id, name, slug, logoUrl } from the cache wrapper
      },
      {
        status: 200,
        headers: {
          // Tell browsers and CDNs to cache this JSON payload at the network edge for 10 minutes,
          // and serve stale data while revalidating in the background.
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=59",
        },
      }
    );

  } catch (err) {
    console.error("Tenant workspace resolution endpoint crash:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}