'use client';

import { GeneratorProvider } from '@/src/context/GeneratorContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GeneratorProvider>
      {children}
    </GeneratorProvider>
  );
}
