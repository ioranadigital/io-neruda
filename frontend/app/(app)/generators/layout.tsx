import { GeneratorProvider } from '@/src/context/GeneratorContext';

export default function GeneratorsLayout({ children }: { children: React.ReactNode }) {
  return <GeneratorProvider>{children}</GeneratorProvider>;
}
