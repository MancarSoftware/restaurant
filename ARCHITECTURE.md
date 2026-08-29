# Arquitectura

## Decisión

Casa Bruma es un monolito modular full-stack. Next.js sirve el HTML público, la aplicación administrativa y los Route Handlers; PostgreSQL mantiene la autoridad de los datos. Esta forma reduce despliegues, latencia y coste operativo para un único restaurante, sin mezclar responsabilidades de dominio.

No se justifican microservicios, Kubernetes, GraphQL ni un almacén global de estado. El crecimiento previsible se absorbe con módulos por funcionalidad, contratos validados y servicios externos detrás de adaptadores.

## C4 — Contexto

```text
Visitante ───── sitio público ────┐
                                  │
Equipo Casa Bruma ─ panel admin ──┼─ Casa Bruma Web ─ PostgreSQL
                                  │        │
                                  └────────┴─ Cloudinary (opcional)
```

## C4 — Contenedores

```text
Navegador
  ├─ Server Components: contenido, SEO, lectura de datos
  └─ Client Components: formularios, menú móvil, diálogos, CRUD

Aplicación Next.js
  ├─ presentation: app/, components/
  ├─ application/domain: features/
  ├─ infrastructure: lib/auth, rate-limit, image-storage, db
  └─ HTTP API: app/api/

PostgreSQL
  └─ contenido, operación, sesiones, rate limits y auditoría
```

## Componentes principales

- `features/menu`: contratos de carta y administración.
- `features/reservations`: reglas de fecha, formulario público y gestión de estados.
- `features/contact`: captura y revisión de consultas.
- `features/events` y `features/gallery`: contenido editorial administrable.
- `lib/auth`: token aleatorio, hash SHA-256 persistido y cookie segura; la autorización se valida en cada endpoint.
- `lib/rate-limit`: buckets persistentes por fingerprint HMAC de IP; no almacena la IP original.
- `lib/image-storage`: validación de tamaño, MIME y firma; Cloudinary en producción o disco local.
- `lib/http`: errores normalizados y respuestas sin detalles internos.

## Renderizado y estado

El contenido SEO y de base de datos usa Server Components dinámicos. Sólo las interacciones reales hidratan JavaScript. Filtros administrativos se expresan en URL. No existe un store global: datos del servidor se actualizan por API y `router.refresh()`.

## Seguridad

- bcrypt con coste 12; nunca se persisten contraseñas planas.
- Sesiones revocables, tokens de 256 bits y cookies HTTP-only/SameSite/Secure en producción.
- Verificación de origen en mutaciones, validación Zod cliente/servidor y autorización por rol.
- Rate limit persistente en login, reservas y contacto.
- Prisma parametriza consultas; React escapa contenido; no se renderiza HTML externo.
- Cabeceras anti-sniffing, anti-frame, permisos y referrer configuradas globalmente.
- Auditoría de mutaciones administrativas relevantes.

## Escalamiento

Un futuro segundo local requiere introducir `locationId` en recursos operativos y seleccionar local en la UI; no exige separar servicios. Pedidos/pagos pueden añadirse como módulos y jobs idempotentes. Redis sólo se justificaría para alto volumen, colas o rate limits multi-región.
