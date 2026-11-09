# Arquitectura — Bike Store

## Capas
Frontend (React/Vite) → servicios HTTP → API Express → controladores delgados → servicios de negocio → MySQL (mysql2, SQL parametrizado).

## Backend
- `src/app.js`: configuración Express, Helmet, CORS, rate limiting, rutas.
- `src/routes`: endpoints por módulo.
- `src/controllers`: validación de entrada y respuestas HTTP.
- `src/services`: lógica de negocio y acceso a datos.
- `src/middlewares`: autenticación, autorización, uploads, errores.
- `src/utils`: JWT, AppError, validación.

## Frontend
- `src/pages`: pantallas.
- `src/services`: clientes HTTP por módulo.
- `src/context`: sesión y usuario.
- `src/components`: componentes reutilizables.

## Seguridad
- bcrypt para contraseñas.
- JWT con expiración.
- Autorización por rol en backend.
- Ownership de carrito y pedidos.
- Transacciones para pedidos e inventario.
- Rate limiting y Helmet.

## Pago
El pago es simulado. No se almacenan tarjetas ni datos sensibles; solo método, estado y código de transacción.