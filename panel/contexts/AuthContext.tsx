
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Usuario } from '@/types/auth';

type AuthContextType = {
  user: Usuario | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    // Simular validación de contraseña (NO USAR EN PRODUCCIÓN)
    if (data.password !== password) {
      return { success: false, message: 'Contraseña incorrecta' };
    }

    setUser(data);
    router.push('/dashboard');
    return { success: true, message: 'Login exitoso' };
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
