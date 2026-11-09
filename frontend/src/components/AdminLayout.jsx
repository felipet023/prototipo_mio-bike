import { NavLink, Outlet } from 'react-router-dom';
export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <NavLink to="/admin">Dashboard</NavLink>
        <NavLink to="/admin/productos">Productos</NavLink>
        <NavLink to="/admin/usuarios">Usuarios</NavLink>
        <NavLink to="/admin/reportes">Reportes</NavLink>
      </aside>
      <section className="admin-content"><Outlet /></section>
    </div>
  );
}