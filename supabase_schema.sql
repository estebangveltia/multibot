-- Schema for multi-tenant Rasa chat project

create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('SUPER_ADMIN', 'POWER_USER', 'USER')),
  created_at timestamp with time zone default now()
);

create table bots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  name text not null
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid references bots(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  started_at timestamp with time zone default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender text not null,
  content text not null,
  created_at timestamp with time zone default now()
);

create table metrics_daily (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid references bots(id) on delete cascade,
  date date not null,
  interactions integer not null
);
