import './globals.css';

export const metadata = {
  title: 'IO Neruda - Dashboard',
  description: 'Platform de generación de contenidos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans" style={{ backgroundColor: '#f5f5f5' }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
