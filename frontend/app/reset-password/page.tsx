'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get('code');
      if (!token) {
        setError('Link inválido o expirado. Intenta recuperar tu contraseña nuevamente.');
        setValidating(false);
        return;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.exchangeCodeForSession(token);

      if (sessionError || !session) {
        setError('El link de recuperación es inválido o ha expirado. Solicita uno nuevo.');
      }

      setValidating(false);
    };

    validateToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError('No pudimos actualizar tu contraseña. Intenta de nuevo.');
      return;
    }

    setSuccess(true);
  };

  if (validating) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-4"
        style={{ backgroundColor: '#f4fbf7' }}
      >
        <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
          <p className="text-sm text-slate-600">Validando link de recuperación…</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-slate-900">Nueva contraseña</h1>
          <p className="text-sm text-slate-500 mt-1">Establece una contraseña segura</p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="flex items-start gap-2 text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
              <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Contraseña actualizada</p>
                <p className="text-xs mt-1">Puedes entrar con tu nueva contraseña.</p>
              </div>
            </div>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#4aa87a' }}
            >
              <ArrowLeft size={16} />
              Ir al login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-600 mb-1.5">
                Contraseña nueva
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#4aa87a' } as React.CSSProperties}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Mínimo 8 caracteres</p>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-xs font-semibold text-slate-600 mb-1.5">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirm"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#4aa87a' } as React.CSSProperties}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#4aa87a' }}
            >
              {loading ? 'Actualizando…' : 'Establecer contraseña'}
            </button>
          </form>
        )}

        <Link
          href="/login"
          className="mt-6 flex items-center justify-center gap-1 text-xs hover:underline"
          style={{ color: '#4aa87a' }}
        >
          <ArrowLeft size={12} />
          Volver al login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
