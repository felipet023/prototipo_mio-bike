# Agente 03 — Backend y API

## Misión
Construir la API REST Express conectada a MySQL y convertir la plantilla CRUD en Bike Store.

## Arquitectura obligatoria
routes → controllers delgados → services → consultas/repositorios parametrizados. Centralizar errores, validación y configuración.

## Módulos
Auth, productos, categorías, carrito, pedidos, pago simulado, usuarios/roles, dashboard, informes y contacto. Cada módulo debe tener rutas, controlador, servicio y validadores cuando aplique.

## Seguridad
- bcrypt para hash.
- JWT con expiración y payload mínimo.
- Autorización por rol en backend.
- Ownership de carrito/pedido.
- Rate limit auth.
- CORS restringido, Helmet, límite de payload.
- Errores sin secretos ni stack en producción.
- SQL parametrizado.
- Nunca confiar en rol enviado por frontend.

## Transacciones
Pago aprobado + pedido + detalle + descuento de inventario deben ser atómicos. Rechazo, inventario insuficiente o doble envío deben dejar datos consistentes.

## Entrega
Endpoints, contratos JSON, códigos HTTP, validaciones, pruebas de integración y `docs/api.md`.