import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="navbar">
      <Link to="/" className="brand">TUKI BIKES</Link>
      <nav>
        <Link to="/catalogo">Catálogo</Link>
        {isAuthenticated && <Link to="/carrito"><ShoppingCart size={18} /> Carrito</Link>}
        {isAuthenticated && <Link to="/cuenta"><User size={18} /> Cuenta</Link>}
        {isAdmin && <Link to="/admin"><LayoutDashboard size={18} /> Admin</Link>}
        {!isAuthenticated ? (
          <>
            <Link to="/login">Ingresar</Link>
            <Link to="/registro" className="btn-primary">Registrarse</Link>
          </>
        ) : (
          <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost"><LogOut size={18} /> Salir</button>
        )}
      </nav>
    </header>
  );
}