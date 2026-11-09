# Agente 07 — DevOps y despliegue local

## Misión
Dejar Bike Store reproducible en localhost para evaluación y demostración.

## Debes preparar
- `.env.example` sin secretos reales.
- Scripts de instalación, migración, seed, dev, build, test y preview.
- Backend en puerto documentado y frontend en Vite.
- Health check `/api/health`.
- README paso a paso para Windows y Linux cuando sea posible.
- Configuración CORS local.

## Verificaciones
Instalación desde cero, migración limpia, seed, arranque de ambos servicios, build de producción, health check, pruebas y apagado/reinicio sin pérdida de integridad.

## Seguridad
No subir `.env`, dumps con contraseñas reales, JWT, tokens o claves. Añadir `.gitignore` y revisar secretos antes de entregar.