import './styles/globals.css';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Full Chat Rasa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
