'use client';

import { GeneratorProvider } from '@/src/context/GeneratorContext';
import { Sidebar } from '@/src/components/layout/Sidebar';

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GeneratorProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="ml-60 flex-1 min-w-0 p-8 overflow-y-auto overflow-x-hidden min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
          {children}
        </main>
      </div>
    </GeneratorProvider>
  );
}
