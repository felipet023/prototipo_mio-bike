# AGENTS.md

## What this repo is

Two independent npm projects (no workspaces): `backend/` (Express 5, CommonJS, `require`) and `frontend/` (React 19 + Vite 7, ESM). Despite the folder name `prototipo_mio-bike` and `docs/Casos_Uso_BikeStore.drawio`, the app is a **generic equipment CRUD** ("equipos": laptops, monitors, keyboards) with JWT auth and `admin`/`cliente` roles — not a bike app. UI and API messages are in Spanish.

## Commands

Backend (`cd backend`): `npm install` → `npm run dev` (nodemon) or `npm start`. API on `http://localhost:3000`; health check `GET /api/health`.
Frontend (`cd frontend`): `npm install` → `npm run dev` (Vite, port 5173). Needs the backend running.

There is **no test suite, no lint, no typecheck, no CI**. Verification is manual: apply the SQL schema, start both servers, exercise the UI/endpoints.

## Setup gotchas (verified against source)

- MySQL must be running and the schema applied **before** starting the backend: `sql/lab-crud.sql` is the source of truth — it creates database **`laboratorio_crud`**. `.env.example` and READMEs wrongly say `lab_crud`; set `DB_NAME=laboratorio_crud` or the pool fails.
- `backend/src/config/env.js` throws at require-time if `DB_HOST`, `DB_USER`, `DB_NAME`, or `JWT_SECRET` is missing — the process exits immediately. `ADMIN_*` vars are optional; when set, `src/startup/seedAdmin.js` creates the admin user on every startup (skips if email exists).
- Copy `.env.example` → `.env` in both projects. Frontend only needs `VITE_API_URL` (defaults to `http://localhost:3000/api`).
- `**/package-lock.json` is gitignored in both projects and deps are ranges — `npm install` may resolve newer versions than a previous session.

## Architecture facts that aren't obvious

- Backend layering is strict: `routes → controllers (thin try/catch → next(error)) → services (raw parameterized SQL via mysql2 pool; no ORM)`. Expected errors are `AppError(message, status)`; anything else → 500 via `error.middleware.js`.
- Roles: register always creates `cliente`; admin exists only via the ADMIN_* seed. All `/api/equipos` routes need a Bearer JWT (payload: `{id_usuario, nombre, email, rol}`, default 2h). POST/PUT allow any authed user; **DELETE is admin-only** — enforced server-side, not just by hiding the button.
- Images: multer accepts only jpeg/png/webp ≤ 2 MB, stored in `backend/uploads/equipos/` (gitignored except `.gitkeep`), served statically at `/uploads/equipos/<file>`. Filename is `{Date.now()}-{random}{ext}` — the extension comes from the original filename, only the MIME type is validated. Services delete the old file on update/delete.
- Frontend session lives in `localStorage` keys `labcrud_token` and `labcrud_user`. `api.js` attaches the Bearer token and omits `Content-Type` for `FormData`. Image URLs are built from `SERVER_URL` = `VITE_API_URL` with `/api` stripped (`src/utils/format.js`).
- Known rough edges (verify before relying on them): `getUser()` in `storage.js` does a raw `JSON.parse` (throws on corrupt storage); `updateEquipo` doesn't validate `nombre`; README test-user passwords don't match `.env.example`.

## Git state

Only one commit ("patos"); `backend/`, `frontend/`, `docs/`, `sql/` are currently **untracked**, and old `mafia-patos*` files are staged as deleted. Commit work deliberately — don't assume the tree matches HEAD.
