import './globals.css';
import { ErrorBoundary } from '@/src/components/shared/ErrorBoundary';
import { ToastProvider } from '@/src/components/shared/Toast';
import { OfflineIndicator } from '@/src/components/shared/OfflineIndicator';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'io-neruda Dashboard',
  description: 'Gestión de contenidos multipropósito',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans bg-white text-gray-900 min-h-screen" suppressHydrationWarning>
        <ErrorBoundary>
          <ToastProvider />
          <OfflineIndicator />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
