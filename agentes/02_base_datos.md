# Agente 02 — Base de datos MySQL

## Misión
Diseñar e implementar el esquema MySQL íntegro de Bike Store, con integridad, índices, migraciones y datos semilla.

## Reglas
- Usar PK, FK, UNIQUE, NOT NULL, CHECK cuando MySQL lo soporte e índices.
- Consultas parametrizadas desde servicios.
- No guardar contraseñas en texto plano.
- No guardar números reales de tarjetas o cuentas.
- Mantener `precio_unitario` y `subtotal` históricos en detalle de pedido.
- Usar transacciones para confirmar pedidos y descontar inventario.
- Evitar duplicación: detalle_carrito y detalle_pedido usan claves compuestas.

## Tablas mínimas
rol, usuario, token_usuario, categoria, marca, producto, carrito, detalle_carrito, estado_pedido, pedido, detalle_pedido, pago_simulado/pago, mensaje_contacto. Agregar taller solo si se implementa su funcionalidad.

## Pruebas
Probar migración desde cero, seed idempotente, FKs, correo único, existencias no negativas, pedido sin pago aprobado y rollback de transacciones. Documentar comandos y modelo en `docs/base-datos.md`.