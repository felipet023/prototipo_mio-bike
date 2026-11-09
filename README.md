# Bike Store / TUKI BIKES

Tienda web de bicicletas deportivas y accesorios con catálogo público, carrito, checkout con pago simulado, cuentas de cliente y panel de administración.

## Stack
- Frontend: React + Vite + React Router.
- Backend: Node.js + Express.
- Base de datos: MySQL.
- Autenticación: bcrypt + JWT.

## Ejecución local
### Backend
```bash
cd backend
cp .env.example .env   # ajustar credenciales
npm install
npm run dev
```
API: http://localhost:3000/api/health

### Base de datos
```bash
mysql -u root -p < sql/bike_store_schema.sql
mysql -u root -p bike_store < sql/bike_store_seed_productos.sql
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
App: http://localhost:5173

## Pruebas
Backend:
```bash
cd backend && npm test
```
Frontend:
```bash
cd frontend && npm test
```
Build frontend:
```bash
cd frontend && npm run build
```

## Documentación
- `docs/arquitectura.md`
- `docs/api.md`
- `docs/base-datos.md`
- `docs/matriz-requisitos.md`
- `docs/matriz-no-funcionales.md`
- `docs/modelo-amenazas.md`
- `docs/guia-seguridad.md`
- `docs/pruebas.md`