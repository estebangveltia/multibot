# Full Chat Rasa Frontend

Este repositorio contiene un ejemplo mínimo para arrancar un proyecto **Next.js 14** con **TypeScript** y **Tailwind CSS** que utiliza Supabase como base de datos. Incluye un contexto de autenticación que maneja los roles `SUPER_ADMIN`, `POWER_USER` y `USER` y guarda el estado en **LocalStorage**.

## Características

- Frontend con Next.js App Router y componentes en React.
- Estilos con Tailwind CSS y componentes de Shadcn UI (pueden añadirse siguiendo la documentación oficial).
- Autenticación mediante Supabase con jerarquía de roles y persistencia en LocalStorage.
- Gestión de estado global con React Context.
- Iconografía con Lucide React y emojis nativos.
- Esquema SQL de ejemplo para Supabase en `supabase_schema.sql` que implementa un modelo multitenant y métricas diarias por bot.

## Uso

1. Copia `.env.example` a `.env` y configura la URL y clave anónima de tu proyecto Supabase.

##postgresql://postgres:d48USIPQpMDdcZpX@db.qmiywshutueyhkepalgq.supabase.co:5432/postgres

db.qmiywshutueyhkepalgq.supabase.co

postgres

d48USIPQpMDdcZpX

2. Instala las dependencias:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Abre `http://localhost:3000` para ver la aplicación de ejemplo.

Este proyecto es una base sobre la cual puedes construir la lógica específica de chat con Rasa, añadir gráficos de uso y permitir la gestión de menús desde la interfaz de usuario.
