# ADR 001 — Next.js como monolito modular

**Estado:** aceptado.

El producto necesita SEO, renderizado de contenido, formularios, autenticación y un panel administrativo, pero no equipos ni escalas que justifiquen servicios separados. Se elige Next.js con Route Handlers y módulos por dominio. NestJS fue descartado por duplicar despliegue, contratos e infraestructura sin beneficio actual.
