# 🦆 MAFIA DE PATOS — Versión Firebase
### Multijugador en tiempo real · Sin polling · Sincronización instantánea

---

## 🔥 PASO 1 — Crear proyecto Firebase (5 minutos, gratis)

1. Ve a **https://console.firebase.google.com**
2. Clic en **"Agregar proyecto"** → ponle nombre → Continuar
3. (Desactiva Google Analytics si quieres) → Crear proyecto
4. En el menú izquierdo: **Compilación → Realtime Database**
5. Clic **"Crear base de datos"** → elige región (us-central1) → **Modo de prueba** → Habilitar

### Configurar reglas (para el salón de clase):
En la pestaña **Reglas** de Realtime Database, pega esto y publica:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Obtener credenciales:
1. Engranaje ⚙️ → **Configuración del proyecto**
2. Baja hasta **"Tus apps"** → Clic **</>** (agregar app web)
3. Ponle un nombre → **Registrar app**
4. Copia el objeto `firebaseConfig` que aparece:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
  projectId: "tu-proyecto-12345",
  ...
};
```

---

## 🚀 PASO 2 — Ejecutar el juego

### Opción A — Subir a Firebase Hosting (RECOMENDADO para clase)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # elige tu proyecto, directorio: . (punto)
firebase deploy
```
Te dará una URL pública tipo `https://tu-proyecto.web.app` — compártela con los estudiantes.

### Opción B — Servidor local (misma red WiFi)
```bash
# En la carpeta mafia-patos:
python -m http.server 8080
# o
npx serve .
```
Los estudiantes abren: `http://[TU-IP-LOCAL]:8080`

### Opción C — Abrir directo en navegador
Funciona solo para prueba rápida (un jugador).

---

## 🎮 PASO 3 — Configurar Firebase en el juego

1. Abre el juego en el navegador
2. Clic en **"🔥 Configurar Firebase"**
3. Pega tu **API Key**, **Database URL** y **Project ID**
4. Clic **"Conectar Firebase"** → aparece ✅

La config se guarda en LocalStorage del navegador, así que solo se hace una vez por dispositivo.

---

## 👑 FLUJO DEL DIRECTOR

1. Abre el juego → Configura Firebase → **Panel del Director**
2. Escribe nombre de sala (ej: `CLASE01`) → **Crear sala**
3. Aparece **QR automático** — proyéctalo o comparte la URL
4. Espera a que entren los jugadores (se ven en tiempo real)
5. **Iniciar Juego** → el sistema toma el control
6. Al terminar cada ronda: ver resumen → **Siguiente Ronda**
7. Tras 5 rondas: pantalla de ganador automática

---

## 🦆 FLUJO DE LOS JUGADORES

1. Escanean QR o abren URL → **Unirse al juego**
2. Escriben código de sala + alias → entrar
3. Ven sala de espera con quién más está conectado (tiempo real)
4. Al iniciar: ven el **evento de la ronda** y eligen su acción
5. Resultado aparece automáticamente al terminar la ronda
6. Al final: ven ganador, estadísticas y análisis estratégico

---

## ⚡ DIFERENCIAS VS VERSIÓN LOCAL STORAGE

| Característica | LocalStorage | Firebase |
|---|---|---|
| Red requerida | WiFi local obligatoria | Internet (cualquier red) |
| Sincronización | Polling cada 1s | Tiempo real instantáneo |
| Jugadores en distintas redes | ❌ No | ✅ Sí |
| Necesita servidor local | ✅ Sí | ❌ No (con Hosting) |
| Costo | Gratis | Gratis (plan Spark) |
| Confiabilidad | Media | Alta |

---

## 📁 ARCHIVOS

```
mafia-patos/
├── index.html   — Todas las pantallas + SDK Firebase
├── style.css    — Diseño cyberpunk duck mafia
├── game.js      — Lógica completa con Firebase RTDB
└── README.md    — Este archivo
```

---

## 🔧 ESTRUCTURA DE DATOS EN FIREBASE

```
salas/
  SALA01/
    estado/
      fase: "espera" | "juego" | "fin"
      ronda: 1
      eventoActual: "redada"
      mercadoDouble: false
      ultimoResumen: [...]
    mafias/
      0: { nombre, dinero, reputacion, influencia, traiciones, cooperaciones }
      1: ...
    jugadores/
      pato_negro: { nombre, mafiaIdx, joinedAt }
      ...
    votos/
      1/           ← ronda 1
        0: "cooperar"
        1: "traicionar"
        ...
    timer/
      inicio: <serverTimestamp>
      duracion: 180
```

---

## 🎓 CONCEPTOS PEDAGÓGICOS

- **Dilema del Prisionero** — Nash equilibrium vs óptimo social
- **Reciprocidad** — Tit-for-tat de Axelrod
- **Reputación** como mecanismo de cooperación
- **Información incompleta** — no sabes qué decidieron los demás
- **Horizonte temporal** — ¿Vale la pena traicionar en la última ronda?

La pantalla final **"🧠 Estrategia"** explica todo esto con los datos reales de la partida.
