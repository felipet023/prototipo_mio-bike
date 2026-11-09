import { useEffect, useState } from 'react';
import { getUsuarios, cambiarRol, cambiarEstado } from '../../services/admin.service';

export default function AdminUsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    try { const r = await getUsuarios({ search }); setUsuarios(r || []); } catch (e) { setMsg(e.message); }
  }
  useEffect(() => { load(); }, [search]);

  async function handleRol(u, rol) {
    try { await cambiarRol(u.id_usuario, rol); load(); } catch (e) { setMsg(e.message); }
  }
  async function handleEstado(u, activo) {
    try { await cambiarEstado(u.id_usuario, activo); load(); } catch (e) { setMsg(e.message); }
  }

  return (
    <main className="page">
      <h1>Usuarios (Admin)</h1>
      {msg && <p className="error">{msg}</p>}
      <input placeholder="Buscar usuario..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <table className="table">
        <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Activo</th><th>Acciones</th></tr></thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id_usuario}>
              <td>{u.nombre}</td><td>{u.email}</td><td>{u.rol}</td><td>{u.activo ? 'Sí' : 'No'}</td>
              <td>
                <select value={u.rol} onChange={(e) => handleRol(u, e.target.value)}>
                  <option value="cliente">cliente</option>
                  <option value="admin">admin</option>
                </select>
                <button onClick={() => handleEstado(u, !u.activo)}>{u.activo ? 'Desactivar' : 'Activar'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}