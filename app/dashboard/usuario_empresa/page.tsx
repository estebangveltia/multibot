'use client';
import protectRoute from '@/utils/protectRoute';

function UsuarioEmpresaPage() {
  return <h2 className="text-xl">Panel Usuario Empresa 📄</h2>;
}

export default protectRoute(UsuarioEmpresaPage, ['usuario_empresa']);
