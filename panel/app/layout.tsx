
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <AuthProvider>
        <body>{children}</body>
      </AuthProvider>
    </html>
  );
}
