'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const redirectTo =
      process.env.NEXT_PUBLIC_RESET_PASSWORD_URL ||
      `${window.location.origin}/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo }
    );

    setLoading(false);

    if (resetError) {
      console.error('Password reset error:', resetError.message);
      setError(`Error: ${resetError.message || 'No pudimos procesar tu solicitud. Verifica el email e intenta de nuevo.'}`);
      return;
    }

    setSuccess(true);
    setEmail('');
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
          <h1 className="text-xl font-bold text-slate-900">Recuperar contraseña</h1>
          <p className="text-sm text-slate-500 mt-1">Ingresa tu email para continuar</p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="flex items-start gap-2 text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
              <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Email enviado</p>
                <p className="text-xs mt-1">
                  Revisa tu bandeja de entrada ({email || 'el email ingresado'}) para el link de recuperación.
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#4aa87a' }}
            >
              <ArrowLeft size={16} />
              Volver al login
            </Link>
          </div>
        ) : (
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
              {loading ? 'Enviando…' : 'Enviar link de recuperación'}
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

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
