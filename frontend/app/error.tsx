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
    <html>
      <body>
        <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
          <h1>Error</h1>
          <p>{error.message || 'Ocurrió un error'}</p>
          <button onClick={() => reset()}>Reintentar</button>
        </div>
      </body>
    </html>
  );
}
