// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose'; 

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

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

  // 2. REMOVED GLOBAL AUTH BYPASS FROM HERE 
  // (We want /signin to be processed by our subdomain routers below!)

  // 3. IDENTIFY THE SUBDOMAIN (Production & Localhost Compatible)
  let subdomain = '';

  if (hostname.includes('localhost')) {
    const parts = hostname.split('.');
    if (parts.length > 1) subdomain = parts[0];
  } else {
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'fleetmaster-lemon.vercel.app';
    
    if (hostname !== baseDomain && hostname.endsWith(`.${baseDomain}`)) {
      subdomain = hostname.replace(`.${baseDomain}`, '');
    }
  }

  // 4. ROOT DOMAIN HANDLER (If no valid subdomain is found, or it's 'www')
  if (!subdomain || subdomain === 'www') {
    // If someone hits the bare root domain (e.g. localhost:3000/signin)
    // We let it slide to the global public signin page if it exists
    if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
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

  // 5. ADMIN DASHBOARD ROUTER (app.yourdomain.com)
  if (subdomain === 'app') {
    targetPathname = `/admin-site${pathname}`; 
  }

  // 6. TENANT SYSTEM MANAGER ROUTER (dashboard.yourdomain.com)
  else if (subdomain === 'dashboard') {
    targetPathname = `/tenant-manager${pathname}`; 
  }

  // 7. UNIFORM CLIENT GROUP HANDLER (tenant-slug.yourdomain.com)
  // This will now catch "oduk.localhost:3000/signin" and map it cleanly to:
  // "/client-site/oduk/signin" which matches your [tenant] folder perfectly!
  else {
    targetPathname = `/client-site/${subdomain}${pathname}`;
  }

  // ========================================================================
  // CORE AUTH SECURITY INTERCEPTOR LAYER
  // ========================================================================
  const isPrivateAdmin = targetPathname.startsWith('/admin-site') && !pathname.startsWith('/signin');
  const isPrivateTenant = targetPathname.startsWith('/tenant-manager') && !pathname.startsWith('/signin');

  if (isPrivateAdmin || isPrivateTenant) {
    const sessionToken = req.cookies.get("user_session")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    try {
      const { payload } = await jose.jwtVerify(sessionToken, JWT_SECRET);
      const userRole = (payload.accountType || payload.role || "").toString().toLowerCase();

      if (isPrivateAdmin && !userRole.includes('admin')) {
        return NextResponse.redirect(new URL('/signin', req.url));
      }
      if (isPrivateTenant && !userRole.includes('tenant') && !userRole.includes('operator')) {
        return NextResponse.redirect(new URL('/signin', req.url));
      }

    } catch (err) {
      const failRedirect = NextResponse.redirect(new URL('/signin', req.url));
      failRedirect.cookies.delete("user_session");
      return failRedirect;
    }
  }

  // Final execution pass: rewrite target paths safely
  url.pathname = targetPathname;
  return NextResponse.rewrite(url);
}