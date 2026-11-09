# AGENTS.md — Bike Store

## Objetivo
Transformar la plantilla existente en una tienda web funcional de bicicletas y accesorios llamada Bike Store / TUKI BIKES. No crear un proyecto paralelo: conservar `backend/`, `frontend/`, `sql/`, `docs/` y `.opencode/` si existen.

## Stack obligatorio
- Frontend: React + Vite + React Router.
- Backend: Node.js + Express.
- Base de datos: MySQL.
- Autenticación: bcrypt para contraseñas y JWT para sesión.
- API REST con arquitectura routes → controllers → services → database.

## Reglas de trabajo
1. Leer este archivo y el prompt maestro antes de cambiar código.
2. Revisar el repositorio actual antes de sobrescribirlo.
3. Trabajar por fases y ejecutar pruebas al cerrar cada fase.
4. No borrar una funcionalidad existente sin reemplazo documentado.
5. No usar datos falsos como sustituto de persistencia real.
6. Toda regla de autorización debe validarse en backend.
7. Nunca guardar contraseñas, tokens de recuperación ni datos sensibles en texto plano.
8. No implementar pagos reales: el pago es simulado.
9. Usar consultas SQL parametrizadas.
10. Actualizar README, `.env.example`, migraciones y matrices de trazabilidad.
11. No declarar terminado el proyecto si `npm run build`, las pruebas y la verificación de seguridad fallan.

## Agentes
- `agentes/01_arquitecto.md`: plan, arquitectura y dependencias.
- `agentes/02_base_datos.md`: modelo MySQL, migraciones e integridad.
- `agentes/03_backend.md`: API, lógica de negocio y autenticación.
- `agentes/04_frontend.md`: interfaz React, rutas y accesibilidad.
- `agentes/05_seguridad.md`: threat model, controles y pruebas de seguridad.
- `agentes/06_pruebas.md`: pruebas unitarias, integración, E2E y regresión.
- `agentes/07_devops.md`: configuración local, scripts y despliegue localhost.
- `agentes/08_documentacion.md`: README, API, trazabilidad y evidencias.
- `agentes/09_revisor.md`: revisión final independiente.

## Orden obligatorio
1. Diagnóstico y plan.
2. Base de datos.
3. Backend y seguridad.
4. Frontend conectado a la API.
5. Pruebas y seguridad.
6. Documentación y revisión final.
