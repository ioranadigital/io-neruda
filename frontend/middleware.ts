/**
 * AUTH GUARD — Supabase Auth
 *
 * Bloquea el acceso a las rutas de la herramienta si no hay una sesión de
 * Supabase Auth válida. La landing pública (`/`) y `/login` quedan fuera del
 * guard a propósito.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_PATHS = [
  '/dashboard',
  '/generators',
  '/planner',
  '/contenidos',
  '/clients',
  '/silos',
  '/config',
  '/admin',
  '/templates',
  '/analytics',
  '/integraciones',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/generators/:path*',
    '/planner/:path*',
    '/contenidos/:path*',
    '/clients/:path*',
    '/silos/:path*',
    '/config/:path*',
    '/admin/:path*',
    '/templates/:path*',
    '/analytics/:path*',
    '/integraciones/:path*',
  ],
};
