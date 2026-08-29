# API

Todas las respuestas usan `{ "data": ... }` o `{ "error": { "code", "message", "fields?" } }`. Las mutaciones administrativas requieren la cookie de sesión y origen del mismo sitio.

## Público

| Método | Ruta                            | Uso                                      |
| ------ | ------------------------------- | ---------------------------------------- |
| GET    | `/api/health`                   | Estado de aplicación y base de datos     |
| GET    | `/api/menu?category=&featured=` | Categorías y platos disponibles          |
| GET    | `/api/events`                   | Experiencias activas futuras             |
| GET    | `/api/gallery`                  | Imágenes visibles                        |
| POST   | `/api/reservations`             | Solicitud de reserva validada y limitada |
| POST   | `/api/contact`                  | Mensaje validado, honeypot y rate limit  |
| POST   | `/api/auth/login`               | Inicio de sesión administrativo          |
| POST   | `/api/auth/logout`              | Revoca la sesión actual                  |
| GET    | `/api/auth/session`             | Usuario autenticado o `null`             |

## Administración

| Recurso     | Rutas                                                                      |
| ----------- | -------------------------------------------------------------------------- |
| Dashboard   | `GET /api/admin/dashboard`                                                 |
| Carta       | `GET/POST /api/admin/menu`, `PATCH/DELETE /api/admin/menu/:id`             |
| Categorías  | `GET/POST /api/admin/categories`, `PATCH/DELETE /api/admin/categories/:id` |
| Reservas    | `GET /api/admin/reservations`, `PATCH /api/admin/reservations/:id`         |
| Galería     | `GET/POST /api/admin/gallery`, `PATCH/DELETE /api/admin/gallery/:id`       |
| Eventos     | `GET/POST /api/admin/events`, `PATCH/DELETE /api/admin/events/:id`         |
| Mensajes    | `GET /api/admin/messages`, `PATCH /api/admin/messages/:id`                 |
| Restaurante | `GET/PATCH /api/admin/settings`, `PATCH /api/admin/opening-hours`          |
| Usuarios    | `GET/POST /api/admin/users`, `PATCH /api/admin/users/:id`                  |
| Archivos    | `POST /api/admin/uploads` multipart (`file`, máximo 5 MB)                  |

Los borrados de carta, categorías, eventos y galería requieren rol `ADMIN`. Una categoría con platos devuelve `409 CATEGORY_NOT_EMPTY`.
