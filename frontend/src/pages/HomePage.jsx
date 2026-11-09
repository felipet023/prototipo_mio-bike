import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductos } from '../services/productos.service';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  useEffect(() => {
    getProductos({ orden: 'recientes' }).then((r) => setFeatured((r.productos || []).slice(0, 6))).catch(() => {});
  }, []);
  return (
    <main className="page">
      <section className="hero">
        <h1>TUKI BIKES</h1>
        <p>Bicicletas deportivas y accesorios para cada aventura.</p>
        <Link to="/catalogo" className="btn-primary">Ver catálogo</Link>
      </section>
      <section>
        <h2>Destacados</h2>
        <div className="grid">
          {featured.map((p) => (
            <Link key={p.id_producto} to={`/producto/${p.id_producto}`} className="card">
              <img src={p.imagen} alt={p.nombre} />
              <h3>{p.nombre}</h3>
              <p className="price">${Number(p.precio).toLocaleString('es-CO')}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}