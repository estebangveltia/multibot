-- Tabla tenants
create table if not exists tenants (
  id uuid primary key,
  nombre text not null,
  created_at timestamp default now()
);

-- Tabla usuarios
create table if not exists usuarios (
  id uuid primary key,
  email text unique,
  rol text check (rol in ('superadmin','admin_empresa','usuario_empresa')),
  tenant_id uuid references tenants(id),
  created_at timestamp default now()
);

-- Tabla auditoria_usuarios
create table if not exists auditoria_usuarios (
  id uuid primary key default gen_random_uuid(),
  id_usuario uuid references usuarios(id),
  id_tenant uuid references tenants(id),
  accion text check (accion in ('login','logout')),
  fecha timestamp default now()
);

-- Policies
alter table usuarios enable row level security;
create policy "usuario solo ve su tenant" on usuarios
  for select using ( auth.uid() = id or exists (
    select 1 from usuarios u where u.id = auth.uid() and u.rol = 'superadmin'
  ));
create policy "solo superadmin o admin de su tenant" on usuarios
  for update using (
    exists (select 1 from usuarios u where u.id = auth.uid() and (u.rol = 'superadmin' or (u.rol = 'admin_empresa' and u.tenant_id = usuarios.tenant_id)))
  );

alter table tenants enable row level security;
create policy "superadmin ve todos los tenants" on tenants
  for select using (exists (select 1 from usuarios u where u.id = auth.uid() and u.rol = 'superadmin'));
create policy "admin y usuario ven su tenant" on tenants
  for select using (exists (select 1 from usuarios u where u.id = auth.uid() and u.tenant_id = tenants.id));

alter table auditoria_usuarios enable row level security;
create policy "propios y superadmin" on auditoria_usuarios
  for select using (
    exists (select 1 from usuarios u where u.id = auth.uid() and (u.rol = 'superadmin' or u.id = auditoria_usuarios.id_usuario))
  );
