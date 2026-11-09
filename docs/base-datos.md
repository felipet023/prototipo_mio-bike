# Base de datos — Bike Store

## Motor y conexión
- Motor: MySQL 9.7.0 (InnoDB, utf8mb4).
- Base de datos: `bike_store`.
- Usuario de desarrollo: `root` (solo local; no usar en producción).
- Puerto: `3306`.

Prueba de conexión ejecutada:
```sql
SELECT 'conexion_ok' AS estado, VERSION() AS version_mysql, CURRENT_USER() AS usuario;
-- estado=conexion_ok, version_mysql=9.7.0, usuario=root@localhost
```

## Archivos SQL
- `sql/bike_store_schema.sql` — esquema inicial (tablas, PK, FK, UNIQUE, CHECK, índices).
- `sql/bike_store_seed_productos.sql` — 32 productos de ejemplo por categoría.
- `sql/002_pagos.sql` — migración que agrega la tabla `pagos` (pago simulado).

## Crear desde cero
```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS bike_store;"
mysql -u root -p < sql/bike_store_schema.sql
mysql -u root -p bike_store < sql/bike_store_seed_productos.sql
```

En Windows con MySQL Server instalado:
```bash
"C:\Program Files\MySQL\MySQL Server 9.7\bin\mysql.exe" -u root --password=root -e "DROP DATABASE IF EXISTS bike_store;"
"C:\Program Files\MySQL\MySQL Server 9.7\bin\mysql.exe" -u root --password=root < sql/bike_store_schema.sql
"C:\Program Files\MySQL\MySQL Server 9.7\bin\mysql.exe" -u root --password=root < sql/bike_store_seed_productos.sql
```

## Tablas creadas
1. `usuarios`
2. `productos`
3. `carritos`
4. `carrito_items`
5. `pedidos`
6. `detalle_pedido`
7. `tokens_recuperacion`
8. `pagos`

## Restricciones e índices verificados
- `usuarios.email` UNIQUE.
- `productos.slug` UNIQUE.
- `pedidos.numero_pedido` UNIQUE.
- `carrito_items (id_carrito, id_producto)` UNIQUE.
- `detalle_pedido (id_pedido, id_producto)` UNIQUE.
- `tokens_recuperacion.token_hash` UNIQUE.
- FKs con `ON DELETE RESTRICT/CASCADE` según trazabilidad.
- CHECK: precios, stock, rating, cantidades, montos y total = subtotal + envío.
- Índices por categoría/activo, usuario/fecha, estado/fecha, fulltext nombre/marca.

## Pruebas de restricciones ejecutadas
- Correo duplicado: `ERROR 1062 Duplicate entry` (OK).
- Stock negativo: `ERROR 1264 Out of range` (OK).
- FK inválida en `carrito_items`: `ERROR 1452 foreign key constraint fails` (OK).
- Total de pedido inconsistente: `ERROR 3819 Check constraint violated` (OK).

## Datos semilla
- 32 productos distribuidos: MTB 6, Ruta 6, Urbana 6, Eléctrica 6, Accesorios 8.
- Stock total inicial: 259 unidades.
- Usuario administrador: se crea automáticamente al iniciar el backend con `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (ver backend Fase 2).

## Adaptaciones respecto al modelo mínimo del prompt
- `rol` se modela como `ENUM('cliente','admin')` en `usuarios` (adaptación de la tabla `rol`).
- `categoria` se modela como `ENUM` en `productos` (adaptación de la tabla `categoria`).
- `marca` se almacena como columna en `productos` (adaptación de la tabla `marca`).
- `carrito` se llama `carritos`; `detalle_carrito` se llama `carrito_items`.
- `estado_pedido` se modela como `ENUM` en `pedidos`.
- `pago` no se persiste como tabla separada; el método de pago se guarda en `pedidos.metodo_pago` y el pago es simulado (sin datos sensibles).
- `token_usuario` se llama `tokens_recuperacion` y almacena solo el hash SHA-256 del token.
- Tablas opcionales `mensaje_contacto`, `servicio_taller` y `cita_taller` no se crean en esta fase (solo si se implementa esa funcionalidad).

## Limitaciones conocidas
- No hay migraciones incrementales versionadas aún; el esquema se aplica completo.
- El seed de administrador depende del backend (Fase 2).
- No se han creado pruebas automatizadas de base de datos todavía (Fase 4).