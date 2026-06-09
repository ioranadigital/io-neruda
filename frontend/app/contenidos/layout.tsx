'use client';

import { Sidebar } from '@/src/components/layout/Sidebar';
import { GeneratorProvider } from '@/src/context/GeneratorContext';

export default function ContenidosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GeneratorProvider>
      <div className="flex h-screen w-full overflow-x-hidden">
        <Sidebar />
        <main className="ml-60 flex-1 min-w-0 h-screen overflow-x-hidden overflow-y-auto flex flex-col" style={{ backgroundColor: '#f5f5f5' }}>
          {children}
        </main>
      </div>
    </GeneratorProvider>
  );
}
