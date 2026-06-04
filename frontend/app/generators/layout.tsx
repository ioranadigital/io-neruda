import { GeneratorProvider } from '@/src/context/GeneratorContext';

export const metadata = {
  title: 'Content Generator | IO Neruda',
  description: 'Generate professional content in 3 clicks',
};

export default function GeneratorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GeneratorProvider>
      {children}
    </GeneratorProvider>
  );
}
