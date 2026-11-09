import { useEffect, useState } from 'react';
import { getDashboard } from '../../services/admin.service';

export default function AdminDashboardPage() {
  const [d, setD] = useState(null);
  useEffect(() => { getDashboard().then(setD).catch(() => {}); }, []);
  if (!d) return <main className="page">Cargando...</main>;
  return (
    <main className="page">
      <h1>Dashboard</h1>
      <div className="grid metrics">
        <div className="card"><h3>Productos</h3><p>{d.productos.total_productos}</p></div>
        <div className="card"><h3>Usuarios</h3><p>{d.usuarios.total_usuarios}</p></div>
        <div className="card"><h3>Pedidos</h3><p>{d.pedidos.total_pedidos}</p></div>
        <div className="card"><h3>Ventas totales</h3><p>${Number(d.pedidos.ventas_totales).toLocaleString('es-CO')}</p></div>
      </div>
      <h2>Top productos</h2>
      <ul className="list">{d.top_productos.map((p, i) => <li key={i}>{p.nombre_producto} — {p.unidades_vendidas} uds</li>)}</ul>
      <h2>Stock bajo</h2>
      <ul className="list">{d.productos_stock_bajo.map((p) => <li key={p.id_producto}>{p.nombre} (stock: {p.stock})</li>)}</ul>
    </main>
  );
}