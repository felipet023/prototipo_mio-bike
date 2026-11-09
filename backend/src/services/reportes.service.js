const ExcelJS = require('exceljs');
const pool = require('../config/db');
const AppError = require('../utils/AppError');
const { CATEGORIAS_VALIDAS } = require('../utils/validate');

function buildPedidoWhere({ desde, hasta }) {
  const where = [];
  const params = [];
  if (desde) {
    where.push('p.fecha >= ?');
    params.push(desde);
  }
  if (hasta) {
    where.push('p.fecha <= ?');
    params.push(`${hasta} 23:59:59`);
  }
  return { whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

async function getReporte({ desde, hasta, categoria } = {}) {
  if (categoria && !CATEGORIAS_VALIDAS.includes(categoria)) {
    throw new AppError(`Categoría inválida. Debe ser una de: ${CATEGORIAS_VALIDAS.join(', ')}`, 400);
  }

  const { whereSql, params } = buildPedidoWhere({ desde, hasta });

  const [[resumen]] = await pool.execute(
    `SELECT COUNT(*) AS total_pedidos,
            COALESCE(SUM(total), 0) AS ventas_totales,
            COALESCE(AVG(total), 0) AS ticket_promedio
     FROM pedidos p ${whereSql}`,
    params
  );

  const [porEstado] = await pool.execute(
    `SELECT p.estado, COUNT(*) AS cantidad, COALESCE(SUM(p.total), 0) AS total
     FROM pedidos p ${whereSql}
     GROUP BY p.estado`,
    params
  );

  const topParams = [...params];
  const topWhere = [whereSql ? whereSql.replace('WHERE ', '') : '1=1'];
  // rebuild with p alias already; detalle join
  const joinWhere = [];
  const joinParams = [];
  if (desde) { joinWhere.push('p.fecha >= ?'); joinParams.push(desde); }
  if (hasta) { joinWhere.push('p.fecha <= ?'); joinParams.push(`${hasta} 23:59:59`); }
  if (categoria) { joinWhere.push('prod.categoria = ?'); joinParams.push(categoria); }
  const joinWhereSql = joinWhere.length ? `WHERE ${joinWhere.join(' AND ')}` : '';

  const [topProductos] = await pool.execute(
    `SELECT dp.nombre_producto,
            prod.categoria,
            SUM(dp.cantidad) AS unidades_vendidas,
            SUM(dp.subtotal_linea) AS ingresos
     FROM detalle_pedido dp
     JOIN pedidos p ON p.id_pedido = dp.id_pedido
     JOIN productos prod ON prod.id_producto = dp.id_producto
     ${joinWhereSql}
     GROUP BY dp.nombre_producto, prod.categoria
     ORDER BY unidades_vendidas DESC
     LIMIT 10`,
    joinParams
  );

  const [porCategoria] = await pool.execute(
    `SELECT prod.categoria,
            SUM(dp.cantidad) AS unidades_vendidas,
            SUM(dp.subtotal_linea) AS ingresos
     FROM detalle_pedido dp
     JOIN pedidos p ON p.id_pedido = dp.id_pedido
     JOIN productos prod ON prod.id_producto = dp.id_producto
     ${joinWhereSql}
     GROUP BY prod.categoria
     ORDER BY ingresos DESC`,
    joinParams
  );

  const [stockBajo] = await pool.execute(
    `SELECT id_producto, slug, nombre, categoria, stock
     FROM productos
     WHERE activo = 1 AND stock <= 5
     ORDER BY stock ASC
     LIMIT 10`
  );

  return {
    filtros: { desde: desde || null, hasta: hasta || null, categoria: categoria || null },
    resumen,
    por_estado: porEstado,
    top_productos: topProductos,
    por_categoria: porCategoria,
    stock_bajo: stockBajo,
  };
}

async function exportarExcel({ desde, hasta, categoria }) {
  const reporte = await getReporte({ desde, hasta, categoria });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Bike Store';
  workbook.created = new Date();

  const sheetResumen = workbook.addWorksheet('Resumen');
  sheetResumen.addRow(['Métrica', 'Valor']);
  sheetResumen.addRow(['Total pedidos', reporte.resumen.total_pedidos]);
  sheetResumen.addRow(['Ventas totales', reporte.resumen.ventas_totales]);
  sheetResumen.addRow(['Ticket promedio', reporte.resumen.ticket_promedio]);
  sheetResumen.addRow(['Desde', reporte.filtros.desde || 'sin filtro']);
  sheetResumen.addRow(['Hasta', reporte.filtros.hasta || 'sin filtro']);
  sheetResumen.addRow(['Categoría', reporte.filtros.categoria || 'todas']);

  const sheetTop = workbook.addWorksheet('Top productos');
  sheetTop.addRow(['Producto', 'Categoría', 'Unidades vendidas', 'Ingresos']);
  reporte.top_productos.forEach((p) => {
    sheetTop.addRow([p.nombre_producto, p.categoria, p.unidades_vendidas, p.ingresos]);
  });

  const sheetCat = workbook.addWorksheet('Por categoría');
  sheetCat.addRow(['Categoría', 'Unidades vendidas', 'Ingresos']);
  reporte.por_categoria.forEach((c) => {
    sheetCat.addRow([c.categoria, c.unidades_vendidas, c.ingresos]);
  });

  const sheetEst = workbook.addWorksheet('Por estado');
  sheetEst.addRow(['Estado', 'Cantidad', 'Total']);
  reporte.por_estado.forEach((e) => {
    sheetEst.addRow([e.estado, e.cantidad, e.total]);
  });

  const sheetStock = workbook.addWorksheet('Stock bajo');
  sheetStock.addRow(['ID', 'Slug', 'Nombre', 'Categoría', 'Stock']);
  reporte.stock_bajo.forEach((p) => {
    sheetStock.addRow([p.id_producto, p.slug, p.nombre, p.categoria, p.stock]);
  });

  return workbook;
}

module.exports = { getReporte, exportarExcel };