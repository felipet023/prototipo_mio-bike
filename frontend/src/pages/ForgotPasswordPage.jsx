import { useState } from 'react';
import { forgotPassword } from '../services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await forgotPassword(email);
      setMsg(r.message);
      if (r.debug_token) setToken(r.debug_token);
    } catch (err) { setMsg(err.message); }
    finally { setLoading(false); }
  }

  return (
    <main className="page auth">
      <h1>Recuperar contraseña</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {msg && <p className="info">{msg}</p>}
        {token && <p className="info">Token de prueba: <code>{token}</code></p>}
        <button className="btn-primary" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</button>
      </form>
    </main>
  );
}