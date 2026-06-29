'use client';

import { GeneratorProvider } from '@/src/context/GeneratorContext';
import { Sidebar } from '@/src/components/layout/Sidebar';
import ClientNewContent from '@/src/components/panels/ClientNewContent';

export default function NewClientPage() {
  return (
    <GeneratorProvider>
      <div className="flex h-screen w-full overflow-hidden bg-[#f4fbf7]">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
          <ClientNewContent />
        </main>
      </div>
    </GeneratorProvider>
  );
}
