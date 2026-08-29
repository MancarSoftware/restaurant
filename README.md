# Casa Bruma

Plataforma web comercial para un restaurante ecuatoriano de autor. Incluye sitio público editorial, carta dinámica, solicitudes de reserva, contacto, galería, experiencias y un panel administrativo protegido con CRUD, roles, auditoría y carga de imágenes.

La marca, dirección y datos de Casa Bruma son una identidad ficticia creada para que el producto sea demostrable. Toda la información operativa principal se administra desde la base de datos.

## Stack

- Next.js 16, React 19 y TypeScript estricto.
- CSS/Tailwind 4 para tokens y estilos; Motion para revelados con reducción de movimiento.
- PostgreSQL 17 y Prisma ORM 6.
- Sesiones opacas HTTP-only con bcrypt para contraseñas.
- Zod, React Hook Form, Vitest y Playwright.
- Docker Compose, imagen standalone de Next.js y GitHub Actions.

## Estructura del proyecto

```text
restaurante/
├── .github/workflows/ci.yml        # pipeline de calidad y build
├── docs/adr/                       # decisiones arquitectónicas
├── e2e/                            # recorridos Playwright
├── prisma/
│   ├── migrations/                 # migraciones SQL versionadas
│   ├── schema.prisma               # modelo relacional
│   └── seed.ts                     # contenido y usuario inicial
├── public/images/                  # fotografía editorial optimizada
├── scripts/                        # utilidades de QA visual
├── src/
│   ├── app/
│   │   ├── (site)/                 # experiencia pública
│   │   ├── admin/                  # autenticación y backoffice
│   │   └── api/                    # Route Handlers públicos y privados
│   ├── components/                 # navegación, pie y primitivas compartidas
│   ├── features/                   # módulos de dominio y UI por funcionalidad
│   └── lib/                        # datos, auth, seguridad e infraestructura
├── API.md                          # contratos HTTP
├── ARCHITECTURE.md                 # arquitectura y evolución
├── DATABASE.md                     # entidades, relaciones e índices
├── DEPLOYMENT.md                   # operación y despliegue
├── Dockerfile                      # imagen standalone no-root
├── docker-compose.yml              # aplicación y PostgreSQL
├── next.config.ts                  # Next.js y cabeceras de seguridad
├── playwright.config.ts            # matriz E2E
└── prisma.config.ts                # schema, migraciones y seed
```

## Requisitos

- Node.js 24 y npm 11.
- Docker Desktop o una instancia compatible de PostgreSQL.

## Inicio rápido

```bash
npm install
copy .env.example .env
docker compose up -d postgres
npm run db:generate
npm run db:deploy
npm run db:seed
npm run dev
```

Abre `http://localhost:3000`. El panel está en `http://localhost:3000/admin`.

Credenciales locales del seed:

```text
correo: admin@casabruma.local
contraseña: ChangeMe-Local-2026!
```

Estas credenciales son exclusivamente de desarrollo. Cambia `SEED_ADMIN_PASSWORD` antes de sembrar cualquier entorno compartido.

## Comandos

```bash
npm run dev             # servidor local
npm run build           # build de producción
npm run start           # ejecuta el build
npm run lint            # ESLint
npm run typecheck       # TypeScript
npm test                # unitarias + integración de base de datos
npm run test:e2e        # flujos Playwright
npm run db:migrate      # nueva migración en desarrollo
npm run db:deploy       # aplica migraciones versionadas
npm run db:seed         # contenido inicial
npm run db:studio       # inspección de datos
```

## Variables de entorno

Consulta [.env.example](.env.example). `DATABASE_URL` e `IP_HASH_SECRET` son obligatorias. Cloudinary es opcional: sin sus tres variables, las cargas se guardan en `public/uploads`, apropiado para desarrollo o un servidor con disco persistente.

## Pruebas y verificación

Mantén PostgreSQL activo. `npm test` ejecuta reglas puras y una integración CRUD real. Playwright inicia/reutiliza el servidor, prueba navegación, reservas, autenticación, CRUD administrativo, consola y overflow en 320, 375, 390, 430, 768, 1024, 1280, 1440 y 1920 px.

## Documentación

- [Arquitectura](ARCHITECTURE.md)
- [API](API.md)
- [Base de datos](DATABASE.md)
- [Despliegue](DEPLOYMENT.md)
- [Decisiones arquitectónicas](docs/adr)
