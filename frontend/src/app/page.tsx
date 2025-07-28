'use client';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import { useSession } from '../lib/session-context';

export default function HomePage() {
  const { role } = useSession();

  return (
    <main className="flex min-h-screen items-center justify-center">
      {role ? <Dashboard /> : <Login />}
    </main>
  );
}
