# ADR 004 — Adaptador de almacenamiento de imágenes

**Estado:** aceptado.

Las imágenes no se guardan en PostgreSQL. En desarrollo/self-host se escriben en `public/uploads`; producción serverless usa Cloudinary con el mismo endpoint. El servidor valida tamaño, MIME y firma binaria. S3 sería válido a mayor escala, pero exige más configuración operativa para este proyecto.
