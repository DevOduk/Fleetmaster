// src/app/api/tenants/resolve/route.ts
import { NextResponse } from "next/server";
import { getCachedTenant } from "@/utils/tenant-cache";

export async function GET(request: Request) {
  try {
    // 1. Extract the slug parameter from the request URL search params
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Tenant verification slug is required" },
        { status: 400 }
      );
    }

    // 2. Resolve the tenant through the Next.js server-cache manager
    // This hits the DB on the first request, then resolves from memory for subsequent calls
    const tenant = await getCachedTenant(slug);

    // 3. If no matching tenant is found, return a clean 404
    if (!tenant) {
      return NextResponse.json(
        { error: "Requested fleet tenant workspace does not exist" },
        { status: 404 }
      );
    }

    // 4. Return the clean, camelCase tenant object matching TenantContext requirements
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