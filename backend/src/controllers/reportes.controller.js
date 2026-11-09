const service = require('../services/reportes.service');
const asyncHandler = require('../utils/asyncHandler');

const getReporte = asyncHandler(async (req, res) => {
  const reporte = await service.getReporte({
    desde: req.query.desde,
    hasta: req.query.hasta,
    categoria: req.query.categoria,
  });
  res.json({ ok: true, reporte });
});

const exportar = asyncHandler(async (req, res) => {
  const workbook = await service.exportarExcel({
    desde: req.query.desde,
    hasta: req.query.hasta,
    categoria: req.query.categoria,
  });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="reporte_bike_store.xlsx"');
  await workbook.xlsx.write(res);
  res.end();
});

module.exports = { getReporte, exportar };