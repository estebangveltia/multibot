import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useProtectedRoute(allowedRoles: string[]) {
  const { usuario, rol } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!usuario || !allowedRoles.includes(rol || '')) {
      router.push('/login');
    }
  }, [usuario, rol]);
}
