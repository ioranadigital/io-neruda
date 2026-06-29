'use client';
import { DashminHeader } from './DashminHeader';
import { DashminSidebar } from './DashminSidebar';

export function DashminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-[#f4fbf7]">
      {/* Sidebar fijo a la izquierda */}
      <DashminSidebar />

      {/* Contenido principal a la derecha */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <DashminHeader />

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
