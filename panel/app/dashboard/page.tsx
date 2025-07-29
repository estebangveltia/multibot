'use client';
import RequireAuth from '@/components/RequireAuth';
import { useAuth } from '@/contexts/AuthContext';
import SuperAdminDashboard from '@/components/dashboards/SuperAdminDashboard';
import TenantAdminDashboard from '@/components/dashboards/TenantAdminDashboard';
import UserDashboard from '@/components/dashboards/UserDashboard';

export default function Dashboard() {
  const { role } = useAuth();

  let Component = UserDashboard;
  if (role === 'SUPER_ADMIN') Component = SuperAdminDashboard;
  else if (role === 'TENANT_ADMIN') Component = TenantAdminDashboard;

  return (
    <RequireAuth>
      <Component />
    </RequireAuth>
  );
}