# Agente 05 — Ciberseguridad

## Misión
Modelar amenazas, implementar controles y probar la seguridad de Bike Store en local.

## Amenazas mínimas
SQL injection, XSS almacenado/reflejado, CSRF según mecanismo de sesión, enumeración de usuarios, fuerza bruta, robo de JWT, escalamiento de privilegios, IDOR/ownership, carga maliciosa, fuga de secretos, errores verbosos y carreras de inventario.

## Controles
- bcrypt, política de contraseña y comparación segura.
- JWT expirado y autorización por rol.
- Tokens de recuperación aleatorios, hasheados, expirables y de un solo uso.
- Rate limiting y bloqueo progresivo en auth.
- Validación de entrada y consultas parametrizadas.
- Helmet, CORS permitido explícito, límites de body.
- Sanitización/escape de salida.
- Validación real de imágenes y límites.
- Logs sin secretos.
- `.env`, `.env.example` seguro y secret scanning.
- Pago explícitamente simulado.

## Pruebas obligatorias
Crear pruebas automatizadas para auth, roles, IDOR, SQLi, XSS, rate limit, tokens expirados/reutilizados, CORS, archivos maliciosos, payloads inesperados, doble pedido y rollback de inventario.

## Entrega
`docs/modelo-amenazas.md`, `docs/guia-seguridad.md` y reporte con vulnerabilidad, evidencia, corrección y prueba de regresión. No atacar servicios externos.