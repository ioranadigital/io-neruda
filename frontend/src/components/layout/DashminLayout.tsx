'use client';
import { DashminHeader } from './DashminHeader';
import { DashminSidebar } from './DashminSidebar';
import { Toaster } from 'react-hot-toast';

export function DashminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashminHeader />
      <DashminSidebar />
      <main className="lg:ml-64 mt-16 p-6" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {children}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#6045E2',
            color: '#ffffff',
            border: '1px solid #8280FD'
          }
        }}
      />
    </>
  );
}
