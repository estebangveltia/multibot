'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@/types';

interface SignInPayload {
  email: string;
  password: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (payload: SignInPayload) => Promise<{ error: any }>; 
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const signIn = async ({ email, password }: SignInPayload) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data?.user) {
      const { data: userData } = await supabase
        .from('usuarios')
        .select('id, email, rol, tenant_id')
        .eq('id', data.user.id)
        .single();
      if (userData) {
        setUser(userData);
        localStorage.setItem('auth', JSON.stringify(userData));
        await supabase.from('auditoria_usuarios').insert({
          id_usuario: userData.id,
          id_tenant: userData.tenant_id,
          accion: 'login'
        });
      }
    }
    return { error };
  };

  const signOut = async () => {
    if (user) {
      await supabase.from('auditoria_usuarios').insert({
        id_usuario: user.id,
        id_tenant: user.tenant_id,
        accion: 'logout'
      });
    }
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
