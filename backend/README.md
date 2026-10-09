# LAB CRUD — Backend

Backend pedagógico con Express, MySQL, bcrypt, JWT y roles admin / cliente.

## 1. Base de datos

En MySQL ejecuta `docs/lab_crud.sql`.

## 2. Variables de entorno

El proyecto incluye `.env` para desarrollo. Para otro equipo, copia `.env.example` como `.env` y completa las credenciales de MySQL.

## 3. Instalar en Visual Studio Code

Abre la carpeta `backend` completa en VS Code. En **Terminal → Nueva terminal**, ejecuta:

```bash
npm install
npm run dev
```

API: `http://localhost:3000`

Prueba de salud: `GET http://localhost:3000/api/health`

## Rutas

Públicas:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`

Protegidas con JWT:
- `GET /api/equipos`
- `GET /api/equipos/:id`
- `POST /api/equipos`
- `PUT /api/equipos/:id`
- `DELETE /api/equipos/:id` — solo admin

Las rutas de creación y edición reciben `multipart/form-data`; el campo de imagen es opcional y acepta JPG, PNG o WEBP hasta 2 MB.
