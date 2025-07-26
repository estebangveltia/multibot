# Full Chatbot.com-like MVP (Rasa + Gateway + Supabase + Panel + Bot UI)

## Servicios

- **supabase**: base de datos gestionada externamente
- **rasa**: motor NLU/Core con tracker_store en Supabase
- **action-server**: acciones custom (multi-tenant) + logging a archivo y DB
- **gateway**: Flask que reescribe `sender -> tenant__user`
- **panel**: Express + EJS con roles (SUPER_ADMIN, TENANT_ADMIN, ...) y dashboards
- **bot-ui**: página simple para que los usuarios hablen con el bot

### Supabase
Este proyecto utiliza una base de datos gestionada en Supabase. Crea el proyecto en

[supabase.com](https://supabase.com), obtén la cadena de conexión y defínela en la variable de entorno `SUPABASE_DB_URL` antes de levantar los servicios. Asegúrate de que tenga el prefijo `postgresql+psycopg2://`. Tanto Rasa como el servidor de acciones usarán esa URL para conectarse a la base de datos PostgreSQL. La imagen `rasa` ya incluye el driver `psycopg2-binary` (ver `rasa/Dockerfile`).

Si es la primera vez que usas Supabase, crea las tablas del tracker store ejecutando:

```bash
docker compose run --rm rasa rasa db migrate
```

```bash
cd panel
npx prisma migrate dev
npx prisma generate
```

### Configuración inicial con Supabase

1. Crea un proyecto en [Supabase](https://supabase.com) y ve a **Project settings → Database** para obtener la *Connection string* de PostgreSQL.
2. Define esa URL en la variable `SUPABASE_DB_URL` (o `DATABASE_URL` para Prisma). Puedes colocarla en los archivos `.env` o exportarla antes de ejecutar los contenedores.
3. Ejecuta las migraciones y el *seed* inicial:
   ```bash
   docker compose run --rm rasa rasa db migrate
   cd panel
   npx prisma migrate dev
   npx prisma generate
   npm run seed
   cd ..
   ```
4. Levanta los servicios sin MySQL:
   ```bash
   docker compose up -d
   ```
   Este `docker-compose.yml` no define un servicio MySQL; toda la persistencia se realiza en Supabase.

5. Ejemplos de variables en archivos `.env`:
   ```env
   # panel/.env
   DATABASE_URL="postgresql+psycopg2://usuario:password@db.supabase.co:5432/postgres"
   SESSION_SECRET="supersecret_session_key_change_me"
   PORT=8090
   SUPER_EMAIL="owner@saas.com"
   SUPER_PASSWORD="super123"
   ```
   ```env
   # action-server/.env (opcional)
   SUPABASE_DB_URL="postgresql+psycopg2://usuario:password@db.supabase.co:5432/postgres"
   PG_HOST=db.supabase.co
   PG_USER=usuario
   PG_PASSWORD=password
   PG_DB=postgres
   PG_PORT=5432
   ```

## Levantar todo

```bash
docker compose build
docker compose up -d
```

Una vez que Rasa entrenó, estará en `:5005`. El panel en `:8090`. El bot-UI en `:8084`.

## Panel

- URL: http://localhost:8090
- SUPER_ADMIN: `owner@saas.com / super123`
- TENANT_ADMIN (ejemplo): `admin@empresa1.com / admin123`

### Cron de métricas
El panel agrega métricas diariamente a `metricsdaily` con node-cron.

## Bot UI

- URL: http://localhost:8084
- Configura un tenant (ej `empresa1`) y un user (ej `user1`) y envía `menu`.

## Gateway

- URL REST: http://localhost:8000/webhook/<tenant>
- Prueba:
```bash
curl -X POST http://localhost:8000/webhook/empresa1 \
  -H "Content-Type: application/json" \
  -d '{"sender":"user1","message":"menu"}'
```

## Rasa directo (sin gateway)
```bash
curl -X POST http://localhost:5005/webhooks/rest/webhook \
  -H "Content-Type: application/json" \
  -d '{"sender":"empresa1__user1","message":"menu"}'
```

¡Disfruta! 💪
