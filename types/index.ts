export interface Usuario {
  id: string;
  email: string;
  rol: 'superadmin' | 'admin_empresa' | 'usuario_empresa';
  tenant_id: string;
  created_at: string;
}
