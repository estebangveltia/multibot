import './globals.css';
import type { ReactNode } from 'react';
import { Providers } from '../lib/providers';

export const metadata = {
  title: 'Multitenant Platform',
  description: 'Demo multitenant front end',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
