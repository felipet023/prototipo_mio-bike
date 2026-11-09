# Prompt maestro para OpenCode — Bike Store / TUKI BIKES

Actúa como un equipo senior de análisis, desarrollo full-stack, bases de datos, ciberseguridad, pruebas y documentación. Trabaja sobre el repositorio existente de Bike Store; no crees un proyecto paralelo ni reemplaces la estructura principal sin justificación.

## Contexto
Bike Store es una tienda web de bicicletas deportivas y accesorios. El visitante consulta el catálogo; el cliente se registra, inicia sesión, administra su carrito, realiza una compra con pago simulado y recibe confirmación; el administrador gestiona productos, existencias, usuarios, roles, cuentas, dashboard e informes. El boceto visual de referencia usa la identidad TUKI BIKES: fondo oscuro, superficies grafito, texto claro, acento verde lima y diseño responsive.

La referencia visual es: https://azul-hidden-01778745.figma.site

## Estructura que debe conservarse
Conserva las carpetas existentes `backend/`, `frontend/`, `sql/`, `docs/`, `.opencode/` y `AGENTS.md`. Puedes crear subcarpetas, pero no muevas esas carpetas principales. Antes de modificar lee `AGENTS.md`, los README y los agentes de `OpenCode_BikeStore_Inicio/agentes/`.

## Stack
- React + Vite + React Router.
- Node.js + Express.
- MySQL con `mysql2` y SQL parametrizado; no ORM obligatorio.
- bcrypt para hash de contraseña.
- JWT con expiración para sesión.
- `multer` solo si se requieren imágenes; validar MIME, extensión, tamaño y nombre.
- Mensajes y documentación en español.

## Arquitectura
Mantén: frontend → servicios HTTP → rutas Express → controladores delgados → servicios de negocio → repositorios/consultas MySQL. Centraliza errores, validaciones, logs seguros y configuración por variables de entorno.

## Requisitos funcionales obligatorios
Implementa y prueba todos:

- RF-01 catálogo público sin login.
- RF-02 imagen, nombre, precio y disponibilidad.
- RF-03 filtro por categoría.
- RF-04 orden por precio ascendente/descendente.
- RF-05 agregar al carrito desde catálogo o detalle.
- RF-06 productos, cantidades, parciales y total.
- RF-07 modificar cantidades.
- RF-08 conservar y recuperar carrito del cliente.
- RF-09 resumen antes del pago.
- RF-10 número único de pedido.
- RF-11 pago simulado con datos de cuenta/dirección y aviso de resultado.
- RF-12 confirmación después de pago exitoso.
- RF-13 registro con nombre, correo y contraseña.
- RF-14 validación de correo.
- RF-15 login con correo y contraseña.
- RF-16 recuperación de contraseña.
- RF-17 registrar productos como administrador.
- RF-18 actualizar precios y existencias.
- RF-19 inactivar productos.
- RF-20 consultar, buscar y filtrar productos.
- RF-21 dashboard con métricas y alertas.
- RF-22 ventas totales.
- RF-23 productos más vendidos.
- RF-24 cantidad de pedidos.
- RF-25 filtros por fechas y categorías.
- RF-26 exportar informes Excel o PDF.
- RF-27 listado de usuarios.
- RF-28 asignar roles.
- RF-29 activar/desactivar cuentas.
- RF-30 controlar acceso por rol.
- RF-31 buscar usuarios en administración.

## Requisitos no funcionales obligatorios
Verifica evidencia de:

- RNF-01 usabilidad y consistencia.
- RNF-02 responsive.
- RNF-03 rendimiento adecuado del catálogo.
- RNF-04 protección de funciones administrativas.
- RNF-05 contraseñas con hash, nunca texto plano.
- RNF-06 integridad de productos, usuarios, pedidos y detalles.
- RNF-07 disponibilidad durante pruebas.
- RNF-08 código modular y mantenible.
- RNF-09 compatibilidad de navegadores.
- RNF-10 mensajes comprensibles.
- RNF-11 arquitectura ampliable.
- RNF-12 ejecución en servidor local.

## Modelo mínimo de datos
Implementa o adapta estas tablas con PK, FK, restricciones, índices y datos semilla:

`rol`, `usuario`, `token_usuario` opcional para recuperación/verificación, `categoria`, `marca`, `producto`, `carrito`, `detalle_carrito`, `estado_pedido`, `pedido`, `detalle_pedido`, `pago_simulado` o `pago`, `mensaje_contacto` opcional. Si se implementa taller, agregar `servicio_taller` y `cita_taller`.

Reglas:
- `detalle_carrito` PK compuesta `(id_carrito,id_producto)`.
- `detalle_pedido` conserva `precio_unitario` histórico y `subtotal`.
- `producto` debe tener existencias y estado; disponibilidad puede ser derivada.
- `pago` no guarda tarjetas, cuentas reales ni credenciales; solo método simulado, estado y código de transacción.
- `numero_pedido` UNIQUE.
- correo de usuario UNIQUE.
- claves foráneas con integridad referencial.
- pedidos y pagos deben ejecutarse en transacción para no descontar inventario si falla el pago.

