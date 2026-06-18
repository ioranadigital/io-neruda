import { Sidebar } from '@/src/components/layout/Sidebar';

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4fbf7]">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
