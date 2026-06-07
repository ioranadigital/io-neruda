'use client';
import { Sidebar } from './Sidebar';
import { Toaster } from 'react-hot-toast';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="ml-60 flex-1 min-w-0 p-8 overflow-y-auto overflow-x-hidden min-h-screen">
        {children}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: '#18bdc1', color: '#ffffff', border: '1px solid #70c5d0' } }}
      />
    </>
  );
}
