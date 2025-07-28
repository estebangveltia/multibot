import './globals.css';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <aside className="w-48 bg-gray-100 h-screen p-4">
      <nav className="flex flex-col space-y-2">
        <Link href="/dashboard">🏠 Dashboard</Link>
        {user.rol === 'superadmin' && (
          <Link href="/dashboard/superadmin">🛠 Superadmin</Link>
        )}
        {user.rol === 'admin_empresa' && (
          <Link href="/dashboard/admin_empresa">📂 Admin</Link>
        )}
        {user.rol === 'usuario_empresa' && (
          <Link href="/dashboard/usuario_empresa">📄 Usuario</Link>
        )}
      </nav>
    </aside>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
