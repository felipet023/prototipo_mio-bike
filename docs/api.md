# API — Bike Store

Base URL: `http://localhost:3000/api`

## Salud
- `GET /health`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (auth)
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

## Productos
- `GET /productos` (`categoria`, `search`, `orden`, `incluirInactivos`)
- `GET /productos/:id`
- `POST /productos` (admin)
- `PUT /productos/:id` (admin)
- `DELETE /productos/:id` (admin)
- `POST /productos/:id/imagen` (admin)

## Carrito (auth)
- `GET /carrito`
- `POST /carrito/items`
- `PUT /carrito/items/:id`
- `DELETE /carrito/items/:id`
- `DELETE /carrito`

## Pedidos (auth)
- `POST /pedidos`
- `GET /pedidos/preview`
- `GET /pedidos`
- `GET /pedidos/:id`

## Pagos (auth)
- `POST /payments/simulate`

## Admin pedidos (admin)
- `GET /admin/pedidos`
- `GET /admin/pedidos/:id`
- `PUT /admin/pedidos/:id/estado`

## Admin usuarios (admin)
- `GET /admin/usuarios`
- `GET /admin/usuarios/:id`
- `PUT /admin/usuarios/:id`
- `PUT /admin/usuarios/:id/rol`
- `PUT /admin/usuarios/:id/estado`
- `DELETE /admin/usuarios/:id`

## Dashboard (admin)
- `GET /admin/dashboard`

## Reportes (admin)
- `GET /admin/reportes` (`desde`, `hasta`, `categoria`)
- `GET /admin/reportes/export`