import React, { useState } from 'react';
import './styles.css';

export default function AuthOverlay({ users = [], onLogin, onRegister, visible }){
  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState('');

  // login form
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.elements['login-email'].value.trim().toLowerCase();
    const pwd = e.target.elements['login-password'].value;
    if(!email || !pwd){ setMessage('Introduce correo y contraseña.'); return; }
    const found = users.find(u => u.email === email && u.password === pwd);
    if(!found){ setMessage('Correo o contraseña incorrectos.'); return; }
    setMessage('Login correcto.');
    onLogin && onLogin(found);
  }

  // register form
  const handleRegister = (e) => {
    e.preventDefault();
    const name = e.target.elements['reg-name'].value.trim();
    const email = e.target.elements['reg-email'].value.trim().toLowerCase();
    const pwd = e.target.elements['reg-password'].value;
    if(!name || !email || !pwd){ setMessage('Completa todos los campos para registrarte.'); return; }
    const exists = users.find(u => u.email === email);
    if(exists){ setMessage('Ya existe una cuenta con ese correo.'); return; }
    const newUser = { name, email, password: pwd, balance: 8.5 };
    setMessage('Registro exitoso.');
    onRegister && onRegister(newUser);
  }

  if(!visible) return null;

  return (
    <div className="auth-overlay-component">
      <div className="auth-card">
        <div className="text-center mb-3">
          <img src={process.env.PUBLIC_URL + '/grav-go.jpg'} alt="logo" className="auth-logo mb-2" />
          <h3>Bienvenido a Grav-Go</h3>
          <p className="text-muted small">Inicia sesión o regístrate para continuar</p>
          <div className="text-danger small mt-1" aria-live="polite">{message}</div>
        </div>

        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button className={`nav-link ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setMessage(''); }}>Iniciar sesión</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className={`nav-link ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setMessage(''); }}>Registrar</button>
          </li>
        </ul>

        <div className="tab-content mt-3">
          {mode === 'login' && (
            <div className="tab-pane show active">
              <form onSubmit={handleLogin} id="login-form">
                <div className="mb-2">
                  <label className="form-label">Correo</label>
                  <input name="login-email" type="email" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input name="login-password" type="password" className="form-control" required />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <button type="submit" className="btn btn-orange">Iniciar sesión</button>
                  <button type="button" className="btn btn-link" onClick={() => { setMode('register'); setMessage(''); }}>Crear cuenta</button>
                </div>
              </form>
            </div>
          )}

          {mode === 'register' && (
            <div className="tab-pane show active">
              <form onSubmit={handleRegister} id="register-form">
                <div className="mb-2">
                  <label className="form-label">Nombre</label>
                  <input name="reg-name" type="text" className="form-control" required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Correo</label>
                  <input name="reg-email" type="email" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input name="reg-password" type="password" className="form-control" required />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <button type="submit" className="btn btn-orange">Registrar</button>
                  <button type="button" className="btn btn-link" onClick={() => { setMode('login'); setMessage(''); }}>Ya tengo cuenta</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
