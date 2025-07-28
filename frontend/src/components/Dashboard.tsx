'use client';
import { useSession } from '../lib/session-context';

export default function Dashboard() {
  const { role, tenantId } = useSession();

  if (!role) return <p>Por favor inicie sesión.</p>;

  return (
    <div className="space-y-2">
      <p className="font-semibold">Rol: {role}</p>
      <p>Tenant: {tenantId}</p>
    </div>
  );
}
