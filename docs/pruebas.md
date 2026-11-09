# Pruebas — Bike Store

## Backend
```bash
cd backend
npm test          # unitarias + integración
npm run test:unit
npm run test:integration
```

## Frontend
```bash
cd frontend
npm test          # Vitest
npm run build     # build de producción
```

## Casos cubiertos
- Validación de correo y contraseña.
- Registro, login, JWT.
- SQL injection en login.
- Acceso admin bloqueado a clientes.
- IDOR en pedidos.
- Catálogo y productos.
- Pago simulado y rollback de inventario.

## Evidencias
- `backend/TESTING.md` contiene 75 casos manuales probados con curl.
- Resultado de `npm test`: 12 pruebas pasadas (backend).
- Resultado de frontend: 1 prueba pasada; build exitoso.