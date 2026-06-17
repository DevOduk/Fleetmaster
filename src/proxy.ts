// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // 1. Clean the host header to remove port numbers (e.g., "oduk.localhost:3000" -> "oduk.localhost")
  const hostHeader = req.headers.get('host') || '';
  const hostname = hostHeader.split(':')[0].toLowerCase();
  const pathname = url.pathname;

  // 2. Instantly skip underlying application engine framework assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 3. GLOBAL AUTH BYPASS
  // Keep signin/signup resolving globally out of (full-width-pages)
  if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
    return NextResponse.next();
  }

  // 4. Parse Hostname Segments
  const parts = hostname.split('.');
  const isLocalhost = hostname.includes('localhost');

  // Determine if a subdomain exists based on environment structural depth
  const hasSubdomain = isLocalhost ? parts.length > 1 : parts.length > 2;

  // 5. ROOT DOMAIN HANDLER (localhost / fleetmaster.com)
  if (!hasSubdomain || parts[0] === 'www') {
    // SECURITY GUARD: Prevent root domain users from executing internal subfolder code
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

  const subdomain = parts[0];

  // 6. ADMIN DASHBOARD ROUTER (app.localhost)
  // Maps strictly to your physical `admin-site` folder
  if (subdomain === 'app') {
    url.pathname = `/admin-site${pathname}`; 
    return NextResponse.rewrite(url);
  }

  // 7. TENANT SYSTEM MANAGER ROUTER (dashboard.localhost)
  // Maps strictly to your physical `tenant-manager` folder
  if (subdomain === 'dashboard') {
    url.pathname = `/tenant-manager${pathname}`; 
    return NextResponse.rewrite(url);
  }

  // 8. UNIFORM CLIENT GROUP HANDLER (*.localhost -> e.g., oduk.localhost)
  // FIX: Because your files live inside `client-site/[tenant]`, we MUST supply the
  // subdomain string as the dynamic [tenant] parameter folder segment in the rewrite!
  url.pathname = `/client-site/${subdomain}${pathname}`;
  return NextResponse.rewrite(url);
}

// ALL PAGES

// !-------------   Main   ------------!
// hostname.com i.e fleetmaster.com
// localhost
// dashboard.hostname for managing tenants nd handling tickets

// !-------------   TENANT SIDE   ------------!
// [tenant].hostname
// app.hostname