'use client';

import React from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center" style={{ background: '#f5f5f5' }}>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 mb-6">{error.message || 'Ocurrió un error al cargar el cliente'}</p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Reintentar
          </button>
          <Link
            href="/clients"
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}
