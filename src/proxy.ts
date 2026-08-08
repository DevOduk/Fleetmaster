// // src/proxy.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';
import { Redis } from "@upstash/redis";

const JWT_SECRET = process.env.JWT_SECRET
  ? new TextEncoder().encode(process.env.JWT_SECRET)
  : null;

const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();

  const rawHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const hostname = rawHost.split(':')[0].toLowerCase();
  const pathname = url.pathname;

  // 1. SKIP INTERNAL ASSETS & RSC ROUTER PAYLOADS
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    req.headers.get('x-nextjs-data') ||
    req.headers.get('rsc') === '1' ||
    req.headers.get('next-router-prefetch') === '1' ||
    req.headers.has('next-router-state-tree')
  ) {
    return NextResponse.next();
  }

// 2. IDENTIFY SUBDOMAIN / ROUTING SLUG
  let subdomain = '';
  const rawBaseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'fleetmaster-lemon.vercel.app';
  const baseDomain = rawBaseDomain.split(':')[0].toLowerCase();

  const isVercelDomain = hostname.endsWith('.vercel.app');
  const pathSegments = pathname.split('/').filter(Boolean); // e.g. ["client-site", "oduk"]

  if (hostname.includes('localhost')) {
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[parts.length - 1] === 'localhost') {
      subdomain = parts.slice(0, -1).join('.');
    }
  } else if (isVercelDomain) {
    // Vercel app environment: extract slug from path segment index 1
    // Example: /client-site/oduk/dashboard -> subdomain = "oduk"
    if (pathSegments[0] === 'client-site' && pathSegments[1]) {
      subdomain = pathSegments[1];
    } else if (pathSegments[0] === 'admin-site') {
      subdomain = 'app';
    } else if (pathSegments[0] === 'tenant-manager') {
      subdomain = 'dashboard';
    }
  } else if (baseDomain && hostname.endsWith(`.${baseDomain}`)) {
    // Production/Custom domain environment: extract from hostname
    subdomain = hostname.replace(`.${baseDomain}`, '');
  }

  // 3. ROOT DOMAIN / NO SUBDOMAIN HANDLER
  if (!subdomain || subdomain === 'www' || (hostname === baseDomain && !isVercelDomain)) {
    if (
      pathname.startsWith('/admin-site') ||
      pathname.startsWith('/tenant-manager') ||
      pathname.startsWith('/client-site')
    ) {
      url.pathname = '/404';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 4. SUBDOMAIN ROUTING MAPPER & REDIS LOOKUP
  let targetPathname = pathname;
  let tenantDataString = '';
  let tenantId = '';

  if (subdomain === 'app') {
    targetPathname = isVercelDomain ? pathname : `/admin-site${pathname}`;
  } else if (subdomain === 'dashboard') {
    targetPathname = isVercelDomain ? pathname : `/tenant-manager${pathname}`;
  } else {
    // For Vercel path-based routing, target path is already routed to /client-site/[subdomain]
    if (!isVercelDomain) {
      const cleanPath = pathname === '/' ? '' : pathname;
      targetPathname = `/client-site/${subdomain}${cleanPath}`;
    }

    if (redis) {
      try {
        const rawTenant: any = await redis.get(`tenant_slug:${subdomain.toLowerCase().trim()}`);
        if (rawTenant) {
          const parsedTenant = typeof rawTenant === 'string' ? JSON.parse(rawTenant) : rawTenant;
          if (parsedTenant && parsedTenant.id) {
            tenantId = parsedTenant.id;
            tenantDataString = typeof rawTenant === 'string' ? rawTenant : JSON.stringify(rawTenant);
          }
        }
      } catch (e) {
        console.error("Redis lookup failed in proxy:", e);
      }
    }
  }

  // 5. SECURITY INTERCEPTOR
  const isSignInPage = pathname.startsWith('/signin') || pathname.startsWith('/signup');
  const isRegisterPage = pathname.startsWith('/register');

  const isPrivateTenantAdmin = targetPathname.startsWith('/admin-site') && !isSignInPage && !isRegisterPage;
  const isPrivateAdmin = targetPathname.startsWith('/tenant-manager') && !isSignInPage;

  if ((isPrivateTenantAdmin || isPrivateAdmin) && JWT_SECRET) {
    const sessionToken = req.cookies.get("user_session")?.value;
    const managerSessionToken = req.cookies.get("admin_session")?.value;

    if (isPrivateTenantAdmin && !sessionToken) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    if (isPrivateAdmin && !managerSessionToken) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    try {
      if (isPrivateTenantAdmin && sessionToken) {
        const { payload } = await jose.jwtVerify(sessionToken, JWT_SECRET);
        const userRole = (payload.accountType || payload.role || "").toString().toLowerCase();

        if (!userRole.includes('admin')) {
          return NextResponse.redirect(new URL('/signin', req.url));
        }
      }

      if (isPrivateAdmin && managerSessionToken) {
        await jose.jwtVerify(managerSessionToken, JWT_SECRET);
      }
    } catch (err) {
      console.error("Proxy middleware session verification error:", err);
      const failRedirect = NextResponse.redirect(new URL('/signin', req.url));

      if (isPrivateTenantAdmin) failRedirect.cookies.delete("user_session");
      if (isPrivateAdmin) failRedirect.cookies.delete("admin_session");

      return failRedirect;
    }
  }

  // 6. EXECUTE REWRITE WITH HEADERS
  url.pathname = targetPathname;
  const requestHeaders = new Headers(req.headers);

  if (tenantId) {
    requestHeaders.set('x-tenant-id', tenantId);
    requestHeaders.set('x-tenant-data', tenantDataString);
  }

  const response = NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    },
  });

  if (tenantId) {
    response.headers.set('x-tenant-id', tenantId);
    response.headers.set('x-tenant-data', tenantDataString);
  }

  return response;
}