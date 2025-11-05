import React from 'react';
import './styles.css';
import logo from '../../assets/grav-go.jpg';

export default function Navbar({ onShowBalance, currentUser }){
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
          {currentUser && <span className="me-2 small muted">Hola, {currentUser.name}</span>}
          <button className="btn btn-sm btn-outline-primary" onClick={onShowBalance}>Ver saldo</button>
        </div>
      </div>
    </nav>
  );
}
