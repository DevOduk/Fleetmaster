// // src/proxy.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import * as jose from 'jose'; 

// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// export async function proxy(req: NextRequest) {
//   const url = req.nextUrl.clone();
//   
//   const hostHeader = req.headers.get('host') || '';
//   const hostname = hostHeader.split(':')[0].toLowerCase();
//   const pathname = url.pathname;

//   // 1. Instantly skip underlying application engine framework assets
//   if (
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/api') ||
//     pathname.includes('.')
//   ) {
//     return NextResponse.next();
//   }

//   // 2. REMOVED GLOBAL AUTH BYPASS FROM HERE 
//   // (We want /signin to be processed by our subdomain routers below!)

//   // 3. IDENTIFY THE SUBDOMAIN (Production & Localhost Compatible)
//   let subdomain = '';

//   if (hostname.includes('localhost')) {
//     const parts = hostname.split('.');
//     if (parts.length > 1) subdomain = parts[0];
//   } else {
//     const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'fleetmaster-lemon.vercel.app';
//     
//     if (hostname !== baseDomain && hostname.endsWith(`.${baseDomain}`)) {
//       subdomain = hostname.replace(`.${baseDomain}`, '');
//     }
//   }

//   // 4. ROOT DOMAIN HANDLER (If no valid subdomain is found, or it's 'www')
//   if (!subdomain || subdomain === 'www') {
//     // If someone hits the bare root domain (e.g. localhost:3000/signin)
//     // We let it slide to the global public signin page if it exists
//     if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
//       return NextResponse.next();
//     }

//     if (
//       pathname.startsWith('/admin-site') || 
//       pathname.startsWith('/tenant-manager') || 
//       pathname.startsWith('/client-site')
//     ) {
//       url.pathname = '/404';
//       return NextResponse.rewrite(url);
//     }
//     return NextResponse.next();
//   }

//   // Setup variable tracking for internal rewrite target mapping
//   let targetPathname = pathname;

//   // 5. ADMIN DASHBOARD ROUTER (app.yourdomain.com)
//   if (subdomain === 'app') {
//     targetPathname = `/admin-site${pathname}`; 
//   }

//   // 6. TENANT SYSTEM MANAGER ROUTER (dashboard.yourdomain.com)
//   else if (subdomain === 'dashboard') {
//     targetPathname = `/tenant-manager${pathname}`; 
//   }

//   // 7. UNIFORM CLIENT GROUP HANDLER (tenant-slug.yourdomain.com)
//   // This will now catch "oduk.localhost:3000/signin" and map it cleanly to:
//   // "/client-site/oduk/signin" which matches your [tenant] folder perfectly!
//   else {
//     targetPathname = `/client-site/${subdomain}${pathname}`;
//   }

//   // ========================================================================
//   // CORE AUTH SECURITY INTERCEPTOR LAYER
//   // ========================================================================
//   const isPrivateTenantAdmin = targetPathname.startsWith('/admin-site') && !pathname.startsWith('/signin');
//   const isPrivateAdmin = targetPathname.startsWith('/tenant-manager') && !pathname.startsWith('/signin');

//   if (isPrivateTenantAdmin || isPrivateAdmin) {
//     const sessionToken = req.cookies.get("user_session")?.value;

//     if (!sessionToken) {
//       return NextResponse.redirect(new URL('/signin', req.url));
//     }

//     try {
//       const { payload } = await jose.jwtVerify(sessionToken, JWT_SECRET);
//       const userRole = (payload.accountType || payload.role || "").toString().toLowerCase();

//       if (isPrivateTenantAdmin && !userRole.includes('admin')) {
//         return NextResponse.redirect(new URL('/signin', req.url));
//       }
//       if (isPrivateAdmin && !userRole.includes('tenant') && !userRole.includes('operator')) {
//         return NextResponse.redirect(new URL('/signin', req.url));
//       }

//     } catch (err) {
//       const failRedirect = NextResponse.redirect(new URL('/signin', req.url));
//       failRedirect.cookies.delete("user_session");
//       return failRedirect;
//     }
//   }

//   // Final execution pass: rewrite target paths safely
//   url.pathname = targetPathname;
//   return NextResponse.rewrite(url);
// }

// src/proxy.ts (or src/middleware.ts)
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

  // 2. IDENTIFY SUBDOMAIN
  let subdomain = '';
  const rawBaseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'fleetmaster-lemon.vercel.app';
  const baseDomain = rawBaseDomain.split(':')[0].toLowerCase();

  if (hostname.includes('localhost')) {
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[parts.length - 1] === 'localhost') {
      subdomain = parts.slice(0, -1).join('.');
    }
  } else if (baseDomain && hostname.endsWith(`.${baseDomain}`)) {
    subdomain = hostname.replace(`.${baseDomain}`, '');
  }

  // 3. ROOT DOMAIN / NO SUBDOMAIN HANDLER
  if (!subdomain || subdomain === 'www' || hostname === baseDomain) {
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
    targetPathname = `/admin-site${pathname}`;
  } else if (subdomain === 'dashboard') {
    targetPathname = `/tenant-manager${pathname}`;
  } else {
    const cleanPath = pathname === '/' ? '' : pathname;
    targetPathname = `/client-site/${subdomain}${cleanPath}`;

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