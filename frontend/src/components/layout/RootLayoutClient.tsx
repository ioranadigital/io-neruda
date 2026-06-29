'use client';
import { Sidebar } from './Sidebar';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="ml-60 flex-1 min-w-0 p-8 overflow-y-auto overflow-x-hidden min-h-screen">
        {children}
      </main>
    </>
  );
}
