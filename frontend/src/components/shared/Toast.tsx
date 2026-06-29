'use client';

// DOM-based toast — avoids react-hot-toast's React version conflict with pnpm parent node_modules

type ToastType = 'success' | 'error' | 'loading' | 'warning' | 'info';

const COLORS: Record<ToastType, { bg: string; border: string }> = {
  success: { bg: '#10b981', border: '#059669' },
  error:   { bg: '#ef4444', border: '#dc2626' },
  loading: { bg: '#6366f1', border: '#4f46e5' },
  warning: { bg: '#f59e0b', border: '#d97706' },
  info:    { bg: '#363636', border: '#222222' },
};

function spawnToast(message: string, type: ToastType): void {
  if (typeof document === 'undefined') return;

  const { bg, border } = COLORS[type];
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.style.cssText = [
    'position:fixed',
    'bottom:24px',
    'right:24px',
    'z-index:9999',
    `background:${bg}`,
    'color:#fff',
    `border:1px solid ${border}`,
    'padding:12px 20px',
    'border-radius:8px',
    'font-size:14px',
    'font-weight:500',
    'font-family:system-ui,sans-serif',
    'box-shadow:0 4px 12px rgba(0,0,0,0.2)',
    'max-width:320px',
    'word-break:break-word',
    'transition:opacity 0.3s ease',
  ].join(';');
  el.textContent = message;
  document.body.appendChild(el);

  const ttl = type === 'loading' ? 30000 : 3500;
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, ttl);
}

// No-op provider — DOM toasts don't need a React mount point
export function ToastProvider() {
  return null;
}

export const showToast = {
  success: (message: string) => spawnToast(message, 'success'),
  error:   (message: string) => spawnToast(message, 'error'),
  loading: (message: string) => spawnToast(message, 'loading'),
  warning: (message: string) => spawnToast(message, 'warning'),
  custom:  (message: string) => spawnToast(message, 'info'),
};
