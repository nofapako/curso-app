import { useState } from 'react';

export default function Login({ onAuth, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
      onAuth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>Curso por Días</h1>
        <h2 style={subtitle}>Iniciar sesión</h2>
        <form onSubmit={handleSubmit} style={form}>
          <input
            style={input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={errorStyle}>{error}</p>}
          <button style={btn} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={link}>
          ¿No tienes cuenta?{' '}
          <span style={linkText} onClick={onSwitch}>
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}

const container = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const card = { background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 2px 16px #0001', width: '100%', maxWidth: '400px' };
const title = { fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.25rem', color: '#4f46e5' };
const subtitle = { fontSize: '1.1rem', fontWeight: 500, marginBottom: '1.5rem', color: '#555' };
const form = { display: 'flex', flexDirection: 'column', gap: '0.75rem' };
const input = { padding: '0.75rem 1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' };
const btn = { padding: '0.75rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, marginTop: '0.25rem' };
const errorStyle = { color: '#dc2626', fontSize: '0.875rem' };
const link = { marginTop: '1rem', textAlign: 'center', color: '#555', fontSize: '0.9rem' };
const linkText = { color: '#4f46e5', cursor: 'pointer', fontWeight: 600 };
