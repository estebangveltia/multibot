# 🧠 Frontend SaaS Multitenant con Next.js, Supabase y Prisma

Este proyecto es una plataforma base **multitenant y multiusuario**, construida con tecnologías modernas como **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Shadcn/ui**, **Supabase** y **Prisma**.

Incluye:
- Autenticación personalizada (email/contraseña con Supabase)
- Control de acceso por roles jerárquicos
- Segmentación por empresa (tenant)
- Auditoría de accesos (login/logout)
- Gestión de “contextos” por empresa

## 🚀 Tecnologías

- **Next.js 14 (App Router)**
- **React + TypeScript**
- **Tailwind CSS + Shadcn/ui**
- **Lucide React Icons**
- **Supabase (Auth + PostgreSQL)**
- **Prisma ORM**
- **React Context + LocalStorage**

## 🧩 Estructura del Proyecto

```
├── app/
│   ├── login/                     → Página de login
│   ├── dashboard/                → Vistas por rol
│   │   └── nuevo-contexto/       → Crear nuevo contexto
├── components/ui/                → Componentes reusables
├── contexts/AuthContext.tsx      → Contexto de autenticación global
├── lib/
│   ├── supabaseClient.ts         → Cliente Supabase
│   ├── loginWithPrisma.ts        → Función login con auditoría
├── prisma/schema.prisma          → Esquema de base de datos
├── types/index.ts                → Tipos TypeScript globales
├── utils/protectRoute.tsx        → Protección de rutas por rol
└── .env.local                     → Variables de entorno
```

## 🔐 Roles soportados

- `superadmin`: acceso completo al sistema
- `admin_empresa`: gestiona usuarios y contextos de su tenant
- `usuario_empresa`: acceso limitado solo a su tenant

## 🧾 Modelos Prisma

### `Tenant`
```ts
id: string (uuid)
nombre: string
```

### `Usuario`
```ts
id: string (uuid) // = Supabase user id
email: string
rol: 'superadmin' | 'admin_empresa' | 'usuario_empresa'
tenantId: string (FK)
```

### `Contexto`
```ts
id: string
nombre: string
contenido: string
tenantId: string (FK)
```

### `AuditoriaUsuario`
```ts
id: string
id_usuario: string
id_tenant: string
accion: 'login' | 'logout'
fecha: timestamp
```

## 📦 Instalación y uso local

### 1. Clonar repositorio
```bash
git clone https://github.com/tu-usuario/frontend-saas-multitenant.git
cd frontend-saas-multitenant
```

### 2. Instalar dependencias
```bash
npm install
```

npm install next react react-dom @supabase/supabase-js prisma @prisma/client lucide-react

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


npm install -D typescript @types/react @types/node


npx shadcn-ui@latest init


Asegúrate de seguir el prompt para seleccionar Tailwind y el directorio de tus componentes (components/ui por ejemplo).



npm install zod


npm install react-hook-form

# No necesitas Redux, puedes usar React Context nativo
npm install js-cookie

| Tipo            | Paquetes                                                                 |
| --------------- | ------------------------------------------------------------------------ |
| **Framework**   | `next`, `react`, `react-dom`, `typescript`                               |
| **Estilos**     | `tailwindcss`, `postcss`, `autoprefixer`, `shadcn/ui`                    |
| **Íconos**      | `lucide-react`                                                           |
| **BBDD/API**    | `@supabase/supabase-js`, `prisma`, `@prisma/client`                      |
| **Formularios** | `react-hook-form`, `zod` (opcional pero útil)                            |
| **Estado/Auth** | React Context, `js-cookie` (para mantener sesión si no usas JWT/AuthLib) |



### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local` y completa los valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
DATABASE_URL=postgresql://postgres:<tu_pass>@<host>.supabase.co:5432/postgres
```

> Obtén estos valores desde Supabase:
> - `Settings > API` para URL y anon key
> - `Settings > Database` para `DATABASE_URL`

### 4. Configurar base de datos

Ejecuta el modelo:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

O si la base ya existe:
```bash
npx prisma db pull
```

### 5. Levantar el entorno local
```bash
npm run dev
```

## 🧠 Funcionalidad destacada: Contextos

Los usuarios autenticados pueden:

- Ver contextos de su tenant
- Crear nuevos contextos (`/dashboard/nuevo-contexto`)
- Solo su empresa (tenant) puede ver o modificar estos datos

## 🧑‍💻 Licencia

Este proyecto está disponible para uso libre y puede ser adaptado a tu negocio SaaS. Agradece con una estrella ⭐ si te fue útil.


# 🏢 Multitenant Frontend App

Frontend multitenant con Next.js 14, Prisma, Supabase y autenticación personalizada.

## 🚀 Tecnologías

- **Next.js 14** + **React 18** + **TypeScript**
- **Tailwind CSS** + **Shadcn/UI**
- **Prisma** + **Supabase**
- **Lucide-react** + Emojis
- **React Context** + LocalStorage
- **Sistema de Roles (Superadmin, Admin Tenant, Usuario)**

## 🧩 Estructura




## 🔧 Instalación

```bash
npm install


---

## 🔐 `.env.example`

```env
# URL y clave del proyecto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Prisma DB URL (usa la misma que Supabase si es PostgreSQL)
DATABASE_URL=postgresql://postgres:password@db.<your-project>.supabase.co:5432/postgres
.
├── app/
│   └── page.tsx               # Página principal
├── components/
│   └── ui/                    # Componentes shadcn/ui
│   └── Navbar.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   └── supabase.ts            # Cliente Supabase
│   └── prisma.ts              # Cliente Prisma
├── prisma/
│   └── schema.prisma
├── public/
├── styles/
│   └── globals.css
├── .env.example
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── README.md


generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  rol       Rol
  tenantId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Rol {
  SUPERADMIN
  ADMIN
  USUARIO
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}


{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}


