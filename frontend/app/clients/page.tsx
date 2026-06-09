'use client';

import { Sidebar } from '@/src/components/layout/Sidebar';
import ClientsPanel from '@/src/components/panels/ClientsPanel';
import { GeneratorProvider } from '@/src/context/GeneratorContext';

export default function ClientsPage() {
  return (
    <GeneratorProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="ml-60 flex-1 min-w-0 p-8 overflow-y-auto overflow-x-hidden min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
          <ClientsPanel />
        </main>
      </div>
    </GeneratorProvider>
  );
}
