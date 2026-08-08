import { NextResponse } from "next/server";
import { getCachedTenant } from "@/utils/tenant-cache";

const RESERVED_SLUGS = new Set([
  "app",
  "dashboard",
  "www",
  "admin-site",
  "client-site",
  "tenant-manager",
  "api",
  "fleetmaster-lemon",
  "localhost"
]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let slug = searchParams.get("slug");

    if (!slug) {
      const hostHeader = request.headers.get("host") || "";
      const refererHeader = request.headers.get("referer") || "";
      const hostname = hostHeader.split(":")[0].toLowerCase();

      if (hostname.includes("vercel.app") && refererHeader) {
        try {
          const refererUrl = new URL(refererHeader);
          const pathSegments = refererUrl.pathname.split("/").filter(Boolean);
          const clientSiteIndex = pathSegments.indexOf("client-site");
          if (clientSiteIndex !== -1 && pathSegments[clientSiteIndex + 1]) {
            slug = pathSegments[clientSiteIndex + 1];
          }
        } catch {
          // Fall through safely
        }
      } else if (!hostname.includes("vercel.app") && hostname !== "localhost") {
        const parts = hostname.split(".");
        if (parts.length > 1 && !RESERVED_SLUGS.has(parts[0])) {
          slug = parts[0];
        }
      }
    }

    const targetSlug = slug?.trim().toLowerCase();

    if (!targetSlug || RESERVED_SLUGS.has(targetSlug)) {
      return NextResponse.json(
        { error: "Invalid or reserved tenant workspace slug", tenant: null },
        { status: 404 }
      );
    }

    const tenant = await getCachedTenant(targetSlug);

    if (!tenant) {
      return NextResponse.json(
        { error: `Requested fleet tenant workspace '${targetSlug}' does not exist`, tenant: null },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        tenant,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=59",
        },
      }
    );

  } catch (err) {
    console.error("Tenant resolution endpoint crash:", err);
    return NextResponse.json(
      { error: "Internal Server Error", tenant: null },
      { status: 500 }
    );
  }
}