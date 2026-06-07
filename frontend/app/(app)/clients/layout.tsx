import { GeneratorProvider } from '@/src/context/GeneratorContext';

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return <GeneratorProvider>{children}</GeneratorProvider>;
}
