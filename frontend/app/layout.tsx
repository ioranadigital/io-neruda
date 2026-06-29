import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'IO Neruda - Dashboard',
  description: 'Platform de generación de contenidos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans" style={{ backgroundColor: '#f4fbf7' }} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
