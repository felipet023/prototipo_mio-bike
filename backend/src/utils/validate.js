const AppError = require('./AppError');

const CATEGORIAS_VALIDAS = ['mtb', 'ruta', 'urbana', 'electrica', 'accesorios'];
const METODOS_PAGO_VALIDOS = ['tarjeta', 'pse', 'efectivo'];
const ESTADOS_PEDIDO_VALIDOS = ['pendiente', 'procesando', 'completado', 'cancelado'];
const ROLES_VALIDOS = ['cliente', 'admin'];

function requireFields(obj, fields) {
  const faltantes = fields.filter((f) => obj[f] === undefined || obj[f] === null || obj[f] === '');
  if (faltantes.length) {
    throw new AppError(`Campos obligatorios faltantes: ${faltantes.join(', ')}`, 400);
  }
}

function toPositiveInt(value, fieldName) {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) {
    throw new AppError(`${fieldName} debe ser un entero positivo`, 400);
  }
  return n;
}

function toNonNegativeInt(value, fieldName) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    throw new AppError(`${fieldName} debe ser un entero mayor o igual a 0`, 400);
  }
  return n;
}

function toPositiveDecimal(value, fieldName) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) {
    throw new AppError(`${fieldName} debe ser un número mayor a 0`, 400);
  }
  return n;
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  const value = String(password || '');
  if (value.length < 8) {
    throw new AppError('La contraseña debe tener al menos 8 caracteres', 400);
  }
  if (!/[A-Z]/.test(value)) {
    throw new AppError('La contraseña debe incluir una mayúscula', 400);
  }
  if (!/[a-z]/.test(value)) {
    throw new AppError('La contraseña debe incluir una minúscula', 400);
  }
  if (!/[0-9]/.test(value)) {
    throw new AppError('La contraseña debe incluir un número', 400);
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    throw new AppError('La contraseña debe incluir un símbolo', 400);
  }
  return value;
}

module.exports = {
  CATEGORIAS_VALIDAS,
  METODOS_PAGO_VALIDOS,
  ESTADOS_PEDIDO_VALIDOS,
  ROLES_VALIDOS,
  requireFields,
  toPositiveInt,
  toNonNegativeInt,
  toPositiveDecimal,
  slugify,
  normalizeEmail,
  isValidEmail,
  validatePassword,
};
