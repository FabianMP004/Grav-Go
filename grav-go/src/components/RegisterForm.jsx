import React, { useState } from 'react';

export default function RegisterForm({ onRegistered, switchToLogin }){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try{
      const res = await fetch('https://grav-go.onrender.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }
      if(!res.ok){
        const msg = (data && data.errors && data.errors[0] && data.errors[0].msg) || data?.message || `Error ${res.status}`;
        setError(msg);
        setLoading(false);
        return;
      }
      setSuccess('Registro exitoso. Por favor inicia sesión.');
      // after short delay, switch to login
      setTimeout(()=>{ switchToLogin(); }, 900);
      onRegistered && onRegistered(data.user);
    }catch(err){ console.error(err); setError('Network error'); }
    finally{ setLoading(false); }
  }

  return (
    <div className="auth-card">
      <h3>Crear cuenta</h3>
      <form onSubmit={submit}>
        <div className="mb-2">
          <label className="form-label">Nombre</label>
          <input className="form-control" type="text" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Correo</label>
          <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-orange" type="submit" disabled={loading}>{loading ? 'Creando...' : 'Registrar'}</button>
          <button type="button" className="btn btn-link" onClick={switchToLogin}>Ya tengo cuenta</button>
        </div>
        {error && <div className="text-danger small mt-2">{error}</div>}
        {success && <div className="text-success small mt-2">{success}</div>}
      </form>
    </div>
  );
}
