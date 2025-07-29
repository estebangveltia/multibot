import RequireAuth from '@/components/RequireAuth';

export default function Dashboard() {
  return (
    <RequireAuth>
      <div>Dashboard</div>
    </RequireAuth>
  );
}