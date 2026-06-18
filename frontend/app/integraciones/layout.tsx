import { Sidebar } from '@/src/components/layout/Sidebar';

export default function IntegracionesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4fbf7]">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        {children}
      </main>
    </div>
  );
}
