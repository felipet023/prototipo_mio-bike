# Modelo de amenazas — Bike Store

## Amenazas consideradas
- SQL injection: mitigado con consultas parametrizadas (`pool.execute` con `?`).
- XSS: React escapa contenido dinámico; backend no devuelve HTML.
- Fuerza bruta en auth: rate limiting (`AUTH_RATE_LIMIT_MAX`).
- Enumeración de usuarios: respuestas genéricas en login y recuperación.
- IDOR: ownership validado en backend (carrito/pedidos).
- Escalamiento de privilegios: roles validados en backend, no se confía en frontend.
- Carga maliciosa: validación de MIME y extensión, tamaño máximo 2 MB.
- Fuga de secretos: `.env` en `.gitignore`, `.env.example` sin secretos reales.
- Carreras de inventario: transacciones con `FOR UPDATE` y verificación de stock.
- Doble envío: transacción atómica y rollback.

## Controles
- bcrypt (factor 10), JWT con expiración corta.
- Helmet, CORS restringido, límites de payload.
- Tokens de recuperación: hash SHA-256, expiración 30 min, un solo uso.
- Logs sin contraseñas, tokens ni datos de pago.