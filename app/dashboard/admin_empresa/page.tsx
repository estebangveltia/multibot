'use client';
import protectRoute from '@/utils/protectRoute';

function AdminEmpresaPage() {
  return <h2 className="text-xl">Panel Admin Empresa 📂</h2>;
}

export default protectRoute(AdminEmpresaPage, ['admin_empresa']);
