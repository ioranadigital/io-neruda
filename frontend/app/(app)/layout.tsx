import { DashminLayout } from '@/src/components/layout/DashminLayout';
import { GeneratorProvider } from '@/src/context/GeneratorContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <GeneratorProvider>
      <DashminLayout>{children}</DashminLayout>
    </GeneratorProvider>
  );
}
