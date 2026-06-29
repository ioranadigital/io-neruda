'use client';

import React, { useEffect, useState } from 'react';
import { useOfflineSync } from '@/src/hooks/useOfflineSync';

export function OfflineIndicator() {
  const { isOnline, isSyncing, pendingCount } = useOfflineSync();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isOnline && pendingCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-sm font-medium
        flex items-center gap-2 z-50
        ${!isOnline ? 'bg-red-100 text-red-800' : ''}
        ${isOnline && (isSyncing || pendingCount > 0) ? 'bg-yellow-100 text-yellow-800' : ''}
        ${isOnline && pendingCount === 0 && !isSyncing ? 'bg-green-100 text-green-800' : ''}
      `}
    >
      {!isOnline ? (
        <>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span>Sin conexión • Cambios guardados localmente</span>
        </>
      ) : isSyncing ? (
        <>
          <div className="w-4 h-4 border-2 border-yellow-400 border-t-yellow-600 rounded-full animate-spin" />
          <span>Sincronizando...</span>
        </>
      ) : pendingCount > 0 ? (
        <>
          <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse" />
          <span>{pendingCount} cambio{pendingCount !== 1 ? 's' : ''} pendiente{pendingCount !== 1 ? 's' : ''}</span>
        </>
      ) : null}
    </div>
  );
}
