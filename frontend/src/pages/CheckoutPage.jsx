import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../services/pedidos.service';
import { crearPedido } from '../services/pedidos.service';
import { simulate } from '../services/payments.service';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState(null);
  const [form, setForm] = useState({ direccion: '', ciudad: '', telefono: '', metodo_pago: 'tarjeta', numero: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { preview().then((r) => setResumen(r.resumen)).catch((e) => setMsg(e.message)); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      const pago = form.metodo_pago === 'tarjeta' ? { numero: form.numero } : undefined;
      const r = await crearPedido({
        direccion: form.direccion, ciudad: form.ciudad, telefono: form.telefono,
        metodo_pago: form.metodo_pago, pago,
      });
      navigate(`/confirmacion/${r.pedido.id_pedido}`, { state: r.pedido });
    } catch (err) { setMsg(err.message); }
    finally { setLoading(false); }
  }

  if (!resumen) return <main className="page">{msg || 'Cargando...'}</main>;
  return (
    <main className="page">
      <h1>Checkout</h1>
      <div className="checkout">
        <div>
          <h2>Resumen</h2>
          <p>Subtotal: ${Number(resumen.subtotal).toLocaleString('es-CO')}</p>
          <p>Envío: ${Number(resumen.envio).toLocaleString('es-CO')}</p>
          <p>Total: <strong>${Number(resumen.total).toLocaleString('es-CO')}</strong></p>
        </div>
        <form onSubmit={handleSubmit}>
          <input placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} required />
          <input placeholder="Ciudad" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} required />
          <input placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} required />
          <select value={form.metodo_pago} onChange={(e) => setForm({ ...form, metodo_pago: e.target.value })}>
            <option value="tarjeta">Tarjeta</option>
            <option value="pse">PSE</option>
            <option value="efectivo">Efectivo</option>
          </select>
          {form.metodo_pago === 'tarjeta' && (
            <input placeholder="Número de tarjeta" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} />
          )}
          {msg && <p className="error">{msg}</p>}
          <button className="btn-primary" disabled={loading}>{loading ? 'Procesando...' : 'Pagar (simulado)'}</button>
        </form>
      </div>
    </main>
  );
}