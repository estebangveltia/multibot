'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type Role = 'superadmin' | 'admin' | 'superuser' | 'client';

interface SessionState {
  supabase: SupabaseClient;
  role: Role | null;
  tenantId: string | null;
  setRole: (r: Role | null) => void;
  setTenant: (id: string | null) => void;
}

const SessionContext = createContext<SessionState | undefined>(undefined);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export function SessionContextProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [tenantId, setTenant] = useState<string | null>(null);

  return (
    <SessionContext.Provider value={{ supabase, role, tenantId, setRole, setTenant }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be within SessionContextProvider');
  return ctx;
}
