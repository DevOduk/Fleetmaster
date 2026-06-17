// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
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

  // 2. GLOBAL AUTH BYPASS
  if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
    return NextResponse.next();
  }

  // 3. IDENTIFY THE SUBDOMAIN (Production & Localhost Compatible)
  let subdomain = '';

  if (hostname.includes('localhost')) {
    // Localhost: app.localhost:3000 -> parts: ['app', 'localhost']
    const parts = hostname.split('.');
    if (parts.length > 1) subdomain = parts[0];
  } else {
    // Production: app.fleetmaster-lemon.vercel.app -> target base: fleetmaster-lemon.vercel.app
    // Or if you use custom domain: app.fleetmaster.com -> target base: fleetmaster.com
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'fleetmaster-lemon.vercel.app';
    
    if (hostname !== baseDomain && hostname.endsWith(`.${baseDomain}`)) {
      subdomain = hostname.replace(`.${baseDomain}`, '');
    }
  }

  // 4. ROOT DOMAIN HANDLER (If no valid subdomain is found, or it's 'www')
  if (!subdomain || subdomain === 'www') {
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

  // 5. ADMIN DASHBOARD ROUTER (app.yourdomain.com)
  if (subdomain === 'app') {
    url.pathname = `/admin-site${pathname}`; 
    return NextResponse.rewrite(url);
  }

  // 6. TENANT SYSTEM MANAGER ROUTER (dashboard.yourdomain.com)
  if (subdomain === 'dashboard') {
    url.pathname = `/tenant-manager${pathname}`; 
    return NextResponse.rewrite(url);
  }

  // 7. UNIFORM CLIENT GROUP HANDLER (tenant-slug.yourdomain.com)
  url.pathname = `/client-site/${subdomain}${pathname}`;
  return NextResponse.rewrite(url);
}