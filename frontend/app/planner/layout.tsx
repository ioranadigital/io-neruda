import { Sidebar } from '@/src/components/layout/Sidebar';

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="ml-60 flex-1 min-w-0 overflow-hidden min-h-screen flex flex-col" style={{ backgroundColor: '#f4fbf7' }}>
        {children}
      </main>
    </div>
  );
}
