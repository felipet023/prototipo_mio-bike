const express = require('express');
const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const controller = require('../controllers/auth.controller.js');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: env.rateLimit.windowMinutes * 60 * 1000,
  max: env.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Demasiados intentos de autenticación, intenta más tarde' }
});

router.post('/register', authLimiter, controller.register);
router.post('/login', authLimiter, controller.login);
router.get('/me', authenticate, controller.me);
router.post('/forgot-password', authLimiter, controller.forgotPassword);
router.post('/reset-password', authLimiter, controller.resetPassword);

module.exports = router;
