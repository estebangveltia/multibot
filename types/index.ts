export interface User {
  id: string;
  email: string;
  rol: 'superadmin' | 'admin_empresa' | 'usuario_empresa';
  tenant_id: string;
}

export interface Tenant {
  id: string;
  nombre: string;
  createdAt: string;
}
