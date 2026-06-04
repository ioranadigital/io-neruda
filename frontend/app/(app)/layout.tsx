'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-500 mb-8">io-neruda</h1>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className={`block px-4 py-2 rounded-lg transition ${
              isActive('/dashboard')
                ? 'bg-blue-600 text-white'
                : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/proyectos"
            className={`block px-4 py-2 rounded-lg transition ${
              isActive('/proyectos')
                ? 'bg-blue-600 text-white'
                : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Proyectos
          </Link>
          <Link
            href="/config"
            className={`block px-4 py-2 rounded-lg transition ${
              isActive('/config')
                ? 'bg-blue-600 text-white'
                : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Configuración
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>

      <Toaster />
    </div>
  );
}
