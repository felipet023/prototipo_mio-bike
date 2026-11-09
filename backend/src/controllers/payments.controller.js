const service = require('../services/payments.service');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const simulate = asyncHandler(async (req, res) => {
  const { metodo_pago, monto, pago } = req.body;
  const resultado = service.simularPago({ metodo_pago, monto, pago });
  res.json({ ok: true, ...resultado });
});

module.exports = { simulate };