import { useEffect, useState } from 'react';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../../services/productos.service';

export default function AdminProductsPage() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: '', marca: '', categoria: 'mtb', precio: '', descripcion: '', stock: 0 });
  const [msg, setMsg] = useState('');

  async function load() {
    try { const r = await getProductos({ incluirInactivos: 'true' }); setProductos(r.productos || []); } catch (e) { setMsg(e.message); }
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await createProducto({ ...form, precio: Number(form.precio), stock: Number(form.stock) });
      setForm({ nombre: '', marca: '', categoria: 'mtb', precio: '', descripcion: '', stock: 0 });
      load();
    } catch (e) { setMsg(e.message); }
  }

  async function toggleActivo(p) {
    try { await updateProducto(p.id_producto, { activo: !p.activo }); load(); } catch (e) { setMsg(e.message); }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar producto?')) return;
    try { await deleteProducto(id); load(); } catch (e) { setMsg(e.message); }
  }

  return (
    <main className="page">
      <h1>Productos (Admin)</h1>
      {msg && <p className="error">{msg}</p>}
      <form onSubmit={handleCreate} className="form-grid">
        <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        <input placeholder="Marca" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} required />
        <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
          {['mtb','ruta','urbana','electrica','accesorios'].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input type="number" placeholder="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
        <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <input placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required />
        <button className="btn-primary">Crear</button>
      </form>
      <table className="table">
        <thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Activo</th><th>Acciones</th></tr></thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.nombre}</td><td>{p.categoria}</td><td>${Number(p.precio).toLocaleString('es-CO')}</td><td>{p.stock}</td>
              <td>{p.activo ? 'Sí' : 'No'}</td>
              <td>
                <button onClick={() => toggleActivo(p)}>{p.activo ? 'Inactivar' : 'Activar'}</button>
                <button onClick={() => handleDelete(p.id_producto)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}