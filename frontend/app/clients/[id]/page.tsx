'use client';

import { Sidebar } from '@/src/components/layout/Sidebar';
import ClientEditContent from '@/src/components/panels/ClientEditContent';

export default function ClientEditPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4fbf7]">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        <ClientEditContent />
      </main>
    </div>
  );
}
