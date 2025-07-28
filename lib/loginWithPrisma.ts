import { supabase } from './supabaseClient';
import { prisma } from './prisma';
import { User } from '@/types';

interface LoginPayload {
  email: string;
  password: string;
}

export async function loginWithPrisma({ email, password }: LoginPayload): Promise<{ user: User | null; error: any }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { user: null, error };
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: data.user.id }
  });

  if (!usuario) {
    return { user: null, error: new Error('Usuario no encontrado') };
  }

  await prisma.auditoriaUsuario.create({
    data: {
      id_usuario: usuario.id,
      id_tenant: usuario.tenantId,
      accion: 'login'
    }
  });

  const user: User = {
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol as User['rol'],
    tenant_id: usuario.tenantId
  };

  return { user, error: null };
}
