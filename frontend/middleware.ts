/**
 * AUTH GUARD — MODO TEST (MOCKED)
 *
 * Muro de autenticación piloto para io-neruda. Bloquea el acceso a las rutas
 * críticas de la app si no existe la cookie de sesión simulada
 * `neruda_session_test` (ver src/lib/mockAuth.ts, que la crea/valida).
 *
 * Activación: controlada por NEXT_PUBLIC_AUTH_MODE === 'test' (.env.local).
 * Si el flag no está en 'test', el middleware deja pasar todo el tráfico sin
 * tocar Supabase ni ninguna tabla real — cero interferencia con el flujo
 * de desarrollo actual.
 *
 * Migración futura a Supabase Auth real: sustituir la lectura de la cookie
 * mock por `supabase.auth.getSession()` (vía @supabase/ssr) en este mismo
 * archivo; el resto del guard (rutas protegidas, redirect a /login) no cambia.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/src/lib/mockAuth';

const PROTECTED_PATHS = [
  '/dashboard',
  '/generators',
  '/planner',
  '/contenidos',
  '/clients',
  '/silos',
  '/config',
  '/admin',
];

export function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_AUTH_MODE !== 'test') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE_NAME);
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
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
  ],
};
