# ADR 003 — Sesiones opacas persistentes

**Estado:** aceptado.

El panel tiene pocos usuarios y debe permitir revocación. Se usa un token aleatorio en cookie HTTP-only; sólo su hash vive en PostgreSQL. JWT fue descartado porque complicaría revocación y rotación sin necesidad. bcrypt protege contraseñas y cada API aplica autorización por rol.
