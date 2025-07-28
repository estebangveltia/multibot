'use client';
import protectRoute from '@/utils/protectRoute';

function SuperadminPage() {
  return <h2 className="text-xl">Panel Superadmin 🛠</h2>;
}

export default protectRoute(SuperadminPage, ['superadmin']);
