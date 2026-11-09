import { useEffect, useState } from 'react';
import { misPedidos } from '../services/pedidos.service';

export default function AccountPage() {
  const [pedidos, setPedidos] = useState([]);
  useEffect(() => { misPedidos().then((r) => setPedidos(r.pedidos || [])).catch(() => {}); }, []);
  return (
    <main className="page">
      <h1>Mi cuenta</h1>
      <h2>Mis pedidos</h2>
      {pedidos.length === 0 ? <p>No tienes pedidos aún.</p> : (
        <ul className="list">
          {pedidos.map((p) => (
            <li key={p.id_pedido} className="card">
              <p><strong>{p.numero_pedido}</strong></p>
              <p>Total: ${Number(p.total).toLocaleString('es-CO')}</p>
              <p>Estado: {p.estado}</p>
              <p>Fecha: {new Date(p.fecha).toLocaleString('es-CO')}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}