'use client';

import { Sidebar } from '@/src/components/layout/Sidebar';
import ClientEditContent from '@/src/components/panels/ClientEditContent';

export default function ClientEditPage() {
  return (
    <div className="flex h-screen w-full overflow-x-hidden">
      <Sidebar />
      <main className="ml-60 flex-1 min-w-0 h-screen overflow-x-hidden flex flex-col" style={{ backgroundColor: '#f4fbf7' }}>
        <ClientEditContent />
      </main>
    </div>
  );
}
