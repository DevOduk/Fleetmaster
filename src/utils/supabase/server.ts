// src/utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Request-Scoped Supabase Client
 * Employs browser cookies to verify user authentication state and enforce RLS constraints.
 * Use this inside dynamic API routes, Server Actions, and authenticated Layouts/Pages.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method can be ignored if the middleware is handling it
          }
        },
      },
    }
  );
}

/**
 * Public Cache-Safe Supabase Client
 * Bypasses request-specific cookie processing to comply with Next.js static caching scopes.
 * Use this exclusively inside data-fetching handlers wrapped with `unstable_cache()`.
 */
export function createPublicClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Supplying empty accessors isolates this client from dynamic request context
        getAll() {
          return [];
        },
        setAll() {
          // No-op: Public read queries do not mutate session cookies
        },
      },
    }
  );
}