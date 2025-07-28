'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function protectRoute<T>(Component: React.ComponentType<T>, roles?: string[]) {
  return function Protected(props: T) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace('/login');
        } else if (roles && !roles.includes(user.rol)) {
          router.replace('/login');
        }
      }
    }, [user, loading, router]);

    if (!user) return null;
    if (roles && !roles.includes(user.rol)) return null;
    return <Component {...props} />;
  };
}
