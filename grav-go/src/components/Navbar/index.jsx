import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import logo from '../../assets/grav-go.jpg';

export default function Navbar({ onShowBalance, currentUser, onLogout }){
  return (
    <nav className="navbar-custom">
      <div className="container navbar-inner">
        <div className="brand">
          <div className="logo-placeholder">
            <img src={logo} alt="logo" className="logo-img" />
          </div>
          <span className="fw-bold">Grav-Go</span>
        </div>
        <div className="links">
          <a href="#how" className="nav-link">Cómo funciona</a>
          <a href="#rastreo" className="nav-link">Rastrear pedido</a>
        </div>
        <div className="actions">
          {currentUser ? (
            <UserMenu user={currentUser} onShowBalance={onShowBalance} onLogout={onLogout} />
          ) : null}
        </div>
      </div>
    </nav>
  );
}

function UserMenu({ user, onShowBalance, onLogout }){
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(()=>{
    function onDoc(e){
      if(!ref.current) return;
      if(!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return ()=> document.removeEventListener('click', onDoc);
  },[]);

  return (
    <div className="user-menu" ref={ref}>
      <span className="greeting">Hola, <strong>{user.name}</strong></span>
      <button className="user-trigger" onClick={()=>setOpen(o=>!o)} aria-haspopup="true" aria-expanded={open} aria-label="Abrir menú de usuario">
        <span className="hamburger" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      {open && (
        <div className="user-dropdown" role="menu">
          <button className="dropdown-item" onClick={()=>{ onShowBalance && onShowBalance(); setOpen(false); }}>Ver saldo</button>
          <button className="dropdown-item" onClick={()=>{ onLogout && onLogout(); setOpen(false); }}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}
