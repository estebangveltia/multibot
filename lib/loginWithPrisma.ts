import { PrismaClient } from '@prisma/client';
import { supabase } from '@/lib/supabaseClient';

const prisma = new PrismaClient();

export async function loginWithPrisma(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { success: false, error: error?.message || 'Credenciales inválidas' };
  }

  const user = await prisma.usuario.findUnique({
    where: { id: data.user.id },
    include: { tenant: true },
  });

  if (!user) {
    return { success: false, error: 'Usuario no encontrado en la base de datos' };
  }

  await prisma.auditoriaUsuario.create({
    data: {
      id_usuario: user.id,
      id_tenant: user.tenantId,
      accion: 'login',
    },
  });

  return { success: true, user };
}
