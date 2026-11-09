import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/auth.service';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ token: params.get('token') || '', password: '' });
  const [msg, setMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const r = await resetPassword(form);
      setMsg(r.message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) { setMsg(err.message); }
  }

  return (
    <main className="page auth">
      <h1>Restablecer contraseña</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Token" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} required />
        <input type="password" placeholder="Nueva contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {msg && <p className="info">{msg}</p>}
        <button className="btn-primary">Restablecer</button>
      </form>
    </main>
  );
}