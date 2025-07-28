'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Usuario } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  rol: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;

    const { data: userData } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', data.user.id)
      .single();

    setUsuario(userData);
    setRol(userData?.rol ?? null);

    await supabase.from('auditoria_usuarios').insert({
      id_usuario: data.user.id,
      id_tenant: userData.tenant_id,
      accion: 'login',
    });

    router.push('/dashboard');
    return true;
  };

  const logout = async () => {
    const id_usuario = usuario?.id;
    const id_tenant = usuario?.tenant_id;
    await supabase.auth.signOut();

    if (id_usuario && id_tenant) {
      await supabase.from('auditoria_usuarios').insert({
        id_usuario,
        id_tenant,
        accion: 'logout',
      });
    }

    setUsuario(null);
    setRol(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, rol }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
