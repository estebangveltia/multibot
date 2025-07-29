# Full Chatbot.com-like MVP

Este repositorio contiene un conjunto de servicios que juntos conforman una plataforma de chatbot multi‑servicio similar a Chatbot.com. Los componentes principales son:

- **Rasa**: motor de NLU y orquestación de diálogos.
- **Supabase**: base de datos Postgres y autenticación.
- **Gateway**: puerta de entrada que comunica el bot con el resto de servicios.
- **Panel**: interfaz administrativa multi‑tenant desarrollada en Next.js.
- **Bot UI**: cliente en React que muestra el chat al usuario final.

## Puesta en marcha rápida

1. Instala [Docker](https://www.docker.com/) y Docker Compose.
2. Copia los archivos `.env.example` que existan en cada servicio a `.env` y ajusta credenciales si es necesario.
3. Ejecuta todo el stack:

```bash
docker-compose up --build
```

Esto levantará Supabase, Rasa, el servidor de acciones, el gateway y las dos aplicaciones web.

## Desarrollo por servicio

Cada carpeta incluye su propio `README.md` con detalles adicionales. Para modificar una interfaz puedes entrar al directorio y ejecutar:

```bash
npm install
npm run dev
```

De forma predeterminada las aplicaciones web se conectan al gateway y la base de datos que levanta Docker Compose.

