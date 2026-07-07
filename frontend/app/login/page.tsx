/**
 * LOGIN — MODO TEST (MOCKED)
 *
 * Valida contra credenciales fijas (`validateMockCredentials` en
 * src/lib/mockAuth.ts), sin llamar a Supabase Auth. Al validar con éxito
 * escribe la cookie `neruda_session_test` (setMockSessionCookie) que lee
 * middleware.ts para dejar pasar al resto de la app.
 *
 * Migración futura: sustituir el bloque `handleSubmit` por
 * `supabase.auth.signInWithPassword({ email, password })`.
 */
'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Lock, Mail, AlertCircle } from 'lucide-react';
import { validateMockCredentials, setMockSessionCookie } from '@/src/lib/mockAuth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateMockCredentials(email, password)) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      return;
    }

    setLoading(true);
    setMockSessionCookie(email.trim().toLowerCase());

    const redirectTo = searchParams.get('redirect') || '/dashboard';
    router.push(redirectTo);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: '#f4fbf7' }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: '#4aa87a' }}
          >
            <Sparkles size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">IO Neruda</h1>
          <p className="text-sm text-slate-500 mt-1">Acceso restringido · Agencia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@iorana.digital"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#4aa87a' } as React.CSSProperties}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#4aa87a' } as React.CSSProperties}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: '#4aa87a' }}
          >
            {loading ? 'Entrando…' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-slate-400">
          Entorno de pruebas · sesión simulada (no Supabase Auth)
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
