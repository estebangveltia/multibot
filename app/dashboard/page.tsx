'use client';
import protectRoute from '@/utils/protectRoute';
import { useAuth } from '@/contexts/AuthContext';
import LogoutButton from '@/components/LogoutButton';

function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Hola {user?.email} 👋</h1>
      <p>Rol: {user?.rol}</p>
      <LogoutButton />
    </div>
  );
}

export default protectRoute(Dashboard);
