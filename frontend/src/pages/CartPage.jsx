import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCarrito, updateItem, removeItem } from '../services/carrito.service';

export default function CartPage() {
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setCarrito(await getCarrito()); } catch {}
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleQty(item, cantidad) {
    if (cantidad < 1) return;
    await updateItem(item.id_carrito_item, cantidad);
    load();
  }
  async function handleRemove(id) {
    await removeItem(id);
    load();
  }

  if (loading) return <main className="page">Cargando...</main>;
  const items = carrito?.carrito?.items || [];
  return (
    <main className="page">
      <h1>Carrito</h1>
      {items.length === 0 ? <p>Tu carrito está vacío.</p> : (
        <>
          <div className="cart-list">
            {items.map((it) => (
              <div key={it.id_carrito_item} className="cart-item">
                <img src={it.imagen} alt={it.nombre} />
                <div>
                  <h3>{it.nombre}</h3>
                  <p>${Number(it.precio).toLocaleString('es-CO')}</p>
                </div>
                <input type="number" min="1" value={it.cantidad} onChange={(e) => handleQty(it, Number(e.target.value))} />
                <p>${Number(it.subtotal).toLocaleString('es-CO')}</p>
                <button onClick={() => handleRemove(it.id_carrito_item)}>Eliminar</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <p>Total: <strong>${Number(carrito.carrito.total).toLocaleString('es-CO')}</strong></p>
            <Link to="/checkout" className="btn-primary">Ir al checkout</Link>
          </div>
        </>
      )}
    </main>
  );
}