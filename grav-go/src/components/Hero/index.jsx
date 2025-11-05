import React from 'react';
import './styles.css';
import logo from '../../assets/grav-go.jpg';

export default function Hero({ onShowBalance }){
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h2 className="kicker">Delivery para la U</h2>
          <h1>Recibe tu pedido en la universidad</h1>
          <p className="lead">Comparte tu número de pedido de PedidosYa y nosotros lo rastreamos. Cuando llegue a la universidad, pagas una tarifa y te lo llevamos al punto que elijas (cafetería, biblioteca o aula).</p>
          <a className="btn btn-orange btn-lg" href="#rastreo">Rastrear pedido</a>
          <button id="btn-balance-hero" className="btn btn-orange btn-lg ms-3" onClick={onShowBalance}>Ver saldo</button>
        </div>

        <div className="hero-art">
          <div className="app-logo-large" id="app-logo-large">
            <img src={logo} alt="Grav-Go logo grande" className="app-logo-img" />
          </div>
        </div>
      </div>
    </section>
  );
}
