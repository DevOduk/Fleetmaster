// components/ClientLinkInterceptor.tsx
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ClientLinkInterceptor() {
  const pathname = usePathname();

  useEffect(() => {
    const prefixes = ['/client-site', '/admin-site', '/tenant-manager'];
    const activePrefix = prefixes.find(p => pathname.startsWith(p));
    
    if (!activePrefix) return;

    // e.g., if pathname is /client-site/blexy/about, base is /client-site/blexy
    const pathParts = pathname.split('/');
    const baseSegment = `/${pathParts[1]}/${pathParts[2]}`;

    const updateLinks = () => {
      document.querySelectorAll('a').forEach((a) => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('/') && !prefixes.some(p => href.startsWith(p))) {
          a.setAttribute('href', `${baseSegment}${href}`);
        }
      });
    };

    updateLinks();
    // Re-run on navigation
  }, [pathname]);

  return null;
}