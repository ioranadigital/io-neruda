'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui', textAlign: 'center' }}>
      <h1>⚠️ Ocurrió un error</h1>
      <p style={{ color: '#666' }}>{error.message || 'Algo salió mal'}</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
