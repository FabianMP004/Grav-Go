import React, { useState } from 'react';

export default function LoginForm({ onLogin, switchToRegister }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try{
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      // try to parse JSON response (may fail if server is down or returns non-json)
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }
      if(!res.ok){
        const msg = (data && data.errors && data.errors[0] && data.errors[0].msg) || data?.message || `Error ${res.status}`;
        setError(msg);
        setLoading(false);
        return;
      }
      // data: { token, user }
      onLogin && onLogin(data.user, data.token);
    }catch(err){
      console.error('Login fetch error:', err);
      setError(err.message || 'Network error');
    }finally{ setLoading(false); }
  }

  return (
    <div className="auth-card">
      <h3>Iniciar sesión</h3>
      <form onSubmit={submit}>
        <div className="mb-2">
          <label className="form-label">Correo</label>
          <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-orange" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          <button type="button" className="btn btn-link" onClick={switchToRegister}>Crear cuenta</button>
        </div>
        {error && <div className="text-danger small mt-2">{error}</div>}
      </form>
    </div>
  );
}
