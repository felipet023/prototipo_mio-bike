import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducto } from '../services/productos.service';
import { addItem } from '../services/carrito.service';
import { useAuth } from '../hooks/useAuth';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getProducto(id).then((r) => setProducto(r.producto)).catch((e) => setMsg(e.message));
  }, [id]);

  async function handleAdd() {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await addItem({ id_producto: Number(id), cantidad });
      setMsg('Agregado al carrito');
    } catch (e) { setMsg(e.message); }
  }

  if (!producto) return <main className="page">{msg || 'Cargando...'}</main>;
  return (
    <main className="page detail">
      <img src={producto.imagen} alt={producto.nombre} />
      <div>
        <h1>{producto.nombre}</h1>
        <p className="brand">{producto.marca} · {producto.categoria}</p>
        <p>{producto.descripcion}</p>
        <p className="price">${Number(producto.precio).toLocaleString('es-CO')}</p>
        {producto.precio_anterior && <p className="old-price">${Number(producto.precio_anterior).toLocaleString('es-CO')}</p>}
        <p className={producto.stock > 0 ? 'stock ok' : 'stock no'}>{producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}</p>
        <div className="qty">
          <input type="number" min="1" max={producto.stock} value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
          <button className="btn-primary" onClick={handleAdd} disabled={producto.stock === 0}>Agregar al carrito</button>
        </div>
        {msg && <p className="info">{msg}</p>}
      </div>
    </main>
  );
}