# Base de datos

PostgreSQL es la fuente de verdad. El esquema está en `prisma/schema.prisma` y la migración inicial en `prisma/migrations`.

## Entidades

- `User` 1—N `AuthSession` y `AuditLog`.
- `Restaurant` 1—N `OpeningHour`.
- `MenuCategory` 1—N `MenuItem`.
- `MenuItem` N—N `DietaryTag` mediante la tabla Prisma implícita.
- `Reservation`, `GalleryImage`, `Event`, `ContactMessage` y `Setting` son agregados independientes.
- `RateLimitBucket` mantiene ventanas de abuso sin conservar la IP original.

## Integridad e índices

- UUIDs para entidades; slugs, correos y claves de configuración son únicos.
- `Decimal(10,2)` evita errores binarios en precios.
- Fechas operativas usan `DATE`; las horas usan `HH:mm`, apropiado para un único huso horario.
- Categorías con platos usan borrado `Restrict`; usuarios eliminados dejan auditoría y eliminan sesiones.
- Índices cubren fecha/estado de reservas, disponibilidad/orden de carta, visibilidad de galería, eventos futuros y mensajes no leídos.

## Operación

```bash
npm run db:migrate   # desarrollo, crea una migración
npm run db:deploy    # staging/producción
npm run db:seed      # contenido y usuario de desarrollo
```

Haz backup antes de migrar producción. PostgreSQL administrado debe tener PITR o snapshots diarios y una prueba periódica de restauración.
