'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function LogoutButton() {
  const { signOut } = useAuth();
  return (
    <Button onClick={signOut} className="mt-4">🔓 Salir</Button>
  );
}
