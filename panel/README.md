# Panel Administrativo Multi-Tenant

Aplicación en Next.js que permite gestionar la información del bot para distintos clientes. Utiliza TailwindCSS y Supabase para el almacenamiento.

## Desarrollo

1. Instala las dependencias:

```bash
npm install
```

2. Inicia el entorno de desarrollo:

```bash
npm run dev
```

La aplicación se conectará al gateway y a Supabase que puedes iniciar con `docker-compose up` desde la raíz del proyecto.

## Despliegue

Para generar una versión de producción ejecuta:

```bash
npm run build
npm start
```

También puedes construir la imagen de Docker incluida en el `docker-compose.yml` principal.

