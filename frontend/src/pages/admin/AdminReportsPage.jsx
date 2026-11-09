import { useEffect, useState } from 'react';
import { getReporte, exportReporteUrl } from '../../services/admin.service';

export default function AdminReportsPage() {
  const [reporte, setReporte] = useState(null);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [categoria, setCategoria] = useState('');

  async function load() {
    const r = await getReporte({ desde, hasta, categoria });
    setReporte(r.reporte);
  }
  useEffect(() => { load().catch(() => {}); }, []);

  return (
    <main className="page">
      <h1>Reportes</h1>
      <div className="filters">
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas</option>
          {['mtb','ruta','urbana','electrica','accesorios'].map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="btn-primary" onClick={load}>Filtrar</button>
        <a className="btn-ghost" href={exportReporteUrl({ desde, hasta, categoria })} target="_blank" rel="noreferrer">Exportar Excel</a>
      </div>
      {reporte && (
        <>
          <div className="grid metrics">
            <div className="card"><h3>Pedidos</h3><p>{reporte.resumen.total_pedidos}</p></div>
            <div className="card"><h3>Ventas</h3><p>${Number(reporte.resumen.ventas_totales).toLocaleString('es-CO')}</p></div>
            <div className="card"><h3>Ticket promedio</h3><p>${Number(reporte.resumen.ticket_promedio).toLocaleString('es-CO')}</p></div>
          </div>
          <h2>Top productos</h2>
          <ul className="list">{reporte.top_productos.map((p, i) => <li key={i}>{p.nombre_producto} — {p.unidades_vendidas} uds</li>)}</ul>
        </>
      )}
    </main>
  );
}