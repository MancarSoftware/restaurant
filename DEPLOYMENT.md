# Despliegue

## Arquitectura recomendada

- Aplicación: Vercel o contenedor Node standalone.
- Base de datos: Neon/Supabase PostgreSQL en la misma región.
- Imágenes: Cloudinary, habilitado por variables de entorno.
- Errores: Sentry cuando se configure `SENTRY_DSN`.
- Analítica: Plausible sólo con consentimiento y objetivos de conversión claros.

Esta combinación minimiza operación para un restaurante. No requiere Kubernetes ni microservicios.

## Vercel

1. Crea PostgreSQL y copia su conexión TLS en `DATABASE_URL`.
2. Configura todas las variables obligatorias de `.env.example` con secretos aleatorios.
3. Añade Cloudinary; el disco de Vercel no es persistente.
4. Ejecuta `npm run db:deploy` y un seed con credenciales de producción seguras.
5. Despliega con `npm run build`.
6. Configura dominio, HTTPS, alertas y backup antes de abrir reservas.

## Docker

```bash
docker compose up -d postgres
npm run db:deploy
npm run db:seed
docker compose --profile full up -d --build
```

El contenedor de aplicación corre como usuario no root. Para producción, sustituye las credenciales del compose, usa un gestor de secretos y un almacenamiento persistente/Cloudinary.

## Migración y rollback

Las migraciones son forward-only y se aplican antes de cambiar tráfico. Para rollback de aplicación, conserva la imagen anterior. Si una migración destructiva fuera necesaria, divídela en expandir → migrar datos → contraer en despliegues separados.

## Observabilidad

- `/api/health` valida conectividad a la base.
- Logs estructurados registran creación/cambio de reservas y fallos de autenticación sin PII sensible.
- `AuditLog` registra mutaciones administrativas.
- Configura alerta por error rate, latencia, conexiones de DB y fallos de health check.
