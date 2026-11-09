const crypto = require('crypto');
const AppError = require('../utils/AppError');

const METODOS_VALIDOS = ['tarjeta', 'pse', 'efectivo'];

function simularPago({ metodo_pago, monto, pago }) {
  if (!METODOS_VALIDOS.includes(metodo_pago)) {
    throw new AppError(`metodo_pago inválido. Debe ser uno de: ${METODOS_VALIDOS.join(', ')}`, 400);
  }
  const montoNum = Number(monto);
  if (!Number.isFinite(montoNum) || montoNum <= 0) {
    throw new AppError('monto debe ser mayor a 0', 400);
  }

  // Pago simulado: no se procesan datos reales. Se acepta la transacción
  // salvo que el método sea tarjeta y el número termine en 0000 (caso de
  // rechazo controlado para pruebas), o que falten datos mínimos.
  let aprobado = true;
  let motivo = 'Pago aprobado (simulado)';

  if (metodo_pago === 'tarjeta') {
    const numero = String(pago?.numero || '').replace(/\s+/g, '');
    if (numero && numero.endsWith('0000')) {
      aprobado = false;
      motivo = 'Pago rechazado por el emisor (simulado)';
    }
    if (!numero || numero.length < 12) {
      aprobado = false;
      motivo = 'Número de tarjeta inválido (simulado)';
    }
  }

  const codigo_transaccion = `SIM-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

  return {
    aprobado,
    codigo_transaccion: aprobado ? codigo_transaccion : null,
    mensaje: motivo,
  };
}

module.exports = { simularPago, METODOS_VALIDOS };