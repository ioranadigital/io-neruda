/**
 * MOCK AUTH — MODO TEST (sin Supabase)
 *
 * Fuente única de la lógica de sesión simulada usada por:
 *  - middleware.ts (lee la cookie para bloquear rutas)
 *  - app/login/page.tsx (valida credenciales fijas y crea la cookie)
 *  - Sidebar / cualquier botón de "cerrar sesión" (borra la cookie)
 *
 * Todo queda detrás de `isTestAuthMode()` (NEXT_PUBLIC_AUTH_MODE === 'test'),
 * no toca Supabase ni sus tablas.
 *
 * Migración futura: reemplazar `validateMockCredentials` por
 * `supabase.auth.signInWithPassword`, y `setMockSessionCookie` /
 * `clearMockSessionCookie` por el manejo de sesión de @supabase/ssr.
 */

export const SESSION_COOKIE_NAME = 'neruda_session_test';

export const MOCK_ADMIN_CREDENTIALS = {
  email: 'ricardo@iorana.digital',
  password: 'NerudaAdmin2026!',
};

export function isTestAuthMode(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_MODE === 'test';
}

export function validateMockCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === MOCK_ADMIN_CREDENTIALS.email &&
    password === MOCK_ADMIN_CREDENTIALS.password
  );
}

export function setMockSessionCookie(email: string): void {
  const payload = encodeURIComponent(JSON.stringify({ email, ts: Date.now() }));
  const maxAgeSeconds = 60 * 60 * 8; // 8h de sesión de prueba
  document.cookie = `${SESSION_COOKIE_NAME}=${payload}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function clearMockSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
}
