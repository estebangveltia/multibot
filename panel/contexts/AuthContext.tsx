
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Usuario } from '@/types/auth';

type AuthContextType = {
  user: Usuario | null;
  role: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !user) {
      return {
        success: false,
        message: error?.message || 'Credenciales incorrectas',
      };
    }

    const { data, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !data) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    setUser(data);
    setRole(data.role);
    router.push('/dashboard');
    return { success: true, message: 'Login exitoso' };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
