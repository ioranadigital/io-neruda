'use client';

import { GeneratorProvider } from '@/src/context/GeneratorContext';
import { Sidebar } from '@/src/components/layout/Sidebar';
import ClientNewContent from '@/src/components/panels/ClientNewContent';

export default function NewClientPage() {
  return (
    <GeneratorProvider>
      <div className="flex h-screen w-full overflow-x-hidden">
        <Sidebar />
        <main className="ml-60 flex-1 min-w-0 h-screen overflow-x-hidden flex flex-col" style={{ backgroundColor: '#f4fbf7' }}>
          <ClientNewContent />
        </main>
      </div>
    </GeneratorProvider>
  );
}
