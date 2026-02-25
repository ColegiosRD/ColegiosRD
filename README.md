# ColegiosRD.com

La plataforma #1 para encontrar y comparar colegios en República Dominicana. Rankings basados en datos oficiales del MINERD.

**"La excelencia no tiene precio"**

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Hosting:** Vercel (free tier)
- **Newsletter:** Brevo
- **Email:** Zoho Mail

## Setup rápido

### 1. Instalar dependencias

```bash
cd colegiosrd
npm install
```

### 2. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratis
2. Crea un nuevo proyecto (región: US East para RD)
3. Ve a Settings > API y copia:
   - Project URL
   - anon/public key
   - service_role key

### 3. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### 4. Ejecutar migraciones de base de datos

En el SQL Editor de Supabase, ejecuta en orden:

1. `supabase/migrations/001_initial_schema.sql` — Crea tablas, índices, RLS, funciones
2. `supabase/migrations/002_seed_provinces.sql` — Inserta las 35 provincias de RD

### 5. Cargar datos de prueba

```bash
npm run db:seed
```

Esto carga 25 colegios de muestra (15 privados + 10 públicos) con Open House events.

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run db:seed` | Cargar datos de prueba |
| `npm run data:import` | Importar datos del MINERD |

### Scripts de mantenimiento

```bash
# Importar/actualizar datos del MINERD
node scripts/import-minerd.js

# Recalcular ratings de todos los colegios
node scripts/calculate-ratings.js

# Actualizar Top 10 públicos por provincia
node scripts/update-top-public.js
```

## Estructura del proyecto

```
colegiosrd/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage
│   │   ├── ranking/            # Ranking con filtros
│   │   ├── school/[slug]/      # Perfil del colegio
│   │   ├── openhouse/          # Calendario Open House
│   │   ├── orgullo-publico/    # Top escuelas públicas
│   │   ├── para-colegios/      # Planes y verificación
│   │   └── api/                # API Routes
│   │       ├── schools/        # CRUD de colegios
│   │       ├── verify/         # Verificación
│   │       ├── contact/        # Solicitudes de padres
│   │       └── newsletter/     # Suscripciones
│   ├── components/             # Componentes React
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── SchoolCard.tsx
│   │   ├── RatingCircle.tsx
│   │   ├── AdBanner.tsx
│   │   ├── VerificationModal.tsx
│   │   └── AdModal.tsx
│   └── lib/                    # Utilidades
│       ├── supabase.ts         # Cliente Supabase
│       ├── types.ts            # TypeScript interfaces
│       └── utils.ts            # Funciones helper
├── supabase/migrations/        # SQL schema
├── scripts/                    # Data pipeline
├── public/                     # Assets estáticos
└── package.json
```

## Deploy en Vercel

1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com) y conecta el repo
3. Agrega las variables de entorno en Vercel Dashboard
4. Deploy automático

## Datos del MINERD

Fuentes de datos identificadas:

- **Pruebas Nacionales (2016-2024):** https://datos.gob.do/dataset/pruebas-nacionales
- **Centros Educativos:** https://datos.gob.do/dataset/centros-educativos-de-republica-dominicana
- **Portal de transparencia:** https://www.ministeriodeeducacion.gob.do/transparencia/

El script `import-minerd.js` descarga y procesa estos datos automáticamente.

## Contacto

- info@colegiosrd.com
- verificacion@colegiosrd.com
- anuncios@colegiosrd.com
