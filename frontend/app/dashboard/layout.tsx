'use client';

import { GeneratorProvider } from '@/src/context/GeneratorContext';
import { useServiceWorker } from '@/src/hooks/useServiceWorker';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  useServiceWorker();

  return <GeneratorProvider>{children}</GeneratorProvider>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
