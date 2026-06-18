import { Sidebar } from '@/src/components/layout/Sidebar';
import ClientsPanel from '@/src/components/panels/ClientsPanel';

export default function ClientsPage() {
  return (
    <div className="flex h-screen w-full overflow-x-hidden bg-[#f4fbf7]">
      <Sidebar />
      <main className="flex-1 min-w-0 p-8 overflow-y-auto overflow-x-hidden">
        <ClientsPanel />
      </main>
    </div>
  );
}