## Seguridad de cuentas
Implementa como mínimo:

1. Validación estricta de nombre, correo y contraseña en frontend y backend.
2. Contraseña mínima de 8 caracteres, con mayúscula, minúscula, número y símbolo.
3. Normalizar correo a minúsculas y recortar espacios.
4. `bcrypt` con factor seguro; nunca registrar contraseñas.
5. JWT con expiración corta y payload mínimo: id, rol y datos no sensibles.
6. Preferir cookie `HttpOnly`, `Secure` en producción y `SameSite`; si la plantilla usa almacenamiento web, documentar el riesgo y no guardar secretos innecesarios.
7. Rate limiting para login, registro y recuperación de contraseña.
8. Respuestas de login y recuperación que no permitan enumerar usuarios.
9. Tokens de recuperación aleatorios, con hash en BD, expiración, un solo uso y revocación.
10. Autorización backend por rol para cada ruta administrativa.
11. Validación de ownership: un cliente solo consulta su carrito y pedidos.
12. CORS restringido a los orígenes configurados.
13. Helmet o controles equivalentes, límites de payload y mensajes de error sin stack trace en producción.
14. Consultas parametrizadas contra SQL injection.
15. Sanitización/escape de salida contra XSS.
16. Validación de cargas de imágenes: MIME real, extensión permitida, tamaño y nombre seguro.
17. No colocar secretos en Git, frontend, README ni mensajes.
18. Logs sin contraseñas, JWT, tokens ni datos de pago.
19. Política de sesión: expiración, logout, revocación si se implementa refresh token.
20. Cabeceras de seguridad y HTTPS documentado para producción.

## Pruebas de seguridad obligatorias
Crea pruebas automatizadas o scripts controlados para:

- Contraseña nunca almacenada en texto plano.
- Registro con correo inválido, repetido y contraseña débil.
- Login correcto, contraseña incorrecta y usuario inexistente sin revelar cuál falla.
- Rate limit de login y recuperación.
- Token de recuperación expirado, usado dos veces o manipulado.
- JWT ausente, vencido, alterado y con rol insuficiente.
- Cliente intentando ver/modificar carrito o pedido de otro cliente.
- Cliente intentando acceder a endpoints admin.
- Admin autorizado para productos, usuarios e informes.
- SQL injection en login, búsqueda, filtros y formularios.
- XSS en nombre, descripción, contacto y datos de producto.
- Carga de archivo malicioso, MIME falso, extensión peligrosa y exceso de tamaño.
- CORS no autorizado.
- Payload JSON excesivo o campos inesperados.
- Inventario concurrente y pago rechazado: no alterar existencias.
- Pedido duplicado por doble envío.

No hagas pruebas destructivas contra servicios externos. Usa entorno local y datos de prueba.

## Fases de implementación

### Fase 0 — diagnóstico
No programes aún. Lee el repositorio, identifica qué se reutiliza, crea un plan, riesgos, dependencias y matriz RF/RNF.

### Fase 1 — base de datos
Actualiza migraciones SQL, índices, constraints y seed. Prueba conexión y datos iniciales.

### Fase 2 — backend y seguridad
Implementa auth, roles, catálogo, carrito, pedidos, pago simulado, administración e informes. Agrega validadores, rate limit, errores y autorización.

### Fase 3 — frontend
Implementa Home, catálogo, detalle, login, registro, recuperación, carrito, checkout, confirmación, cuenta y panel admin. Conecta todo a API real y replica el diseño de referencia.

### Fase 4 — pruebas
Configura pruebas unitarias, integración, E2E y seguridad. Ejecuta build, test y verificación manual.

### Fase 5 — documentación y cierre
Actualiza README, API, arquitectura, variables de entorno, matriz de trazabilidad, guía de seguridad y lista de pendientes.

## Rutas mínimas sugeridas

`/api/auth/register`, `/api/auth/login`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/me`, `/api/products`, `/api/products/:id`, `/api/cart`, `/api/cart/items`, `/api/orders/preview`, `/api/orders`, `/api/orders/:id`, `/api/payments/simulate`, `/api/admin/products`, `/api/admin/users`, `/api/admin/dashboard`, `/api/admin/reports`, `/api/health`.

## Criterio de terminado
No declares terminado si falta cualquiera de RF-01 a RF-31, RNF-01 a RNF-12, autenticación segura, persistencia MySQL, pruebas de seguridad, documentación o ejecución local.

Al cerrar cada fase entrega: resumen, archivos modificados, comandos ejecutados, pruebas pasadas/fallidas, riesgos y siguiente fase. No avances a otra fase si la actual no compila o deja errores conocidos sin documentar.
