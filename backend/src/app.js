const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const carritoRoutes = require('./routes/carrito.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const adminPedidosRoutes = require('./routes/admin.pedidos.routes');
const adminUsuariosRoutes = require('./routes/admin.usuarios.routes');
const adminDashboardRoutes = require('./routes/admin.dashboard.routes');
const adminReportesRoutes = require('./routes/admin.reportes.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Cabeceras de seguridad
app.use(helmet());

// CORS restringido a orígenes configurados
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origen no permitido por CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  })
);

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: env.rateLimit.windowMinutes * 60 * 1000,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Demasiadas solicitudes, intenta más tarde' }
});
app.use(globalLimiter);

// Límite de payload
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Bike Store API funcional' });
});

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/payments', require('./routes/payments.routes'));
app.use('/api/admin/pedidos', adminPedidosRoutes);
app.use('/api/admin/usuarios', adminUsuariosRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/reportes', adminReportesRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada'
  });
});

app.use(errorHandler);

module.exports = app;