# Matriz de requisitos funcionales

| RF | Descripción | Estado | Evidencia |
|---|---|---|---|
| RF-01 | Catálogo público sin login | Implementado | `GET /productos`, `CatalogPage` |
| RF-02 | Imagen, nombre, precio, disponibilidad | Implementado | Producto incluye campos |
| RF-03 | Filtro por categoría | Implementado | `?categoria=` |
| RF-04 | Orden por precio asc/desc | Implementado | `?orden=precio_asc/desc` |
| RF-05 | Agregar al carrito | Implementado | `POST /carrito/items` |
| RF-06 | Productos, cantidades, parciales, total | Implementado | `GET /carrito` |
| RF-07 | Modificar cantidades | Implementado | `PUT /carrito/items/:id` |
| RF-08 | Conservar/recuperar carrito | Implementado | Carrito persistente |
| RF-09 | Resumen antes del pago | Implementado | `GET /pedidos/preview` |
| RF-10 | Número único de pedido | Implementado | `numero_pedido` UNIQUE |
| RF-11 | Pago simulado | Implementado | `POST /payments/simulate` |
| RF-12 | Confirmación post-pago | Implementado | `ConfirmationPage` |
| RF-13 | Registro | Implementado | `POST /auth/register` |
| RF-14 | Validación de correo | Implementado | `isValidEmail`, normalización |
| RF-15 | Login | Implementado | `POST /auth/login` |
| RF-16 | Recuperación de contraseña | Implementado | `forgot/reset-password` |
| RF-17 | Registrar productos (admin) | Implementado | `POST /productos` |
| RF-18 | Actualizar precios/existencias | Implementado | `PUT /productos/:id` |
| RF-19 | Inactivar productos | Implementado | `activo=0` |
| RF-20 | Consultar/buscar/filtrar productos | Implementado | `search`, `categoria`, admin |
| RF-21 | Dashboard métricas/alertas | Implementado | `GET /admin/dashboard` |
| RF-22 | Ventas totales | Implementado | Agregación SQL |
| RF-23 | Productos más vendidos | Implementado | Top productos |
| RF-24 | Cantidad de pedidos | Implementado | Conteos por estado |
| RF-25 | Filtros por fechas/categorías | Implementado | Reportes |
| RF-26 | Exportar informes Excel/PDF | Implementado | `GET /admin/reportes/export` (Excel) |
| RF-27 | Listado de usuarios | Implementado | `GET /admin/usuarios` |
| RF-28 | Asignar roles | Implementado | `PUT /admin/usuarios/:id/rol` |
| RF-29 | Activar/desactivar cuentas | Implementado | `PUT /admin/usuarios/:id/estado` |
| RF-30 | Control de acceso por rol | Implementado | `authorize()` backend |
| RF-31 | Buscar usuarios (admin) | Implementado | `?search=` |