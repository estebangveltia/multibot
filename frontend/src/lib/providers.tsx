'use client';
import { ReactNode } from 'react';
import { SessionContextProvider } from './session-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionContextProvider>
      {children}
    </SessionContextProvider>
  );
}
