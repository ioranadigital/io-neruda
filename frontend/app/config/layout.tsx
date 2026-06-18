import { Sidebar } from '@/src/components/layout/Sidebar';

export default function ConfigLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-x-hidden">
      <Sidebar />
      <main className="ml-60 flex-1 min-w-0 h-screen overflow-x-hidden overflow-y-auto flex flex-col" style={{ backgroundColor: '#f4fbf7' }}>
        {children}
      </main>
    </div>
  );
}
