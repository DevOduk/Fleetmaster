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

// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';
import { Redis } from "@upstash/redis"; // Highly recommended to avoid database hitting lags
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);


const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});



export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();

  const hostHeader = req.headers.get('host') || '';
  const hostname = hostHeader.split(':')[0].toLowerCase();
  const pathname = url.pathname;

  // 1. Instantly skip underlying application engine framework assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith('/_next') || req.headers.get('x-nextjs-data')) {
    return NextResponse.next();
  }

  // ========================================================================
  // NEW VERCEL TRIAL ROUTING CHECKERER
  // ========================================================================
  const isVercelTrial = hostname.includes('vercel.app');

  if (isVercelTrial) {
    // If accessing via the staging domain using explicit path prefixes, 
    // bypass proxy mapping and serve directly from Next.js filesystem layout
    if (
      pathname.startsWith('/client-site') ||
      pathname.startsWith('/admin-site') ||
      pathname.startsWith('/tenant-manager')
    ) {
      return NextResponse.next();
    }
  }

  // 3. IDENTIFY THE SUBDOMAIN (Production & Localhost Compatible)
  let subdomain = '';
  if (hostname.includes('localhost')) {
    const parts = hostname.split('.');
    if (parts.length > 1) subdomain = parts[0];
  } else {
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'fleetmaster';
    if (hostname !== baseDomain && hostname.endsWith(`.${baseDomain}`)) {
      subdomain = hostname.replace(`.${baseDomain}`, '');
    }
  }

  // 4. ROOT DOMAIN HANDLER (If no valid subdomain is found, or it's 'www')
  if (!subdomain || subdomain === 'www') {
    if (pathname.startsWith('/signin') || pathname.startsWith('/signup') || pathname.startsWith('/register')) {
      return NextResponse.next();
    }

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

  // Setup variable tracking for internal rewrite target mapping
  let targetPathname = pathname;
  let tenantDataString = '';
  let tenantId = '';

  // 5. ADMIN DASHBOARD ROUTER (app.yourdomain.com)
  if (subdomain === 'app') {
    targetPathname = `/admin-site${pathname}`;
  }

  // 6. TENANT SYSTEM MANAGER ROUTER (dashboard.yourdomain.com)
  else if (subdomain === 'dashboard') {
    targetPathname = `/tenant-manager${pathname}`;
  }

  // 7. UNIFORM CLIENT GROUP HANDLER (tenant-slug.yourdomain.com)
  else {
    const cleanPathname = pathname === '/' ? '' : pathname;
    targetPathname = `/client-site/${subdomain}${cleanPathname}`;

    // ========================================================================
    // NEW: INSTANT SERVER-SIDE RESOLUTION
    // ========================================================================
    try {
      // Look up tenant details in Redis cache first (Runs in < 2ms)
      let tenant: any = await redis.get(`tenant_slug:${subdomain}`);

      if (!tenant) {
        // Fallback: If not in cache, query your DB/Supabase via an internal fetch call
        const origin = url.origin;
        const res = await fetch(`${origin}/api/tenants/resolve?slug=${subdomain}`);
        if (res.ok) {
          const data = await res.json();
          tenant = data.tenant;
          // Store it in Redis for 1 hour so subsequent page clicks are blazing fast
          await redis.set(`tenant_slug:${subdomain}`, tenant, { ex: 3600 });
        }
      }

      if (tenant) {
        tenantId = tenant.id;
        tenantDataString = JSON.stringify(tenant);
      }
    } catch (e) {
      console.error("Failed to pre-resolve tenant in proxy middleware:", e);
    }
  }



  // ========================================================================
  // CORE AUTH SECURITY INTERCEPTOR LAYER
  // ========================================================================
  const isSignInPage = pathname.startsWith('/signin') || targetPathname.includes('/signin') || pathname.startsWith('/signup');
  // Explicitly identify the register page
  const isRegisterPage = pathname.startsWith('/register') || targetPathname.includes('/register');

  const isPrivateTenantAdmin = targetPathname.startsWith('/admin-site') && !isSignInPage && !isRegisterPage;
  const isPrivateAdmin = targetPathname.startsWith('/tenant-manager') && !isSignInPage;

  if (isPrivateTenantAdmin || isPrivateAdmin) {
    const sessionToken = req.cookies.get("user_session")?.value;
    const managerSessionToken = req.cookies.get("admin_session")?.value;

    // Route Guard A: /admin-site targets only need user_session
    if (isPrivateTenantAdmin && !sessionToken) {
      // The logic below already handles the redirect; 
      // by excluding isRegisterPage from isPrivateTenantAdmin above,
      // this block won't even trigger for /register
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // Route Guard B: /tenant-manager targets only need admin_session
    if (isPrivateAdmin && !managerSessionToken) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    try {
      // Validate user token rules on tenant subdomains
      if (isPrivateTenantAdmin && sessionToken) {
        const { payload } = await jose.jwtVerify(sessionToken, JWT_SECRET);
        const userRole = (payload.accountType || payload.role || "").toString().toLowerCase();

        if (!userRole.includes('admin')) {
          return NextResponse.redirect(new URL('/signin', req.url));
        }
      }

      // Validate manager token rules on the tenant-manager dashboard
      if (isPrivateAdmin && managerSessionToken) {
        await jose.jwtVerify(managerSessionToken, JWT_SECRET);
        // Add any additional overarching tenant-manager role validations here if required
      }

    } catch (err) {
      console.error("Proxy middleware session verification crash:", err);
      const failRedirect = NextResponse.redirect(new URL('/signin', req.url));

      // Selectively scrub out whichever specific context token failed validation
      if (isPrivateTenantAdmin) failRedirect.cookies.delete("user_session");
      if (isPrivateAdmin) failRedirect.cookies.delete("admin_session");

      return failRedirect;
    }
  }
  
  // Final execution pass: rewrite target paths safely and inject headers
  url.pathname = targetPathname;

  // 1. CREATE A NEW HEADERS INSTANCE OBJECT FROM THE INCOMING REQUEST
  const requestHeaders = new Headers(req.headers);

  // 2. IF A VALID TENANT WAS RESOLVED, INJECT DATA INTO THE REQUEST FLOW
  if (tenantId) {
    requestHeaders.set('x-tenant-id', tenantId);
    requestHeaders.set('x-tenant-data', tenantDataString);
  }

  // 3. PASS THE UPDATED REQUEST HEADERS DIRECTLY INSIDE THE REWRITE OPTIONS
  const response = NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    },
  });

  // Optional: Also keep them on the response headers if your client-side fetchers need them
  if (tenantId) {
    response.headers.set('x-tenant-id', tenantId);
    response.headers.set('x-tenant-data', tenantDataString);
  }

  return response;
}
