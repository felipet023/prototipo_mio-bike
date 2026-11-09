# Guía de seguridad — Bike Store

## Configuración
- Copiar `backend/.env.example` a `backend/.env`.
- Definir `JWT_SECRET` largo y aleatorio.
- Configurar `CORS_ORIGIN` con los orígenes del frontend.
- No subir `.env` ni dumps con datos reales.

## Controles implementados
- Contraseñas con bcrypt, política de 8 caracteres con mayúscula, minúscula, número y símbolo.
- JWT con expiración (`JWT_EXPIRES_IN`).
- Rate limiting global y para autenticación.
- Helmet y CORS restringido.
- Límite de payload JSON de 1 MB.
- Validación de imágenes: MIME, extensión, tamaño.
- Consultas SQL parametrizadas.
- Pago simulado: no se guardan tarjetas ni credenciales.

## Producción
- Usar HTTPS.
- Configurar cookies seguras si se migra a cookies.
- Revisar logs y secretos antes de desplegar.