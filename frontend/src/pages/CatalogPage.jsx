import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProductos } from '../services/productos.service';

const CATEGORIAS = ['mtb', 'ruta', 'urbana', 'electrica', 'accesorios'];

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categoria = params.get('categoria') || '';
  const orden = params.get('orden') || 'recientes';
  const search = params.get('search') || '';

  useEffect(() => {
    setLoading(true);
    const q = {};
    if (categoria) q.categoria = categoria;
    if (search) q.search = search;
    if (orden) q.orden = orden;
    getProductos(q).then((r) => setProductos(r.productos || [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [categoria, search, orden]);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  }

  return (
    <main className="page">
      <h1>Catálogo</h1>
      <div className="filters">
        <input placeholder="Buscar..." value={search} onChange={(e) => update('search', e.target.value)} />
        <select value={categoria} onChange={(e) => update('categoria', e.target.value)}>
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={orden} onChange={(e) => update('orden', e.target.value)}>
          <option value="recientes">Más recientes</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
          <option value="nombre_asc">Nombre A-Z</option>
        </select>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {productos.map((p) => (
          <Link key={p.id_producto} to={`/producto/${p.id_producto}`} className="card">
            <img src={p.imagen} alt={p.nombre} />
            <h3>{p.nombre}</h3>
            <p>{p.marca}</p>
            <p className="price">${Number(p.precio).toLocaleString('es-CO')}</p>
            <p className={p.stock > 0 ? 'stock ok' : 'stock no'}>{p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}