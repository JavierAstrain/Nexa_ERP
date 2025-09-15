
# NEXA ERP (Monorepo)

ERP modular y configurable para PyMEs. Monorepo con **backend (Node.js + Express + TypeScript + Prisma + PostgreSQL)** y **frontend (React + Vite + TypeScript + Tailwind)**.
Despliegue preparado para **Render.com** con `render.yaml` (servicio web para API, hosting estático para frontend y base de datos PostgreSQL gestionada).

---

## Demo local (rápido)
### 1) Requisitos
- Node 20+
- pnpm (o npm/yarn)
- PostgreSQL 14+ (también puedes usar SQLite localmente cambiando `provider` en `prisma/schema.prisma`)
- Git

### 2) Backend
```bash
cd backend
cp .env.example .env
# Edita .env con tu DATABASE_URL y JWT_SECRET
pnpm i
pnpm prisma:generate
pnpm prisma:migrate:dev
pnpm seed
pnpm dev
```
Esto levanta la API en `http://localhost:4000`.

**Usuario inicial** (por defecto creado por `seed`):
- email: `admin@nexaerp.com`
- password: `admin123`
- rol: `ADMIN`

### 3) Frontend
```bash
cd ../frontend
cp .env.example .env
# Si usas puerto local distinto al 4000, ajusta VITE_API_URL
pnpm i
pnpm dev
```
La app estará en `http://localhost:5173`.

---

## Despliegue en Render.com

1. **Sube este repositorio a GitHub.**
2. En Render, usa **Blueprints** e importa el repo. Detectará `render.yaml`.
3. Crea variables de entorno:
   - En servicio **nexa-erp-api**: `DATABASE_URL` (Render la inyecta al conectar la DB) y `JWT_SECRET`.
   - En **nexa-erp-frontend**: `VITE_API_URL` apuntando al dominio del backend en Render (por ejemplo: `https://nexa-erp-api.onrender.com`).
4. Render creará:
   - Postgres gestionado (plan free).
   - Servicio web Node para la API.
   - Sitio estático para el frontend.
5. Primero arranca la API. Luego el frontend.

> **Migraciones y seed en Render**
> - El `startCommand` de la API ejecuta `prisma migrate deploy`. Para cargar datos de ejemplo/usuario admin por primera vez, ejecuta manualmente el script `pnpm seed` desde el Shell de Render (una sola vez).

---

## Arquitectura (resumen)

- **Backend**: Express + Prisma + Zod + JWT. Multitenancy por `tenantId` (columna en las tablas clave). Sistema RBAC (roles, permisos).
- **Frontend**: Vite + React + TS + Tailwind + shadcn/ui. Navegación por módulos. Los módulos se muestran/ocultan según *feature toggles* del tenant.
- **Módulos** incluidos (MVP):
  - Autenticación y Usuarios (RBAC).
  - Configuración & Módulos (activar/desactivar).
  - CRM (Clientes).
  - Inventario (Productos & Stock simple).
  - Contabilidad básica (Facturas muy simples).
  - Reportes iniciales (contador de entidades).
- **Plugin System**: Registro de módulos en backend y frontend. Cada módulo expone rutas (API/UI). Los *feature toggles* controlan su disponibilidad sin despliegues.

---

## Estructura del repositorio

```
/backend
  /prisma
  /src
    /modules
      /auth
      /users
      /crm
      /inventory
      /accounting
      /reports
    index.ts
    server.ts
/frontend
  /src
    /modules
      /crm
      /inventory
      /accounting
      /reports
    /components
    /pages
    /lib
render.yaml
README.md
```

---

## Seguridad y buenas prácticas

- Tokens JWT cortos + refresh opcional (MVP: solo access token).
- Rate limit básico y CORS controlado.
- Validaciones con Zod.
- Logs con pino (prod) / consola (dev).
- Ramas recomendadas: `main` (prod), `dev` (pre), `feat/*` (nuevas features), `fix/*`.
- PRs obligatorios a `main` con CI (opcional a futuro).

---

## Roadmap sugerido

1. **Fase 1 – Setup & Deploy**: Monorepo, render.yaml, conexión DB, auth básica y panel.
2. **Fase 2 – Módulo base**: Usuarios, roles, permisos, toggles, tenants.
3. **Fase 3 – Módulos**: CRM, Inventario, Contabilidad, Reportes.
4. **Fase 4 – Pulido**: Auditoría, exportaciones, dashboards, documentación extendida.

---

## Créditos de marca
UI y componentes utilizan la paleta **NEXA** (azules). Incluye `assets/Nexa_logo.png` e `assets/Isotipo_Nexa.png` para branding.
