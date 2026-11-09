import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth.service';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form);
      navigate('/login');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <main className="page auth">
      <h1>Crear cuenta</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        <input type="email" placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Contraseña (8+ chars, mayúscula, número, símbolo)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {error && <p className="error">{error}</p>}
        <button className="btn-primary" disabled={loading}>{loading ? 'Registrando...' : 'Registrarse'}</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Ingresar</Link></p>
    </main>
  );
}