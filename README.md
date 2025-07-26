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
[supabase.com](https://supabase.com), obtén la cadena de conexión y defínela en la variable de entorno `SUPABASE_DB_URL` antes de levantar los servicios. Tanto Rasa como el servidor de acciones usarán esa URL para conectarse a la base de datos PostgreSQL.

```bash
cd panel
npx prisma migrate dev
npx prisma generate
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
